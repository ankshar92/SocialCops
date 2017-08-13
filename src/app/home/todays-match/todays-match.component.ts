import { Component, Input } from '@angular/core';

import { Match } from '../../models/Match';

@Component({
    selector: 'app-todays-match',
    templateUrl: './todays-match.component.html',
    styleUrls: [
        './todays-match.component.css'
    ]
})
export class TodaysMatchComponent {
    @Input() matches: Match[];
    @Input() date: String;

    checkValidity(number): boolean {
        return number > 0;
    }
}