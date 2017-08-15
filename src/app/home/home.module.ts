import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTableModule, SharedModule } from 'primeng/primeng';
import { NvD3Module } from 'ng2-nvd3';

import 'd3';
import 'nvd3';

import { HomeComponent } from './home.component';
import { HomeService } from './home.service';

import { TodaysMatchComponent } from './todays-match/todays-match.component';
import { SeasonMatchesComponent } from './season-matches/season-matches.component';
import { PieChartComponent } from './d3-components/pie-chart.component';
import { RunRateComponent } from './d3-components/run-rate.component';
import { AppLoader } from './loader/loader.component';

@NgModule({
    declarations: [
        HomeComponent,
        TodaysMatchComponent,
        SeasonMatchesComponent,
        PieChartComponent,
        RunRateComponent,
        AppLoader
    ],
    imports: [
        CommonModule,
        DataTableModule,
        SharedModule,
        NvD3Module
    ],
    providers: [
        HomeService
    ]
})
export class HomeModule { }