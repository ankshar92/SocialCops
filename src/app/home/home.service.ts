import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

import * as workerPath from "file-loader?name=[name].js!./home.worker";

import { Match } from '../models/Match';

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

}