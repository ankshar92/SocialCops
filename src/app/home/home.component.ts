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

}
