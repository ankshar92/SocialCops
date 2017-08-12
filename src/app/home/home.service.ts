import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

import * as workerPath from "file-loader?name=[name].js!./home.worker";

@Injectable()
export class HomeService {

    worker: Worker = new Worker(workerPath);

    constructor(private http: Http) { };

    populateData(details): void {
        this.http.get(details.path)
            .map(response => response.text())
            .subscribe(csvDetails => {

                this.worker.addEventListener('message', (message => {
                    console.log('Message returned...', message.data);
                }));

                this.worker.postMessage({
                    rows: csvDetails,
                    dbDetails: {
                        name: details.dbName,
                        collection: details.collection,
                        id: details.id
                    }
                });

            });
    }
}