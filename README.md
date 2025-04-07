# TDM-PP-Traffic-Volume-Forecasts

This repo contains processing jupyter notebooks and two web applications. The notebooks are used to generate data for use in the web applications. The first web application The ART (Adjust & Review Tool) of Forecasting is used for manual review and adjustments. The audience are internal reviewers and forecasters. The final web application is the Traffic Volume Map that is used to display the final forecating and SE results for a more general audience.

**1-Get-Historic-Data-and-Factors.ipynb:** Historic Average Annual Daily Traffic (AADT) data is gathered and defined for each segment. This includes AADT from existing segment files, as well as matching to AADT data from Utah Department of Transportation's (UDOT) published AADT files.

**2-Prepare-Linear-Forecasts.ipynb:** Linear trend lines are created off from least-square regression fit of the historic AADT. These trend lines are created for a user-defined set of year ranges, eg. 2011-2023 linear forecast.

**3-Prepare-Model-Forecasts.ipynb:** The model forecast is the base year error factor (base year volume - model volume) applied to each future year model volume.

**4-Prepare-Forecast-App-Data.ipynb:** This notebook prepares the data for use in the interactive arcgis javascript based web tool contained in this repo. An ArcGIS Online feature service that contains the segments and fields needed for review and adjustment is created in this step for use in the web app ART (Adjust & Review Tool) of Forecasting for Traffic Volume and Transit Ridership Forecasts. This tool allows modelers to review each segment, including linear trend lines and model forecasts. A manual adjustment can be made to any future year to tune the forecast based on professional judgement. Flags and comment fields help aid quality assurance and quality checking (QA/QC).

**5-Download-Forecasts.ipynb:** This notebook downloads the data from the ArcGIS online feature services that is modified in the ART of Forecasting. The data includes model forecasts and adjustments that create the final forecast.

**6-Prepare-Traffic-Volume-Map-Data.ipynb:** This notebook generates data for use in the Traffic Volume Map. The layers needed for the map include change layers that are the difference between forecast years. The final result is a shapefile that is then uploaded to ArcGIS online for use int he web application. The Esri web app builder (WAB) app is found in the `_site-traffic-volume-map` folder with most of the custom code found in the `/widgets/ForecastSidebar` folder.

**7-Prepare-Forecasts-For-Volume-Map.ipynb:** This notebook creates the JSON files needed to display the forecast chart and table in the sidebar. 

**8-Prepare-SE-Jsons-For-Volume-Map.ipynb:** This notebook creates the JSON files needed to display socioeconomic data. The socioeconomic layers are added to the web application manually outside of this notebook structure.

**_toDo.txt:** A list of things to do in future.
