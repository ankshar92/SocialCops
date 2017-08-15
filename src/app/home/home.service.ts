import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

import * as workerPath from "file-loader?name=[name].js!./home.worker";

import { Match } from '../models/Match';
import { PieChart } from '../models/PieChart';

@Injectable()
export class HomeService {

    worker: Worker = new Worker(workerPath);

    constructor(private http: Http) { };

    populateData(details): Promise<String> {
        return new Promise((resolve, reject) => {
            this.http.get(details.path)
                .map(response => response.text())
                .subscribe(csvDetails => {
                    var worker = this.worker;

                    function eventHandler(response) {
                        worker.removeEventListener('message', eventHandler);

                        if (response.data.status === 'Y') {
                            resolve(response.data.message);
                        }
                        else {
                            reject(response.data.message);
                        }
                    };

                    worker.addEventListener('message', eventHandler);

                    worker.postMessage({
                        type: 'save',
                        rows: csvDetails,
                        dbDetails: {
                            name: details.dbName,
                            collection: details.collection,
                            id: details.id
                        }
                    });

                })
        });
    }

    getRecords(details): Promise<Match[]> {
        return new Promise((resolve, reject) => {
            var worker = this.worker;

            function eventHandler(response) {
                worker.removeEventListener('message', eventHandler);
                if (response.data.status === 'Y') {
                    resolve(response.data.message);
                }
                else {
                    reject(response.data.message);
                }
            };

            worker.addEventListener('message', eventHandler);

            worker.postMessage({
                type: 'readAll',
                dbDetails: details
            });
        });

    }

    preparePieChartData(matches: Match[]): PieChart[] {
        let values = [],
            pieChartData = [];

        matches.forEach(element => {
            if (isNaN(values[<string>element.winner])) {
                values[<string>element.winner] = 1;
            }
            else {
                values[<string>element.winner]++;
            }
        })

        for (var key in values) {
            console.log('key: ', key);
            pieChartData.push({
                key: key,
                value: values[key]
            });
        }

        return pieChartData;
    }

}