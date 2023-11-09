// eslint-disable-next-line import/no-extraneous-dependencies
import * as d3 from "d3";

const render = () => {
  const cities = ["London", "New York", "Sydney", "Paris", "Beijing"];
  cities.sort();
  const chartContainer = d3.select("#chart-container");
  const svg = chartContainer.append("svg");

  const sortButton = chartContainer.append("button");
  const updateButton = chartContainer.append("button");
  const addButton = chartContainer.append("button");
  const addInput = chartContainer.append("input");

  let svgHeight = 140;
  let isSorted = false;
  const width = 500;
  svg.style("width", 760).style("height", svgHeight);

  const bars = svg.append("g");
  bars.attr("transform", "translate(70,30)");
  const label = svg.append("g");
  label.attr("transform", "translate(66, 30)");

  const x = d3.scaleLinear();
  const y = d3.scaleBand();

  const sortData = () => {
    isSorted = true;
    bars
      .selectAll("rect")
      .sort((a, b) => b.population - a.population)
      .attr("y", (d, i) => y(i));

    label
      .selectAll("text")
      .sort((a, b) => b.population - a.population)
      .attr("y", (d, i) => 13 + y(i));
  };

  const update = (data) => {
    x.domain([0, d3.max(data, (d) => d.population)]).range([0, width]);

    y.domain(d3.range(data.length)).range([0, 20 * data.length]);

    bars
      .selectAll("rect")
      .data(data, (d) => d.city)
      .join("rect")
      .attr("height", 19)
      .attr("width", (d) => x(d.population))
      .attr("y", (d, i) => y(i))
      .style("fill", "gray");

    label.style("text-anchor", "end");
    label
      .selectAll("text")
      .data(data)
      .join("text")
      .attr("y", (d, i) => 13 + y(i))
      .text((d) => d.city);

    if (isSorted) {
      sortData();
    }
  };

  const updateData = () => {
    const newCitiesData = [];
    cities.forEach((city) => {
      const population = Math.ceil(Math.random() * 10000000);
      newCitiesData.push({ city, population });
    });
    return newCitiesData;
  };

  const updateAll = () => {
    update(updateData(cities));
  };

  const addCity = (cityName) => {
    if (cityName.trim() && cities.indexOf(cityName) === -1) {
      cities.push(cityName);
      cities.sort();
      svgHeight += 28;
      svg.style("height", svgHeight);
      updateAll();
    }
  };

  updateAll();

  updateButton
    .text("Update")
    .style("width", 20)
    .style("height", 10)
    .on("click", updateAll);

  addButton
    .text("Add")
    .style("width", 20)
    .style("height", 10)
    .on("click", () => {
      addCity(addInput.node().value);
    });

  sortButton
    .text("Sort")
    .style("width", 20)
    .style("height", 10)
    .on("click", sortData);
};

export default render;
