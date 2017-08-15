import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
declare let d3: any;

@Component({
    selector: 'app-pie-chart',
    template: `
    <div>
      <nvd3 [options]="options" [data]="pieChartData"></nvd3>
    </div>`,
    styleUrls: [
        '../../../../node_modules/nvd3/build/nv.d3.css'
    ],
    encapsulation: ViewEncapsulation.None
})

export class PieChartComponent implements OnInit {
    options;
    @Input() pieChartData;
    ngOnInit() {
        this.options = {
            chart: {
                type: 'pieChart',
                height: 500,
                x: function (d) { return d.key; },
                y: function (d) { return d.value; },
                showLabels: true,
                duration: 500,
                labelThreshold: 0.01,
                labelType: 'percent',
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        }
    }
}