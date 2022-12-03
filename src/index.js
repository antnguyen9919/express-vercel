// var Highcharts = require("highcharts");
import Highcharts from "highcharts";
import axios from "axios";
import "../styles/main.css";
// require("highcharts/modules/exporting")(Highcharts);
// require("highcharts/themes/brand-dark")(Highcharts);
const chart_container = document.getElementById("charts-container");
if (chart_container) {
  Highcharts.chart("container", {
    title: {
      text: "U.S Solar Employment Growth by Job Category, 2010-2020",
    },

    subtitle: {
      text: 'Source: <a href="https://irecusa.org/programs/solar-jobs-census/" target="_blank">IREC</a>',
    },

    yAxis: {
      title: {
        text: "Number of Employees",
      },
    },

    xAxis: {
      accessibility: {
        rangeDescription: "Range: 2010 to 2020",
      },
    },

    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
        pointStart: 2010,
      },
    },

    series: [
      {
        name: "Installation & Developers",
        data: [
          43934, 48656, 65165, 81827, 112143, 142383, 171533, 165174, 155157,
          161454, 154610,
        ],
      },
      {
        name: "Manufacturing",
        data: [
          24916, 37941, 29742, 29851, 32490, 30282, 38121, 36885, 33726, 34243,
          31050,
        ],
      },
      {
        name: "Sales & Distribution",
        data: [
          11744, 30000, 16005, 19771, 20185, 24377, 32147, 30912, 29243, 29213,
          25663,
        ],
      },
      {
        name: "Operations & Maintenance",
        data: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          11164,
          11218,
          10077,
        ],
      },
      {
        name: "Other",
        data: [
          21908, 5548, 8105, 11248, 8989, 11816, 18274, 17300, 13053, 11906,
          10073,
        ],
      },
    ],

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
            },
          },
        },
      ],
    },
  });
}

if (document.getElementById("task-page")) {
  const new_task_input = document.getElementById("new-task-input");
  const add_task_button = document.getElementById("add-task-button");
  const tasks_list = document.getElementById("tasks-list");
  async function get_tasks() {
    try {
      const { data } = await axios.get("/api/tasks");
      const tasks = data.tasks;
      if (tasks.length > 0) {
        tasks.forEach((item) => {
          const task_li = document.createElement("li");

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
          task_li.addEventListener("click", async (e) => {
            e.preventDefault();
          });
          tasks_list.appendChild(task_li);
        });
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

  add_task_button.addEventListener("click", async () => {
    const task = new_task_input.value;

    try {
      add_task_button.disabled = true;
      await axios.post("/api/addTask", { task: task });
      new_task_input.value = "";
    } catch (error) {
      console.log(error);
      new_task_input.value = "";
    }
  });
}
