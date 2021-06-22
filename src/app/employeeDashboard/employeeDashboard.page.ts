import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, NavigationExtras } from "@angular/router";
import { IonInfiniteScroll, NavController, NavParams } from "@ionic/angular";
import { HttpClient } from "@angular/common/http";
import { UtilService } from "../common/service/util.service";
import * as HighCharts from "highcharts";

@Component({
  selector: "app-employee-Dashboard",
  templateUrl: "./employeeDashboard.page.html",
  styleUrls: ["./employeeDashboard.page.scss"],
})
export class employeeDashboardPage implements OnInit {
  public main: string;
  empList = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private navParams: NavParams,
    private _http: HttpClient,
    private _util: UtilService
  ) {}
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  ngOnInit() {
    this._util.showLoader();
    this.main = this.activatedRoute.snapshot.paramMap.get("id");
    setTimeout(()=>{
      this._util.hideLoader();
    },1000)
  }
  ionViewDidEnter() {
    this.plotSimpleBarChart();
  }
  plotSimpleBarChart() {
    let myChart = HighCharts.chart("barChart", {
      chart: {
        type: "bar",
      },
      title: {
        text: "Dashboard",
      },
      xAxis: {
        categories: ["Reimbursement", "Advance", "Leaves"],
      },
      yAxis: {
        title: {
          text: "Reimbursement, Advance, Leaves",
        },
      },
      series: [
        {
          name: "Reject",
          type: undefined,
          data: [1, 0, 4],
          style:{
            color:"green"
          }
        },
        {
          name: "InProgress",
          type: undefined,
          data: [5, 7, 3],
          style:{
            color:"orange"
          }
        },
        {
          name: "Approved",
          type: undefined,
          data: [5, 7, 3],
          style:{
            color:"red"
          }
        },
      ],
    });
  }
}
