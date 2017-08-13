import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { HomeService } from './home.service';

import { TodaysMatchComponent } from './todays-match/todays-match.component';

@NgModule({
    declarations: [
        HomeComponent,
        TodaysMatchComponent
    ],
    imports: [
        CommonModule
    ],
    providers: [
        HomeService
    ]
})
export class HomeModule { }