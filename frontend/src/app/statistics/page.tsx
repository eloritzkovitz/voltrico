"use client";
import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {GRAPH_COLORS, GROUP_OPTIONS} from "@/constants/statistics";
import productService from "@/services/product-service";
import { Product } from "@/types/product";

const Statistics: React.FC = () => {
  const [groupByOption, setGroupByOption] = useState<string>("category");
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<Product[]>([]);
  const [chartData, setChartData] = useState<{ key: string; count: number }[]>([]);

  // Fetch all items on component mount
  useEffect(() => {
    const fetchAllItems = async () => {
      setLoading(true);
      try {
        const data = await productService.getAllProducts();
        setItems(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllItems();
  }, []);

  // Group items and render charts
  useEffect(() => {
    if (items.length > 0) {
      const grouped = items.reduce((acc: Record<string, number>, item) => {
        let key: string = "Unknown";
        switch (groupByOption) {
          case "category":
            key = item.category ?? "Unknown";
            break;
          case "madeIn":
            key = item.madeIn ?? "Unknown";
            break;
          case "color":
            key = item.color ?? "Unknown";
            break;
          case "distributor":
            key = item.distributor ?? "Unknown";
            break;
          case "quality":
            key = item.quality ?? "Unknown";
            break;
          default:
            key = "Unknown";
        }
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});
      const data = Object.entries(grouped).map(([key, count]) => ({ key, count }));
      setChartData(data);
    }
  }, [items, groupByOption]);

  return (
    <div className="container mx-auto mt-8 px-4">
      <h4 className="text-2xl font-semibold text-center mb-6">Show Statistics</h4>
      <main>
        {/* Group By Dropdown */}
        <div className="mb-4 flex justify-center">
          <select
            value={groupByOption}
            onChange={(e) => setGroupByOption(e.target.value)}
            aria-label="Group by option"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {GROUP_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Charts Container */}
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8 charts-container">
            <div className="chart border rounded p-3 w-full md:w-1/2" style={{ height: "400px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="count"
                    nameKey="key"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ key, percent }) =>
                      `${key}: ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={GRAPH_COLORS[index % GRAPH_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart border rounded p-3 w-full md:w-1/2" style={{ height: "400px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="key" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#0088FE">
                    {chartData.map((entry, index) => (
                      <Cell key={`bar-cell-${index}`} fill={GRAPH_COLORS[index % GRAPH_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Statistics;