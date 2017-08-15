import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';

const routes: Routes = [{
    path: '',
    redirectTo: '/dashboard/2016/22-05-2016',
    pathMatch: 'full'
}, {
    path: 'dashboard/:season/:todaysDate',
    component: HomeComponent
}];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRouterModule { }