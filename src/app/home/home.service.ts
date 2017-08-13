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

                    this.worker.addEventListener('message', (message => {
                        console.log('Message returned...', message.data);
                        this.worker.removeEventListener('message', null);
                        if (message.data.status === 'Y') {
                            resolve(message.data.message);
                        }
                        else {
                            reject(message.data.message);
                        }
                    }));

                    this.worker.postMessage({
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

    getTodaysMatches(details): Promise<Match[]> {
        return new Promise((resolve, reject) => {
            this.worker.addEventListener('message', (response => {
                this.worker.removeEventListener('message', null);
                resolve(response.data.message);
            }));

            this.worker.postMessage({
                type: 'readAll',
                dbDetails: details
            });
        });

    }
}