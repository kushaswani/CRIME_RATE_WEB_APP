
queue()     //asynchronous call back, when all data loaded , continue to call make graphs
    .defer(d3.json, "/first1/projects")
    .defer(d3.json, "static/geojson/us-states.json")
    .await(makeGraphs);

function makeGraphs(error, projectsJson, statesJson) {    //pass db.proejcts and us-states to function
  var crimeProjects = projectsJson;
  // var dateFormat = d3.time.format("%Y-%m-%d");
  var dateFormat = d3.time.format("%-m/%-d/%Y");
  crimeProjects.forEach(function(d){
    d["date"] = dateFormat.parse(d["date"]);
    d["date"].setDate(1);
    d["n_killed"]=+d["n_killed"];
    d["n_injured"]=+d["n_injured"];
    d["n_teen"]=+d["n_teen"];
    d["n_child_victim"]=+d["n_child_victim"];
  });


  var ndx = crossfilter(crimeProjects);
  //Define Dimensions
  var dateDim = ndx.dimension(function(d) { return d["date"]; });
  var stateDim = ndx.dimension(function(d) { return d["state_ab"]; });
  var n_gun_Dim = ndx.dimension(function(d){return d["n_guns_involved"];});
  var total_killed = ndx.dimension(function(d) { return d["n_killed"]; });
  var total_injured = ndx.dimension(function(d) { return d["n_injured"]; });

  //Calculate metrics
  var numProjectsByDate = dateDim.group();
  var numGun = n_gun_Dim.group();
  var totalnumkilledByState = stateDim.group().reduceSum(function(d) {
		return d["n_killed"];
	});
  var totalnuminjuredByState = stateDim.group().reduceSum(function(d) {
		return d["n_injured"];
	});


  var all = ndx.groupAll();
  var totalkilled = ndx.groupAll().reduceSum(function(d) {return d["n_killed"];});
  var totalinjured = ndx.groupAll().reduceSum(function(d) {return d["n_injured"];});


  var max_killed_state = totalnumkilledByState.top(1)[0].value;
  var max_injured_state = totalnuminjuredByState.top(1)[0].value;

  //Define values (to be used in charts)
	var minDate = dateDim.bottom(1)[0]["date"];
	var maxDate = dateDim.top(1)[0]["date"];

  //charts
  var timeChart = dc.barChart("#time-chart");
  var usChart = dc.geoChoroplethChart("#us-chart");
  var numberincidentsND = dc.numberDisplay("#number-projects-nd");
	var totalkilledND = dc.numberDisplay("#total-donations-nd");
  var totalinjuredND = dc.numberDisplay("#total-injured-nd");

  numberincidentsND
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);


  totalkilledND
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(totalkilled)
		.formatNumber(d3.format(".3s"));

  totalinjuredND
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(totalinjured)
		.formatNumber(d3.format(".3s"));

  timeChart
  .width(600)
  .height(160)
  .margins({top: 10, right: 50, bottom: 30, left: 50})
  .dimension(dateDim)
  .group(numProjectsByDate)
  .transitionDuration(500)
  .x(d3.time.scale().domain([minDate, maxDate]))
  .elasticY(true)
  .xAxisLabel("Year")
  .yAxis().ticks(4);


  usChart.width(1000)
		.height(330)
		.dimension(stateDim)
		.group(totalnumkilledByState)
		.colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
		.colorDomain([0, max_killed_state])
		.overlayGeoJson(statesJson["features"], "state_ab", function (d) {
			return d.properties.name;
		})
		.projection(d3.geo.albersUsa()
    				.scale(600)
    				.translate([340, 150]))
		.title(function (p) {
			return "State: " + p["key"]
					+ "\n"
					+ "Total Num of Killed: " + Math.round(p["value"]) + " $";
		})



  dc.renderAll();

};
