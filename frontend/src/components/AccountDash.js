import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AgCharts } from "ag-charts-react";
import "../styling/AccountDash.css";

function AccountDash() {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") ?? "null");
  const storedData = JSON.parse(localStorage.getItem("data") ?? "null");

  const [chartOptions, setChartOptions] = useState(null);

  useEffect(() => {
    if (!storedUser) {
      navigate("/");
      return;
    }
    if (storedData) {
      console.log(storedData["date"]);
      console.log(storedData["emission"]);
      // pull the ISO timestamps out of the weird string
      const isoDates =
        storedData.date.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/g) ??
        [];

      const data = isoDates.map((d, i) => ({
        date: new Date(d),
        emission: storedData.emission[i],
      }));

      setChartOptions({
        data,
        series: [
          {
            type: "scatter",
            xKey: "date",
            yKey: "emission",
            tooltip: {
              renderer: ({ xValue, yValue }) => ({
                content: `Date: ${xValue.toLocaleString()}<br/>Emission: ${yValue.toFixed(3)}`,
              }),
            },
            marker: {
              fill: "#1f77b4",
              stroke: "#333",
              size: 7,
            },
          },
        ],
        axes: [
          {
            type: "time",
            position: "bottom",
            label: { format: "%Y-%m-%d %H:%M" },
            gridStyle: [{ stroke: "#eee", lineDash: [4, 4] }],
          },
          {
            type: "number",
            position: "left",
            gridStyle: [{ stroke: "#eee", lineDash: [4, 4] }],
          },
        ],
        // This sets the chart background color:
        background: {
          fill: "transparent",
        },
        // Padding inside the chart area (optional):
        padding: {
          top: 20,
          right: 20,
          bottom: 50,
          left: 60,
        },
      });
    }
  }, [navigate]);

  const handleLogOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("data");
    navigate("/");
  };

  const handleRenderQuiz = () => navigate("/quiz");

  return (
    <div className="accountDashBackground">
      <div className="logOut">
        <button onClick={handleLogOut}>Log Out</button>
      </div>
      <div className="logNewData">
        <button onClick={handleRenderQuiz}>Log new data!</button>
      </div>
      <div className="graph">
        {chartOptions && <AgCharts options={chartOptions} />}
      </div>
    </div>
  );
}

export default AccountDash;
