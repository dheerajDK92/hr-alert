import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-monthly',
  templateUrl: './monthly.page.html',
  styleUrls: ['./monthly.page.scss'],
})
export class monthlyPage implements OnInit {
  public main: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.main = this.activatedRoute.snapshot.paramMap.get('id');
  }

}
