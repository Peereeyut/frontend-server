import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { CanvasJSAngularChartsModule } from "@canvasjs/angular-charts";
// import {Chart, registerables} from "node_modules/chart.js"
import { ChartComponent } from "ng-apexcharts";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  api = "https://real-sweatsuit-toad.cyclic.app"
  async ngOnInit(): Promise<void> {
    try {
      await this.onCategorySelected('All');
    }
    catch (error) {

    }
  }

  constructor(private http: HttpClient, private router: Router) { }

  pie: any;
  pieChart(pielabel: any, pieseries: any, titles: string) {
    this.pie = {
      series: pieseries,
      chart: {
        width: 400,
        type: "pie",
      },

      tooltip: {
        y: {
          formatter: function (val: any) {
            return val + " Project"
          }
        }
      },

      title: { text: titles, align: "left" },
      labels: pielabel,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }
  line: any;
  lineChart(linelabel: any, lineseries: any, name: string) {
    this.line = {
      series: [
        {
          name: name,
          data: lineseries
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: name,
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: linelabel
      }
    };
  }
  charted: any;
  async chartCharted(chartlabel: any, name: string, dataseries: any) {
    this.charted = await {
      series: [
        {
          name: "Computer Engineering",
          data: await dataseries[0]
        },
        {
          name: "Electrical Engineering",
          data: await dataseries[1]
        },
        {
          name: "Mechanical Engineering",
          data: await dataseries[2]
        },
        {
          name: "Civil Engineering",
          data: await dataseries[3]
        },
        {
          name: "Chemical Engineering",
          data: await dataseries[4]
        },
        {
          name: "Industrial Engineering",
          data: await dataseries[5]
        },
        {
          name: "Materials Engineering",
          data: await dataseries[7]
        },
        {
          name: "Environmental Engineering",
          data: await dataseries[8]
        }
      ],
      chart: {
        height: 350,
        type: "line"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 5,
        curve: "straight",
        dashArray: [0, 8, 5]
      },
      title: {
        text: name,
        align: "left"
      },

      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        labels: {
          trim: false
        },
        categories: chartlabel  ///////
      },

      grid: {
        borderColor: "#f1f1f1"
      }
    };
  }

  bar: any;
  barChart(label: any, series: any, title: any) {
    this.bar = {
      series: [
        {
          name: `Project`,
          data: series

        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true
        },

      },
      title: {
        text: title,
        align: "left"
      },

      dataLabels: {
        enabled: true,
        formatter: function (val: any) {
          return val + " project";
        }
      },
      xaxis: {
        stepSize: 1,
        labels: {
          rotate: 0,
          rotateAlways: false,
          formatter: function (value: any) {
            return value.toFixed(0)
          },

        },
        categories: label,

      },

    };
  }





  label: any[] = [];
  series: any[] = [];
  dataseries: any[] = [];
  async onCategorySelected(category: string) {
    if (category == "All") {
      this.http.get(this.api + "/dashboard/multiline").subscribe(async (res: any) => {
        this.label = []
        this.series = []
        var wordperm = [];

        var ComputerEngineering = []
        var ElectricalEngineering = []
        var MechanicalEngineering = []
        var CivilEngineering = []
        var ChemicalEngineering = []
        var IndustrialEngineering = []
        var MaterialsEngineering = []
        var EnvironmentalEngineering = []


        for (let i of res.data) {
          await wordperm.push(i.year);
          await wordperm.sort();
        }
        const uniqueArray = [...new Set(wordperm)];

        for (let i of res.data) {
          for (let j of await uniqueArray) {
            console.log(i.category)
            if (i.category == "Computer Engineering") {
              if (i.year == j) {
                await ComputerEngineering.push(i.freq);
                await console.log(j, i.year, "push")
              }
              else {
                await ComputerEngineering.push(0);
                await console.log(j, i.year)
              }
            }
            if (i.category == "Electrical Engineering") {
              if (i.year == j) {
                await ElectricalEngineering.push(i.freq);
                await console.log(j, i.year, "push")
              }
              else {
                await ElectricalEngineering.push(0);
                await console.log(j, i.year)
              }

            }
            if (i.category == "Mechanical Engineering") {
              if (i.year == j) {
                await MechanicalEngineering.push(i.freq);
                await console.log(j, i.year, "push")
              }
              else {
                await MechanicalEngineering.push(0);
                await console.log(j, i.year)
              }

            }
            if (i.category == "Civil Engineering") {
              if (i.year == j) {
                await CivilEngineering.push(i.freq);
                await console.log(j, i.year, "push")
              }
              else {
                await CivilEngineering.push(0);
                await console.log(j, i.year)
              }

            }
            if (i.category == "Chemical Engineering") {
              if (i.year == j) {
                await ChemicalEngineering.push(i.freq);
                await console.log(j, i.year, "push")
              }
              else {
                await ChemicalEngineering.push(0);
                await console.log(j, i.year)
              }

            }
            if (i.category == "Industrial Engineering") {
              if (i.year == j) {
                await IndustrialEngineering.push(i.freq);
                await console.log(j, i.year, "push")
              }
              else {
                await IndustrialEngineering.push(0);
                await console.log(j, i.year)
              }

            }
            if (i.category == "Materials Engineering") {
              if (i.year == j) {
                await MaterialsEngineering.push(i.freq);
                await console.log(j, i.year, "push")
              }
              else {
                await MaterialsEngineering.push(0);
                await console.log(j, i.year)
              }

            }
            if (i.category == "Environmental Engineering") {
              if (i.year == j) {
                await EnvironmentalEngineering.push(i.freq);
                await console.log(j, i.year, "push")
              }
              else {
                await EnvironmentalEngineering.push(0);
                await console.log(j, i.year)
              }
            }
          }
        }
        console.log("1", ComputerEngineering, "2", ElectricalEngineering, "3", MechanicalEngineering, "4", CivilEngineering, "5", ChemicalEngineering, "6", IndustrialEngineering, "7", MaterialsEngineering, "8", EnvironmentalEngineering)
        await this.chartCharted(uniqueArray, "Analytic of All", [ComputerEngineering, ElectricalEngineering, MechanicalEngineering, CivilEngineering, ChemicalEngineering, IndustrialEngineering, MaterialsEngineering, EnvironmentalEngineering])
      })
      /////////////////////
      this.http.get(this.api + "/dashboard/year").subscribe(async (res: any) => {
        this.label = []
        this.series = []
        for (let i of res.data) {
          await this.label.push(String(i.year));
          await this.series.push(i.freq);
        }
        // await this.chartCharted(this.label, this.series, "Analytic Project Engineer", '')
        await this.pieChart(this.label, this.series, `Analytic of  ${category}`)
        await this.barChart(this.label, this.series, `Analytic of  ${category}`)

      })
    }
    else {
      this.http.get(this.api + "/dashboard/category/:" + category).subscribe(async (res: any) => {
        this.label = []
        this.series = []
        for (let i of res.data) {
          await this.label.push(String(i.year));
          await this.series.push(i.freq);
        }
        await this.pieChart(this.label, this.series, `Analytic pie chart of  ${category}`)
        await this.barChart(this.label, this.series, `Analytic bar chart of  ${category}`)
        // console.log(this.label, this.series)
        // console.log(this.pie, this.bar)
      })
    }
    this.scrollToTop();
  }
  scrollToTop() {
    const element = document.body;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}