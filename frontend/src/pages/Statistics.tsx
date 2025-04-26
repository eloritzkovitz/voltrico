import React, { useState, useEffect } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
import itemService, { Item } from "../services/item-service";
import * as d3 from "d3";

const Statistics: React.FC = () => {
  const [groupByOption, setGroupByOption] = useState<string>("category");
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<Item[]>([]);

  // Fetch all items on component mount
  useEffect(() => {
    const fetchAllItems = async () => {
      setLoading(true);
      try {
        const data = await itemService.getAllItems();
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllItems();
  }, []);

  // Group items and render charts
  useEffect(() => {
    if (items.length > 0) {
      renderCharts(items, groupByOption);
    }
  }, [items, groupByOption]);

  const renderCharts = (data: Item[], groupBy: string) => {
    // Group data by the selected option
    const groupedData = d3.group(data, (d: any) => d[groupBy]);

    // Prepare data for the first chart (Pie Chart)
    const pieData = Array.from(groupedData, ([key, value]) => ({
      key,
      count: value.length,
    }));

    // Render Pie Chart
    const graph1 = d3.select("#graph1");
    graph1.selectAll("*").remove();

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const pie = d3.pie<any>().value((d) => d.count);
    const arc = d3.arc<any>().innerRadius(0).outerRadius(radius);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const svg1 = graph1
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    svg1
      .selectAll("path")
      .data(pie(pieData))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (_, i) => color(i.toString()))
      .attr("stroke", "white")
      .style("stroke-width", "2px");

    svg1
      .selectAll("text")
      .data(pie(pieData))
      .enter()
      .append("text")
      .text((d) => `${d.data.key}: ${d.data.count}`)
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .style("text-anchor", "middle")
      .style("font-size", "12px");

    // Prepare data for the second chart (Bar Chart)
    const barData = pieData;

    // Render Bar Chart
    const graph2 = d3.select("#graph2");
    graph2.selectAll("*").remove();

    const barWidth = 400;
    const barHeight = 400;
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };

    const x = d3
      .scaleBand()
      .domain(barData.map((d) => d.key))
      .range([0, barWidth - margin.left - margin.right])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(barData, (d) => d.count)!])
      .range([barHeight - margin.top - margin.bottom, 0]);

    const svg2 = graph2
      .append("svg")
      .attr("width", barWidth)
      .attr("height", barHeight)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    svg2
      .selectAll(".bar")
      .data(barData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.key)!)
      .attr("y", (d) => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", (d) => barHeight - margin.top - margin.bottom - y(d.count))
      .attr("fill", "steelblue");

    svg2
      .append("g")
      .attr("transform", `translate(0, ${barHeight - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg2.append("g").call(d3.axisLeft(y));
  };

  return (
    <Container className="mt-4">
      <header className="mb-4">
        <h1 className="text-center">Show Statistics</h1>
      </header>

      <main>
        {/* Group By Dropdown */}
        <Row className="mb-4">
          <Col md={6}>
            <Form.Select
              value={groupByOption}
              onChange={(e) => setGroupByOption(e.target.value)}
              aria-label="Group by option"
            >
              <option value="category">Category</option>
              <option value="madeIn">Made In</option>
              <option value="color">Color</option>
              <option value="distributor">Brand</option>
              <option value="quality">Quality</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Charts Container */}
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <Row className="charts-container">
            <Col md={6}>
              <div
                id="graph1"
                className="chart border rounded p-3"
                style={{ width: "100%", height: "400px" }}
              ></div>
            </Col>
            <Col md={6}>
              <div
                id="graph2"
                className="chart border rounded p-3"
                style={{ width: "100%", height: "400px" }}
              ></div>
            </Col>
          </Row>
        )}
      </main>
    </Container>
  );
};

export default Statistics;