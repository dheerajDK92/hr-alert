import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class menuPage implements OnInit {
  public main: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.main = this.activatedRoute.snapshot.paramMap.get('id');
  }

}
