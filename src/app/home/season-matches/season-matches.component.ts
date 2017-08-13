import { Component, Input } from '@angular/core';

import { Match } from '../../models/Match';

@Component({
    selector: 'app-season-matches',
    templateUrl: './season-matches.component.html',
    styleUrls: [
        './season-matches.component.css'
    ]
})
export class SeasonMatchesComponent {
    @Input() matches: Match[];

}