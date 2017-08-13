import { Component, OnInit } from '@angular/core';

import { HomeService } from './home.service';

import { Match } from '../models/Match';


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
        this.seasonMatches = matches
      })
      .catch(error => {
        console.log('error in getting recs: ', error);
      })
  };

  pieChartData = [
    {
      key: "One",
      y: 5
    },
    {
      key: "Two",
      y: 2
    },
    {
      key: "Three",
      y: 9
    },
    {
      key: "Four",
      y: 7
    },
    {
      key: "Five",
      y: 4
    },
    {
      key: "Six",
      y: 3
    },
    {
      key: "Seven",
      y: .5
    }
  ];

  runRateData = [{
    values: [{
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
    key: 'Cosine Wave',
    color: '#2ca02c'
  }];

}
