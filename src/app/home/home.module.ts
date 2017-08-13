import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTableModule, SharedModule } from 'primeng/primeng';

import { HomeComponent } from './home.component';
import { HomeService } from './home.service';

import { TodaysMatchComponent } from './todays-match/todays-match.component';
import { SeasonMatchesComponent } from './season-matches/season-matches.component';

@NgModule({
    declarations: [
        HomeComponent,
        TodaysMatchComponent,
        SeasonMatchesComponent
    ],
    imports: [
        CommonModule,
        DataTableModule,
        SharedModule
    ],
    providers: [
        HomeService
    ]
})
export class HomeModule { }