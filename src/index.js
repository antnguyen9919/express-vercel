// var Highcharts = require("highcharts");
import Highcharts from "highcharts";
import axios from "axios";
import "../styles/main.css";
// require("highcharts/modules/exporting")(Highcharts);
// require("highcharts/themes/dark-unica")(Highcharts);
const chart_container = document.getElementById("charts-container");
if (chart_container) {
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
}

if (document.getElementById("task-page")) {
  const new_task_input = document.getElementById("new-task-input");
  const add_task_button = document.getElementById("add-task-button");
  const tasks_list = document.getElementById("tasks-list");
  const remaining_tasks = document.getElementById("remaining_tasks");
  let remaining_nr = 0;
  let completed_nr = 0;
  const completed_tasks = document.getElementById("completed_tasks");
  remaining_tasks.innerText = remaining_nr;
  completed_tasks.innerText = completed_nr;
  let tasks = [];
  async function get_tasks() {
    try {
      const { data } = await axios.get("/api/tasks");
      tasks = data.tasks;
      if (tasks.length > 0) {
        tasks.forEach((item) => {
          if (item.finished === true) {
            completed_nr += 1;
          }
          if (item.finished === false) {
            remaining_nr += 1;
          }
          const task_li = document.createElement("li");
          if (item.finished === true) {
            task_li.classList.add(
              "text-success",
              "text-decoration-line-through"
            );
            task_li.disabled = true;
          }
          task_li.innerText = item.task;
          task_li.classList.add(
            "list-task-item",
            "btn",
            "alert",
            "justify-content-between",
            "rounded",
            "alert-light",
            "d-flex",
            "justify-items-between",
            "align-items-center"
          );
          if (item.finished === false) {
            task_li.addEventListener("click", async (e) => {
              e.preventDefault();
              try {
                task_li.disabled = true;
                await axios.post("/api/completeTask", {
                  task_id: item.task_id,
                });
                task_li.classList.add(
                  "text-success",
                  "text-decoration-line-through"
                );
                remaining_nr--;
                completed_nr++;
                remaining_tasks.innerText = remaining_nr;
                completed_tasks.innerText = completed_nr;
              } catch (error) {
                task_li.disabled = false;
                console.log(error.message);
              }
            });
          }

          tasks_list.appendChild(task_li);
        });
        remaining_tasks.innerText = remaining_nr;
        completed_tasks.innerText = completed_nr;
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  get_tasks();

  add_task_button.disabled = true;
  new_task_input.addEventListener("keyup", () => {
    let value = new_task_input.value;
    if (value.length > 0) {
      add_task_button.disabled = false;
    } else {
      add_task_button.disabled = true;
    }
  });
}
