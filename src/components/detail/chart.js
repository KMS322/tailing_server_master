import "../../css/chart.css";
import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PPGChart = ({ data, dataKey, color, title }) => {
  // 데이터의 최소값과 최대값 계산
  const values = data.map(d => d[dataKey]).filter(v => !isNaN(v) && v > 0);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  // 여유 공간 추가 (범위의 10%)
  const padding = (maxValue - minValue) * 0.1;
  const yMin = Math.floor(minValue - padding);
  const yMax = Math.ceil(maxValue + padding);

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h3>{title}</h3>
      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="index" />
            <YAxis domain={[yMin, yMax]} />
            {/* <Tooltip />
            <Legend /> */}
            <Line type="monotone" dataKey={dataKey} stroke={color} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const Chart = ({ fileName, close }) => {
  const [data, setData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [minRange, setMinRange] = useState("");
  const [maxRange, setMaxRange] = useState("");

  useEffect(() => {
    const loadChart = async () => {
      try {
        // public/data/ir.csv 파일을 직접 fetch
        const response = await fetch('/data/ir.csv');
        const csvText = await response.text();

        const parsed = Papa.parse(csvText, { header: true });
        const processed = parsed.data.map((row, i) => ({
          index: i,
          ir: Number(row.ir),
          red: Number(row.red),
          // green: Number(row.green),
        }));
        setData(processed);
        setDisplayData(processed);
        setMinRange("1");
        setMaxRange(processed.length.toString());
        // console.log("CSV loaded & parsed:", processed);
      } catch (e) {
        console.error(e);
      }
    };

    if (fileName) loadChart();
  }, [fileName]);

  const handleApplyRange = () => {
    const min = parseInt(minRange);
    const max = parseInt(maxRange);


    if (isNaN(min) || isNaN(max) || min < 0 || max > data.length || min > max) {
      alert("유효한 범위를 입력하세요.");
      return;
    }
    console.log("cklick");
    setDisplayData(data.slice(min, max + 1));
  };

  const handleResetRange = () => {
    setDisplayData(data);
    setMinRange("");
    setMaxRange("");
  };

  return (
    <div className="chart_container">
      {data.length === 0 && <p>데이터 로드 중...</p>}

      {data.length > 0 && (
        <>
          <div className="range_box">
            <input
              type="number"
              placeholder="min"
              value={minRange}
              onChange={(e) => setMinRange(e.target.value)}
            />
            <input
              type="number"
              placeholder="max"
              value={maxRange}
              onChange={(e) => setMaxRange(e.target.value)}
            />
            <div className="btn" onClick={handleApplyRange}>
              보기
            </div>
            <div className="btn" onClick={handleResetRange}>
              초기화
            </div>
            <div className="btn" onClick={close}>
              닫기
            </div>
          </div>
          <PPGChart data={displayData} dataKey="ir" color="black" title="IR" />
          <PPGChart data={displayData} dataKey="red" color="red" title="RED" />
          {/* <PPGChart data={displayData} dataKey="green" color="green" title="GREEN" /> */}
        </>
      )}
    </div>
  );
};

export default Chart;
