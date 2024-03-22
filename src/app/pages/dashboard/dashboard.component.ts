import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";

import { ChartComponent } from "ng-apexcharts";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  api = "https://backend-project-neon.vercel.app"
  listcategory: string[] = []
  async ngOnInit(): Promise<void> {

    await this.funcgetmajor()
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
////////////////////////////////////////////////////////////////////////////////
piekey:any;
  pieChart_keyword(pielabel: any, pieseries: any, titles: string) {
    this.piekey = {
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

  ////////////////////////////////////////////////////////////////////////////////
  barkey: any;
  barChart_keyword(label: any, series: any, title: any) {
    this.barkey = {
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

////////////////////////////////////////////////////////////////////////////////
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

      /////////////////////
      this.http.get(this.api + "/dashboard/year").subscribe(async (res: any) => {
        this.label = []
        this.series = []
        for (let i of res.data) {
          await this.label.push(String(i.year));
          await this.series.push(i.freq);
        }
        await this.pieChart(this.label, this.series, `Analytic of  ${category}`)
        await this.barChart(this.label, this.series, `Analytic of  ${category}`)

      })


      this.http.get(this.api+"/dashboard/keyword").subscribe(async(res:any)=>{
        var label=[];
        var series=[];
        for (let i of res.data) {
          await label.push(String(i.keyword));
          await series.push(i.freq);
        }
        await this.pieChart_keyword(label, series, `Analytic of  ${category}`)
        
        
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

      // 
      this.http.get(this.api + "/dashboard/keyword/:" + category).subscribe(async (res: any) => {
        var label = []
        var series = []
        for (let i of res.data) {
          await label.push(String(i.keyword));
          await series.push(i.freq);
        }
        await this.pieChart_keyword(label, series, `Analytic pie chart of  ${category}`)
       
      })
    }
    this.scrollToTop();
  }



  scrollToTop() {
    const element = document.body;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async funcgetmajor() {
    this.http.get(this.api + "/backend/major").subscribe(async (res: any) => {
      for (let item of res.data) {
        var name = await item.major_name
        await this.listcategory.push(name)
      }
      await this.listcategory.sort()
    })
  }
}
