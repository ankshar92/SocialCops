import { Component, OnInit } from '@angular/core';

import { HomeService } from './home.service';

import { Match } from '../models/Match';
import { PieChart } from '../models/PieChart';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  todaysDate: String;
  season: String;
  seasonMatches: Match[];
  todaysMatches: Match[];
  pieChartData: PieChart[];

  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.homeService.populateData({
      path: 'assets/data/matches.csv',
      dbName: 'matches',
      collection: 'matches',
      id: 'id'
    })
      .then(message => {
        this.initialiseData();
      })
      .catch(error => {
        this.initialiseData();
      });
  };

  initialiseData(): void {
    this.todaysDate = '22-05-2016';
    this.season = '2016';

    this.getTodaysMatches(this.todaysDate);

    setTimeout(() => {
      this.getSeasonMatches(this.season);
    }, 1000);
  }

  getTodaysMatches(todaysDate): void {
    this.homeService.getRecords({
      name: 'matches',
      collection: 'matches',
      index: 'date',
      keyValue: todaysDate
    })
      .then(matches => {
        this.todaysMatches = matches;
      })
      .catch(error => {
        console.log('error in getting recs: ', error);
      })
  }

  getSeasonMatches(season): void {
    this.homeService.getRecords({
      name: 'matches',
      collection: 'matches',
      index: 'season',
      keyValue: season
    })
      .then(matches => {
        this.seasonMatches = matches;
        this.preparePieChartData(matches);
      })
      .catch(error => {
        console.log('error in getting recs: ', error);
      })
  };

  preparePieChartData(matches): void {
    this.pieChartData = this.homeService.preparePieChartData(matches);
  }

  runRateData = [{
    values: [{
      x: 0,
      y: 0
    },
    {
      x: 1,
      y: 5
    },
    {
      x: 2,
      y: 2
    },
    {
      x: 3,
      y: 9
    },
    {
      x: 4,
      y: 7
    },
    {
      x: 5,
      y: 4
    }],
    key: 'Delhi Daredevils',
    color: '#2ca02c'
  }];

}
