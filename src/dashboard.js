import Highcharts from "highcharts";
// require("highcharts/modules/exporting")(Highcharts);
// require("highcharts/themes/dark-unica")(Highcharts);

import { log_something } from "./index";
if (process.env.NODE_ENV === "production") {
  log_something("tasks page visited");
}
// Load the exporting module.
import Exporting from "highcharts/modules/exporting";
// Initialize exporting module. (CommonJS only)
const chart_container = document.getElementById("charts-container");
Exporting(Highcharts);
Highcharts.chart("container", {
  chart: {
    type: "column",
  },
  title: {
    text: "Monthly Completion Rate",
  },
  // subtitle: {
  //   text: "Source: WorldClimate.com",
  // },
  credits: {
    enabled: false,
  },
  legend: {
    enabled: false,
  },
  xAxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    crosshair: true,
  },
  yAxis: {
    min: 0,
    max: 100,
    title: {
      text: "%",
    },
  },
  tooltip: {
    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    pointFormat:
      '<tr><td style="padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
    footerFormat: "</table>",
    shared: true,
    useHTML: true,
  },
  plotOptions: {
    column: {
      pointPadding: 0.2,
      borderWidth: 0,
    },
    series: {
      borderWidth: 0,
      dataLabels: {
        enabled: true,
        format: "{point.y:.1f}%",
      },
    },
  },
  series: [
    {
      name: "Completion rate",

      data: [
        49.9, 71.5, 50.4, 29.2, 44.0, 76.0, 35.6, 48.5, 26.4, 94.1, 95.6, 0,
      ],
    },
  ],
});
