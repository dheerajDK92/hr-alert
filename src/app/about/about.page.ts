import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-about",
  templateUrl: "./about.page.html",
  styleUrls: ["./about.page.scss"],
})
export class aboutPage implements OnInit {
  public main: string;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.main = this.activatedRoute.snapshot.paramMap.get("id");
  }

  openSocial(selectedSocial) {
    console.log("selectedSocial: ", selectedSocial);
  }
}
