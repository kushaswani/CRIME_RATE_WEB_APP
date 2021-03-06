﻿# USA Gun Violence Scout

Crime Rate Scout is a web application that allows user to interactively explore the gun violence incidents that happened between January 2013 and March 2018 within the USA. The gun violence incidents data is from [Gun Violence Archive's website](https://github.com/jamesqo/gun-violence-data), demograhics data is fetched through the tidycensus library in R. Got zipcode level gun violence data from latitude and longitude level data through ZIP Code Tabulation Areas shapefiles (~260k incidents).

User could click a state on the USA MAP, and system would filter all incident by that clicked state, and visualizes them with coordinated view by showing number of victims on that clicked state. User can also go the article/source for the incident by clicking on the location pin of the incident.

**Allow user to query the gun violence for a zip code within USA, and our system returns safest area in the neighborhood based on number of gun violence, renders the neighbor map with cartographic boundary for each zip code in the near by.**

A working demo can be found [here](https://drive.google.com/file/d/1XFdgPlJ_HcQCIy3Xssixiafc_1f2NDZZ/view)


# System Design

We use gun violence dataset From http://www.gunviolencearchive.org to build an Interactive  Choropleth Map For USA. Using MongoDB for storing and querying the data, Based On Python, We use Flask to interacts with MongoDb. Front-end, we use D3.js, Dc.js and Crossfilter.js to build graph with interactivity.We use [MapShaper](https://github.com/mbloch/mapshaper)  to compress and simplify cartographic boundary dataset the use [cartoDB](https://carto.com)
 to store [cartographic boundary for every Zip Code in USA](https://www2.census.gov/geo/tiger/TIGER2014/ZCTA5/).  And renders the map with cartographic boundary for a list of Zipcode nearby the zipcode that was queried by an user.




![UI](Home.png)
After click NY on USA map and group incident by a time range between mid 2014 to mid 2016
![UI](filter.png)
View to enable search a safe zip code based on the number of gun violence
![UI2](searchzipcode.png)
Result after search
![UI3](search.png)
General coordinated view to show trends of gun violence in USA, like Top cities that people got killed, top zip code people got killed.
![UI4](trends.png)
now we click CA(California), User even can filter those gun violence to find out the information like top cities(all city of California) that people got killed only for that clicked state(California). Result be like:
![UI5](trends2.png)
## Installation

Download or clone this repository:

```bash
git clone https://github.com/kushaswani/CRIME_RATE_WEB_APP.git
```
The dependencies for the project can be installed using

```
$ pip install -r requirements.txt
```


## License

MIT License. See [`LICENSE.md`](LICENSE.md).




# To get preprocessed dataset

Please email kushaswani@gmail.com or haodong.zheng@rutgers.edu or nishant.kumar9500@gmail.com

