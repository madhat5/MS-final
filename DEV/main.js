// console.log('sim sim salabim')

let svg = d3.select("svg"),
  margin = 20,
  diameter = +svg.attr("width"),
  g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

let color = d3.scaleLinear()
  .domain([-1, 5])
  .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
  .interpolate(d3.interpolateHcl);

let pack = d3.pack()
  .size([diameter - margin, diameter - margin])
  .padding(2);

d3.json("data/flare.json", (err, data) => {
  // console.log(data)
  if (err) throw err;

  data = d3.hierarchy(data)
    .sum((d) => {
      return d.size;
    })
    .sort((a, b) => {
      return b.value - a.value;
    });

  let focus = data,
    nodes = pack(data).descendants(),
    view;

  let circle = g.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("class", (d) => {
      return d.parent ? d.children ? "node" : "node node--leaf" : "node node--data";
    })
    .style("fill", (d) => {
      return d.children ? color(d.depth) : null;
    })
    .on("click", (d) => {
      if (focus !== d) zoom(d), d3.event.stopPropagation();
    });

  let text = g.selectAll("text")
    .data(nodes)
    .enter().append("text")
    .attr("class", "label")
    .style("fill-opacity", (d) => {
      return d.parent === data ? 1 : 0;
    })
    .style("display", (d) => {
      return d.parent === data ? "inline" : "none";
    })
    .text((d) => {
      return d.data.name;
    });

  let node = g.selectAll("circle,text");

  svg
    .style("background", color(-1))
    .on("click", () => {
      zoom(data);
    });

  zoomTo([data.x, data.y, data.r * 2 + margin]);

  function zoom(d) {
    let focus0 = focus;
    focus = d;

    let transition = d3.transition()
      .duration(d3.event.altKey ? 7500 : 750)
      .tween("zoom", (d) => {
        let i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
        return (t) => {
          zoomTo(i(t));
        };
      });

    transition.selectAll("text")
      .filter(function (d) {
        return d.parent === focus || this.style.display === "inline";
      })
      .style("fill-opacity", function (d) {
        return d.parent === focus ? 1 : 0;
      })
      .on("start", function (d) {
        if (d.parent === focus) this.style.display = "inline";
      })
      .on("end", function (d) {
        if (d.parent !== focus) this.style.display = "none";
      });
  }

  function zoomTo(v) {
    let k = diameter / v[2];
    view = v;
    node.attr("transform", (d) => {
      return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
    });
    circle.attr("r", (d) => {
      return d.r * k;
    });
  }
});