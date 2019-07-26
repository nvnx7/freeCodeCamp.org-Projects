const educationDataUrl = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json";

const countiesDataUrl = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json";

let svg = d3.select("svg");

let unemployment = d3.map();
let path = d3.geoPath();

d3.queue().
defer(d3.json, countiesDataUrl).
defer(d3.json, educationDataUrl).
await(ready);

function ready(error, countiesData, educationData) {
  if (error) throw error;

  const maxEducationPercent = d3.max(educationData, d => d.bachelorsOrHigher);
  const minEducationPercent = d3.min(educationData, d => d.bachelorsOrHigher);

  let color = d3.scaleThreshold().
  domain(d3.range(minEducationPercent, maxEducationPercent,
  (maxEducationPercent - minEducationPercent) / 8)).
  range(d3.schemeGreens[9]);

  let xScale = d3.scaleLinear().
  domain([minEducationPercent, maxEducationPercent]).
  rangeRound([600, 860]);

  let legendGroup = svg.append('g').
  attr('id', 'legend').
  attr('transform', 'translate(0, 10)');

  legendGroup.selectAll('rect').
  data(color.range().map(d => {
    d = color.invertExtent(d);
    if (d[0] == null) d[0] = xScale.domain()[0];
    if (d[1] == null) d[1] = xScale.domain()[1];
    return d;
  })).
  enter().
  append('rect').
  attr('height', 10).
  attr('width', d => xScale(d[1]) - xScale(d[0])).
  attr('x', d => xScale(d[0])).
  attr('fill', d => color(d[0]));

  legendGroup.append('text').
  attr('class', 'caption').
  attr('x', xScale.range()[0]).
  attr('y', 1);

  let xAxis = d3.axisBottom(xScale).
  tickFormat(x => Math.round(x) + "%").
  tickSize(17).
  tickValues(color.domain());

  legendGroup.call(xAxis);

  let tooltip = d3.select('.wrapper').
  append('div').
  attr('id', 'tooltip');

  svg.append('g').
  attr('class', 'counties').
  selectAll('path').
  data(topojson.feature(countiesData, countiesData.objects.counties).features).
  enter().
  append('path').
  attr('class', 'county').
  attr('data-fips', d => d.id).
  attr('data-education', d => {
    let result = educationData.filter(val => {
      return val.fips == d.id;
    });

    if (result[0]) {
      return result[0].bachelorsOrHigher;
    }

    return 0;
  }).
  attr('d', path).
  attr('fill', d => {
    let result = educationData.filter(val => {
      return val.fips == d.id;
    });

    if (result[0]) {
      return color(result[0].bachelorsOrHigher);
    }

    return color(0);
  }).
  on('mouseover', d => {
    tooltip.style('opacity', 0.8);
    tooltip.html(() => {
      let result = educationData.filter(val => {
        return val.fips == d.id;
      });
      if (result[0]) {
        return result[0]['area_name'] + ", " + result[0]['state'] + ": " +
        result[0].bachelorsOrHigher + "%";
      }

      return 0;
    }).
    attr('data-education', () => {
      let result = educationData.filter(val => {
        return val.fips == d.id;
      });

      if (result[0]) {
        return result[0].bachelorsOrHigher;
      }

      return 0;
    }).
    style('left', d3.event.pageX + "px").
    style('top', d3.event.pageY - 40 + "px");
  }).
  on('mouseout', d => {
    tooltip.style('opacity', 0);
  });

  svg.append('path').
  datum(topojson.mesh(countiesData, countiesData.objects.states, (a, b) => {
    return a !== b;
  })).
  attr('class', 'states').
  attr('d', path);
}