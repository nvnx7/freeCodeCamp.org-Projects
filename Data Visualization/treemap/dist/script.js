const datasets = {
  videogames: {
    title: 'Video Game Sales',
    description: 'Top 100 Most Sold Video Games Grouped by Platform',
    url: 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json' },

  movies: {
    title: 'Movie Sales',
    description: 'Top 100 Highest Grossing Movies Grouped By Genre',
    url: 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json' },

  kickstarters: {
    title: 'Kickstarter Pledges',
    description: 'Top 100 Most Pledged Kickstarter Campaigns Grouped By Category',
    url: 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json' } };



let urlParams = new URLSearchParams(window.location.search);
const defaultDataset = 'videogames';
const dataset = datasets[urlParams.get('data') || defaultDataset];

let svg = d3.select('#treemap');

document.getElementById('title').innerHTML = dataset.title;
document.getElementById('description').innerHTML = dataset.description;

let treemap = d3.treemap().
size([950, 600]).
paddingInner(1);

let fader = color => {
  return d3.interpolateRgb(color, "#fff")(0.2);
};

let color = d3.scaleOrdinal(d3.schemeCategory20.map(fader));

let format = d3.format(",d");

let tooltip = d3.select('.container').
append('div').
attr('id', 'tooltip');

d3.json(dataset.url, (error, data) => {
  if (error) throw error;

  let root = d3.hierarchy(data).
  eachBefore(d => {
    d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
  }).
  sum(d => d.value).
  sort((a, b) => {
    return b.height - a.height || b.value - a.value;
  });

  treemap(root);

  let cell = svg.selectAll('g').
  data(root.leaves()).
  enter().
  append('g').
  attr('class', 'cell').
  attr('transform', d => {
    return "translate(" + d.x0 + ", " + d.y0 + ")";
  });

  let tile = cell.append('rect').
  attr('class', 'tile').
  attr('id', d => d.data.id).
  attr('width', d => d.x1 - d.x0).
  attr('height', d => d.y1 - d.y0).
  attr('data-name', d => d.data.name).
  attr('data-category', d => d.data.category).
  attr('data-value', d => d.data.value).
  attr('fill', d => color(d.data.category)).
  on('mousemove', d => {
    tooltip.style('opacity', 0.9);
    tooltip.html(
    'Name: ' + d.data.name +
    '<br>Category: ' + d.data.category +
    '<br>Value: ' + d.data.value).

    attr('data-value', d.data.value).
    style('left', d3.event.pageX + 10 + 'px').
    style('top', d3.event.pageY - 20 + 'px');
  }).
  on('mouseout', d => {
    tooltip.style('opacity', 0);
  });

  cell.append('text').
  attr('class', 'tile-text').
  selectAll('tspan').
  data(d => d.data.name.split(" ")).
  enter().
  append('tspan').
  attr('x', d => 5).
  attr('y', (d, i) => 15 + i * 12).
  attr('font-size', '10px').
  text(d => d);

  let categories = root.leaves().map(node => {
    return node.data.category;
  });

  categories = categories.filter(function (category, index, self) {
    return self.indexOf(category) === index;
  });

  let legend = d3.select('#legend');

  const legendOffset = 10;
  const legendRectSize = 15;
  const legendHSpace = 150;
  const legendVSpace = 15;
  const legendTextXOffset = 15;
  const legendTextYOffset = 3;
  const legendElementsPerRow = Math.floor(600 / legendHSpace);

  let legendElement = legend.append('g').
  selectAll('g').
  data(categories).
  enter().
  append('g').
  attr("transform", function (d, i) {
    return 'translate(' +
    i % legendElementsPerRow * legendHSpace + ',' + (
    Math.floor(i / legendElementsPerRow) * legendRectSize + legendVSpace * Math.floor(i / legendElementsPerRow)) + ')';
  });

  legendElement.append('rect').
  attr('width', 25).
  attr('height', 25).
  attr('class', 'legend-item').
  attr('fill', d => color(d));

  legendElement.append('text').
  attr('x', legendRectSize + legendTextXOffset).
  attr('y', legendRectSize + legendTextYOffset).
  text(d => d).
  attr('font-size', '13px');

});