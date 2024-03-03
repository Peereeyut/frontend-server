import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';; // อัพเดตการอิมพอร์ต


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  title = 'ProjectI';

  ngOnInit(){}

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
  }
  
}



