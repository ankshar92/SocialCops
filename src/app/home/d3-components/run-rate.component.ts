import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
declare let d3: any;

@Component({
    selector: 'app-run-rate',
    template: `
    <div>
      <nvd3 [options]="options" [data]="runRateData"></nvd3>
    </div>`,
    styleUrls: [
        '../../../../node_modules/nvd3/build/nv.d3.css'
    ],
    encapsulation: ViewEncapsulation.None
})

export class RunRateComponent implements OnInit {
    options;
    @Input() runRateData;
    ngOnInit() {
        this.options = {
            chart: {
                type: 'lineChart',
                height: 500,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x: function (d) { return d.x; },
                y: function (d) { return d.y; },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function (e) { console.log("stateChange"); },
                    changeState: function (e) { console.log("changeState"); },
                    tooltipShow: function (e) { console.log("tooltipShow"); },
                    tooltipHide: function (e) { console.log("tooltipHide"); }
                },
                xAxis: {
                    axisLabel: 'Overs'
                },
                yAxis: {
                    axisLabel: 'Run Rate',
                    tickFormat: function (d) {
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -10
                },
                callback: function (chart) {
                    console.log("!!! lineChart callback !!!");
                }
            }
        }
    }
}