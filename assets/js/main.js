document.addEventListener("click", function (e) {
  const btn = e.target.closest(".copy-btn");
  if (!btn) return;
  const target = document.querySelector(btn.dataset.copyTarget);
  if (!target) return;
  navigator.clipboard.writeText(target.innerText.trim()).then(function () {
    const original = btn.textContent;
    btn.textContent = "Copied";
    setTimeout(function () { btn.textContent = original; }, 1500);
  });
});

/* ------------------------------------------------------------------
   Interactive World Climate Attention Index (attention.html, Figure 1)
   Data: assets/plots/world_cai.json (weekly, equal-weighted across countries)
   ------------------------------------------------------------------ */
(function () {
  var el = document.getElementById("world-cai");
  if (!el || !window.Plotly) return;

  var INK = "#211d1a", GRAY = "#766e62", GRID = "#ece5d8", LINE = "#1f77b4";   // same blue as the paper's figure
  var BAND = { climate: "rgba(76, 145, 65, 0.28)", other: "rgba(59, 110, 143, 0.24)" };
  var small = window.matchMedia("(max-width: 640px)").matches;
  var AXIS_FONT = small ? 13 : 17;

  function shiftDays(iso, n) {
    var d = new Date(iso + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }

  fetch("assets/plots/world_cai.json")
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var traces = [
        {
          x: d.dates, y: d.world, type: "scatter", mode: "lines",
          line: { color: LINE, width: 1.4 },
          name: "World CAI", showlegend: false,
          hovertemplate: "Week of %{x|%b %d, %Y}<br><b>CAI %{y:.3f}</b><extra></extra>"
        },
        {
          x: d.events.map(function (e) { return e.date; }),
          y: d.events.map(function (e) { return e.value; }),
          type: "scatter", mode: "markers", showlegend: false,
          marker: { color: INK, size: 9, line: { color: "#fff", width: 1.5 } },
          text: d.events.map(function (e) { return e.name; }),
          hovertemplate: "<b>%{text}</b><br>Week of %{x|%b %d, %Y}<br>CAI %{y:.3f}<extra></extra>"
        },
        // legend swatches for the two kinds of shaded bands
        { x: [null], y: [null], type: "scatter", mode: "markers", name: "Climate events",
          marker: { symbol: "square", size: 14, color: BAND.climate.replace("0.28", "0.6") }, hoverinfo: "skip" },
        { x: [null], y: [null], type: "scatter", mode: "markers", name: "Other global events",
          marker: { symbol: "square", size: 14, color: BAND.other.replace("0.24", "0.6") }, hoverinfo: "skip" }
      ];

      var shapes = d.events.map(function (e) {
        return {
          type: "rect", xref: "x", yref: "paper", layer: "below", line: { width: 0 },
          x0: shiftDays(e.date, -12), x1: shiftDays(e.date, 12), y0: 0, y1: 1,
          fillcolor: BAND[e.kind]
        };
      });

      var annotations = d.events.map(function (e) {
        var up = e.dir === "up";
        return {
          x: e.date, y: e.value, xref: "x", yref: "y", text: e.name,
          showarrow: true, arrowhead: 0, arrowwidth: 1, arrowcolor: GRAY,
          ax: e.name === "Invasion of Ukraine" ? 30 : 0, ay: up ? -34 : 34,
          font: { size: small ? 12 : 15, color: INK, family: "Inter, sans-serif" },
          bgcolor: "rgba(255,254,252,0.85)", borderpad: 2
        };
      });

      var layout = {
        font: { family: "Inter, -apple-system, sans-serif", color: INK },
        paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
        margin: { l: small ? 52 : 78, r: 18, t: small ? 70 : 56, b: 50 },
        hovermode: "closest",
        hoverlabel: { bgcolor: "#fffefc", bordercolor: "#e8e0d3", font: { size: 14, color: INK } },
        showlegend: true,
        legend: { orientation: "h", x: 1, xanchor: "right", y: 1.02, yanchor: "bottom",
                  font: { size: small ? 11 : 14, color: GRAY } },
        xaxis: {
          type: "date", tickformat: "%Y", dtick: "M12", tick0: "2015-01-01", range: ["2014-10-01", "2022-12-30"],
          tickfont: { size: AXIS_FONT, color: INK }, showgrid: false,
          linecolor: "#cfc5b4", ticks: "outside", tickcolor: "#cfc5b4",
          rangeselector: {
            x: 0, y: 1.02, yanchor: "bottom", font: { size: 12 },
            bgcolor: "#f5ede1", activecolor: "#e9dbc4", bordercolor: "#e8e0d3", borderwidth: 1,
            buttons: [
              { count: 1, label: "1 year", step: "year", stepmode: "backward" },
              { count: 3, label: "3 years", step: "year", stepmode: "backward" },
              { step: "all", label: "All" }
            ]
          }
        },
        yaxis: {
          title: { text: "World CAI", font: { size: AXIS_FONT, color: INK } },
          tickfont: { size: AXIS_FONT, color: INK }, tickformat: ".2f",
          gridcolor: GRID, zeroline: false, linecolor: "#cfc5b4", fixedrange: false
        },
        shapes: shapes,
        annotations: annotations
      };

      Plotly.newPlot(el, traces, layout, {
        responsive: true, displaylogo: false,
        modeBarButtonsToRemove: ["select2d", "lasso2d", "autoScale2d", "toggleSpikelines"]
      });
    })
    .catch(function () {
      el.innerHTML = '<img src="assets/img/figures/fig1_world_cai.png" alt="World Climate Attention Index">';
    });
})();
