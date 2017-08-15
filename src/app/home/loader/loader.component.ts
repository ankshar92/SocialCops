import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-loader',
    template: `
    <div class="align-center loader" *ngIf="show">
        <i class="fa fa-circle-o-notch fa-spin fa-fw fa-2x"></i>
        <p>Still loading...</p>
    </div>
    `,
    styleUrls: [
        './loader.component.css'
    ]
})
export class AppLoader {
    @Input() show: Boolean;
}