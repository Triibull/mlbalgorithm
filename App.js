import React, { useEffect, useState } from "react";
import { format } from "date-fns";

const getConfidenceColor = (score) => {
  if (score >= 8) return "bg-green-500";
  if (score >= 5) return "bg-yellow-400";
  return "bg-red-500";
};

function App() {
  const [projections, setProjections] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/projections")
      .then((res) => res.json())
      .then((data) => setProjections(data));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-navy text-white p-4 text-center text-xl font-bold font-lexend">
        MLB Strikeout Projections on {format(new Date(), "MMMM do, yyyy")}
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {projections.map((pitcher) => (
          <div key={pitcher.id} className="w-full rounded-2xl shadow-md border">
            <div
              className="rounded-t-2xl px-4 py-2 text-white font-bold"
              style={{ backgroundColor: pitcher.team_color }}
            >
              {pitcher.team_name}
            </div>
            <div className="p-4">
              <div className="text-lg font-semibold mb-1">{pitcher.name}</div>
              <div className="text-sm text-gray-700 mb-1">
                vs {pitcher.opponent} @ {pitcher.game_time}
              </div>
              <div className="text-base font-bold mb-1">
                Projected Ks: <span className="text-black">{pitcher.projected_ks}</span>
              </div>
              <div className="text-base mb-1">
                Score: <span className="text-black">{pitcher.score.toFixed(1)} / 10</span>
              </div>
              <div className="flex items-center mb-1">
                <div className={`w-3 h-3 rounded-full mr-2 ${getConfidenceColor(pitcher.confidence_score)}`}></div>
                <span className="text-sm">Confidence: {pitcher.confidence_score.toFixed(1)}</span>
              </div>
              <div className="text-sm text-gray-600">
                Hit rate (last 7): {Math.round(pitcher.hit_rate * 100)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
