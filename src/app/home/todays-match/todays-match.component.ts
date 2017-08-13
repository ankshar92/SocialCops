import { Component, Input, OnInit } from '@angular/core';

import { HomeService } from '../home.service';
import { Match } from '../../models/Match';

@Component({
    selector: 'app-todays-match',
    templateUrl: './todays-match.component.html',
    styleUrls: [
        './todays-match.component.css'
    ]
})
export class TodaysMatchComponent implements OnInit {
    @Input() date;
    matches: Match[];

    constructor(private homeService: HomeService) { }

    ngOnInit() {
        this.homeService.getTodaysMatches({
            name: 'matches',
            collection: 'matches',
            index: 'date',
            keyValue: this.date
        })
        .then(matches => this.matches = matches);
    }

    checkValidity(number): boolean {
        return number > 0;
    }


}