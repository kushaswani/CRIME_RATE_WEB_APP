queue()     //asynchronous call back, when all data loaded , continue to call make graphs
    .defer(d3.json, "/first1/hand")  //main dataset group by zipcode
    .await(makeGraphs);

function makeGraphs(error, projectsJson) {
  console.log('test_if i already in here');
  var crimeProjects = projectsJson;
  console.log(projectsJson)
  var dateFormat = d3.time.format("%-m/%-d/%Y");
  crimeProjects.forEach(function(d){
    d["date"] = dateFormat.parse(d["date"]);
    d["date"].setDate(1);
    d["n_killed"]=+d["n_killed"];
    d["n_injured"]=+d["n_injured"];
    d["n_male_victim"]=+d["n_male_victim"];
    d["n_female_victim"]=+d["n_female_victim"];
});

  //Define Dimensions
//   function reduceInitial() {
//     return {
//         zip_code: 90012
//     };
// }
  var ndx = crossfilter(crimeProjects);
  // var ndx_new = ndx.group(function(d){return d["zip_code"]==900})
  var dateDim = ndx.dimension(function(d) { return d["date"]; });
  var total_killed = ndx.dimension(function(d) { return d["n_killed"]; });
  var total_injured = ndx.dimension(function(d) { return d["n_injured"]; });


  //-------- for victim chart---------
  var n_child_dim = dateDim.group().reduceSum(function (d) { return d["n_child_victim"]; });
  var n_teen_dim = dateDim.group().reduceSum(function (d) { return d["n_teen_victim"]; });
  var n_adult_dim = dateDim.group().reduceSum(function (d)  { return d["n_adult_victim"]; });

  //--------****-----------

  //Calculate metrics
  var totalkilled_male = dateDim.group().reduceSum(function(d) {
		return d["n_male_victim"];
	});

  var totalkilled_female = dateDim.group().reduceSum(function(d) {
    return d["n_male_victim"];
  });

  var all = ndx.groupAll();
  var totalkilled = ndx.groupAll().reduceSum(function(d) {return d["n_killed"];});
  var totalinjured = ndx.groupAll().reduceSum(function(d) {return d["n_injured"];});

  //Define values (to be used in charts)
  var minDate = dateDim.bottom(1)[0]["date"];
  var maxDate = dateDim.top(1)[0]["date"];

  //chart
  var numberProjectsND = dc.numberDisplay("#number-projects-nd");
  var victimND = dc.compositeChart("#victim-chart");



  victimND
  .width(600)
  .height(250)
  .margins({ top: 10, right: 10, bottom: 20, left: 40 })
  .dimension(dateDim)
  .transitionDuration(500)
  .brushOn(true)
  .valueAccessor(function(d){return d; })
  // .x(d3.scale.linear().domain([0, 10000]))
  .x(d3.time.scale().domain([minDate, maxDate]))
  .elasticY(true)
  .compose([
        dc.lineChart(victimND).group(n_child_dim,"child_victim").colors(['#ff80c0']),
        dc.lineChart(victimND).group(n_teen_dim,"teen_victim").colors(['#ff8080']),
        dc.lineChart(victimND).group(n_adult_dim,"adult_victim").colors(['#ffc080']),
    ]);





  numberProjectsND
  .formatNumber(d3.format("d"))
  .valueAccessor(function(d){return d; })
  .group(all);

  dc.renderAll();

};
