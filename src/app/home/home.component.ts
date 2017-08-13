import { Component, OnInit } from '@angular/core';

import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  todaysDate;

  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.homeService.populateData({
      path: 'assets/data/matches.csv',
      dbName: 'matches',
      collection: 'matches',
      id: 'id'
    })
      .then(message => {
        console.log(message);
        this.todaysDate = '22-05-2016';
      })
      .catch(error => {
        console.log(error);
        this.todaysDate = '22-05-2016';
      })
  }

}
