import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HomeService } from './home.service';

import { Match } from '../models/Match';
import { PieChart } from '../models/PieChart';
import { RunRate } from '../models/RunRate';


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
  runRateData: RunRate[];

  downloadingDeliveries: Boolean = true;

  constructor(
    private homeService: HomeService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.route.paramMap
      .subscribe(params => {
        this.todaysDate = params.get('todaysDate');
        this.season = params.get('season');
      })

    let p1 = new Promise((resolve, reject) => {
      this.homeService.populateData({
        path: 'assets/data/matches.csv',
        dbName: 'matches',
        collection: 'matches',
        id: 'id'
      })
        .then(message => {
          this.initialiseData(resolve, reject);
        })
        .catch(error => {
          this.initialiseData(resolve, reject);
        });
    });

    let p2 = new Promise((resolve, reject) => {
      this.homeService.initialiseDeliveryWorker('assets/data/deliveries.csv')
        .then(message => {
          resolve();
        })
        .catch(error => {
          reject();
        });
    });

    Promise.all([p1, p2])
      .then(() => {
        this.downloadingDeliveries = false;
        this.calculateRunRate(this.todaysMatches[0].id);
      })
      .catch(err => {
        console.log(err);
      })

  };

  initialiseData(resolve, reject): void {
    this.getTodaysMatches(this.todaysDate, resolve, reject);

    setTimeout(() => {
      this.getSeasonMatches(this.season);
    }, 1000);
  }

  getTodaysMatches(todaysDate, resolve, reject): void {
    this.homeService.getRecords({
      name: 'matches',
      collection: 'matches',
      index: 'date',
      keyValue: todaysDate
    })
      .then(matches => {
        this.todaysMatches = matches;
        resolve();
      })
      .catch(error => {
        console.log('error in getting recs: ', error);
        reject();
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

  calculateRunRate(matchId): void {
    this.homeService.calculateRunRate(matchId)
      .then(runRateData => {
        this.runRateData = runRateData
      })
      .catch(err => console.log(err));
  }

}
