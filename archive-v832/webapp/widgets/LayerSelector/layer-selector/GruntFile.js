var osx = 'OS X 10.10';
var windows = 'Windows 8.1';
var browsers = [{
    browserName: 'safari',
    platform: osx
}, {
    browserName: 'firefox',
    platform: windows
}, {
    browserName: 'chrome',
    platform: windows
}, {
    browserName: 'internet explorer',
    platform: windows,
    version: '11'
}, {
    browserName: 'internet explorer',
    platform: 'Windows 8',
    version: '10'
}, {
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '9'
}];

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    var defaultPort = 8001;
    var jasminePort = grunt.option('jasminePort') || defaultPort;
    var docPort = grunt.option('docPort') || jasminePort - 1;
    var testHost = 'http://localhost:' + jasminePort;
    var docHost = 'http:/localhost:' + docPort;
    var jsFiles = ['!bower_components', '!node_modules', '!.git', '!.grunt', '*.js', 'tests/**/*.js'];
    var otherFiles = ['templates/*.html', 'tests/*.html', 'resources/*.svg'];
    var bumpFiles = [
        'package.json',
        'bower.json'
    ];
    var sauceConfig = {
        urls: ['http://127.0.0.1:8001/tests/_specRunner.html'],
        tunnelTimeout: 120,
        build: process.env.TRAVIS_JOB_ID,
        browsers: browsers,
        testname: 'travis_' + process.env.TRAVIS_JOB_ID,
        maxRetries: 10,
        maxPollRetries: 10,
        public: 'public',
        throttled: 5,
        sauceConfig: {
            'max-duration': 1800
        },
        statusCheckAttempts: 500
    };
    try {
        var secrets = grunt.file.readJSON('secrets.json');
        sauceConfig.username = secrets.sauce_name;
        sauceConfig.key = secrets.sauce_key;
        sauceConfig.testname = 'local';
    } catch (e) {
        // swallow for build server
    }
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        amdcheck: {
            main: {
                options: {
                    removeUnusedDependencies: false
                },
                files: [{
                    src: 'Layer*.js'
                }]
            }
        },
        bump: {
            options: {
                files: bumpFiles,
                commitFiles: bumpFiles,
                push: false
            }
        },
        connect: {
            options: {
                livereload: true,
                port: jasminePort,
                base: '.'
            },
            docs: {
                options: {
                    port: docPort,
                    open: docHost + '/doc'
                }
            },
            open: {
                options: {
                    open: testHost + '/tests/_specRunner.html'
                }
            },
            jasmine: { }
        },
        documentation: {
            options: {
                destination: './doc'
            },
            LayerSelector: {
                files: [{
                    src: 'LayerSelector.js'
                }],
                options: {
                    github: true,
                    format: 'md',
                    filename: 'LayerSelector.md'
                }
            },
            LayerSelectorItem: {
                files: [{
                    src: 'LayerSelectorItem.js'
                }],
                options: {
                    github: true,
                    format: 'md',
                    filename: 'LayerSelectorItem.md'
                }
            },
            LayerSelectorHtml: {
                files: [{
                    src: 'LayerSelector.js'
                }]
            },
            LayerSelectorItemHtml: {
                files: [{
                    src: 'LayerSelectorItem.js'
                }]
            }
        },
        eslint: {
            options: {
                configFile: '.eslintrc'
            },
            main: {
                src: jsFiles
            }
        },
        jasmine: {
            main: {
                src: [],
                options: {
                    outfile: 'tests/_specRunner.html',
                    specs: ['tests/**/Spec*.js'],
                    vendor: [
                        'bower_components/jasmine-favicon-reporter/vendor/favico.js',
                        'bower_components/jasmine-favicon-reporter/jasmine-favicon-reporter.js',
                        'bower_components/jasmine-jsreporter/jasmine-jsreporter.js',
                        '../tests/dojoConfig.js',
                        'bower_components/dojo/dojo.js',
                        '../tests/jasmineAMDErrorChecking.js',
                        '../tests/jsReporterSanitizer.js'
                    ],
                    host: testHost
                }
            }
        },
        'saucelabs-jasmine': {
            all: {
                options: sauceConfig
            }
        },
        stylus: {
            main: {
                options: {
                    compress: false
                },
                files: [{
                    expand: true,
                    cwd: './',
                    src: ['resources/*.styl'],
                    dest: './',
                    ext: '.css'
                }]
            }
        },
        watch: {
            options: {
                livereload: true
            },
            amdcheck: {
                files: 'Layer*.js',
                tasks: ['amdcheck']
            },
            docs: {
                files: 'Layer*.js',
                tasks: ['documentation:LayerSelector', 'documentation:LayerSelectorItem']
            },
            docItem: {
                files: 'LayerSelectorItem.js',
                tasks: ['documentation:LayerSelectorItemHtml', 'documentation:LayerSelectorItem']
            },
            docSelector: {
                files: 'LayerSelector.js',
                tasks: ['documentation:LayerSelectorHtml', 'documentation:LayerSelector']
            },
            eslint: {
                files: jsFiles,
                tasks: ['newer:eslint:main', 'jasmine:main:build']
            },
            src: {
                files: jsFiles.concat(otherFiles)
            },
            stylus: {
                files: 'resources/*.styl',
                tasks: ['stylus']
            }
        }
    });

    grunt.registerTask('default', [
        'jasmine:main:build',
        'eslint:main',
        'amdcheck:main',
        'connect:jasmine',
        'stylus',
        'watch:src',
        'watch:eslint',
        'watch:stylus',
        'watch:amdcheck'
    ]);

    grunt.registerTask('launch', [
        'jasmine:main:build',
        'eslint:main',
        'amdcheck:main',
        'connect:open',
        'stylus',
        'watch:src',
        'watch:eslint',
        'watch:stylus',
        'watch:amdcheck'
    ]);

    grunt.registerTask('docs', [
        'documentation:LayerSelector',
        'documentation:LayerSelectorItem'
    ]);

    grunt.registerTask('doc-selector', [
        'documentation:LayerSelectorHtml',
        'connect:docs',
        'watch:docSelector'
    ]);

    grunt.registerTask('doc-selector-item', [
        'documentation:LayerSelectorItemHtml',
        'connect:docs',
        'watch:docItem'
    ]);

    grunt.registerTask('travis', [
        'eslint:main',
        'connect:jasmine',
        'jasmine:main:build',
        'saucelabs-jasmine'
    ]);
};
