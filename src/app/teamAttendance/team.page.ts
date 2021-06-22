import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-team',
  templateUrl: './team.page.html',
  styleUrls: ['./team.page.scss'],
})
export class teamPage implements OnInit {
  public main: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.main = this.activatedRoute.snapshot.paramMap.get('id');
  }

}
