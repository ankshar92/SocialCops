declare function postMessage(message?);
declare var mozIndexedDB, webkitIndexedDB, msIndexedDB, webkitIDBTransaction, msIDBTransaction, webkitIDBKeyRange, msIDBKeyRange;

function csvToJson(csv) {
    let rows = csv.split('\n'),
        headers = rows.splice(0, 1)[0].split(','),
        json = [];

    for (var i = 0; i < rows.length; i++) {
        var obj = {};
        rows[i] = rows[i].split(',');

        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = rows[i][j];
        }
        json.push(obj);
    }

    return json;

};

function returnError(msg) {
    return {
        status: 'N',
        message: msg
    }
};

function returnSuccess(msg) {
    return {
        status: 'Y',
        message: msg
    }
};

var dbUtility = (function () {

    let _db;

    return {
        initializeDb: function () {
            indexedDB = indexedDB || mozIndexedDB || webkitIndexedDB || msIndexedDB;
            IDBTransaction = IDBTransaction || webkitIDBTransaction || msIDBTransaction;
            IDBKeyRange = IDBKeyRange || webkitIDBKeyRange || msIDBKeyRange;

            if (!indexedDB) {
                return false;
            }

            return true;
        },
        openDatabase: function (dbDetails) {
            return new Promise((resolve, reject) => {
                let request = indexedDB.open(dbDetails.name, 1);

                request.onerror = function (event) {
                    reject('Error opening Indexed DB');
                };

                request.onsuccess = function (event) {
                    _db = request.result;
                    resolve();
                };

                request.onupgradeneeded = function (event) {
                    _db = event.target;
                    _db = _db.result;

                    var objectStore = _db.createObjectStore(dbDetails.collection, { keyPath: dbDetails.id, autoIncrement: true });

                    objectStore.createIndex("season", "season", { unique: false });
                    objectStore.createIndex("date", "date", { unique: false });

                    /* for (var i in employeeData) {
                        objectStore.add(employeeData[i]);
                    } */
                }
            })
        },
        saveCollection: function (dbDetails, collection) {
            return new Promise((resolve, reject) => {
                let objetStore = _db.transaction([dbDetails.collection], "readwrite")
                    .objectStore(dbDetails.collection);

                collection.forEach((element, index) => {
                    let request = objetStore.add(element);

                    request.onsuccess = function (event) {
                        if (index === collection.length - 1) {
                            resolve('All records saved successfully...');
                        }
                    };

                    request.onerror = function (event) {
                        reject(`Records already saved...`);
                    }
                });
            });
        },
        readAll: function (dbDetails) {
            return new Promise((resolve, reject) => {
                var transaction = _db.transaction([dbDetails.collection], "readwrite");
                var objectStore = transaction.objectStore(dbDetails.collection);

                var index = objectStore.index(dbDetails.index);
                var range = IDBKeyRange.only(dbDetails.keyValue.toString());
                var request = index.openCursor(range);

                var records = [];

                request.onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        records.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(records);
                    }
                };
                request.onerror = function (event) {
                    console.log('event', event);
                };

            });
        }
    }
})();

self.addEventListener('message', (message) => {
    if (message.data.type === 'save') {
        let csv = message.data.rows,
            json = csvToJson(csv),
            dbDetails = message.data.dbDetails;

        if (dbUtility.initializeDb()) {
            try {
                dbUtility.openDatabase(dbDetails)
                    .then(response => {
                        dbUtility.saveCollection(dbDetails, json)
                            .then(message => {
                                postMessage(returnSuccess(message));
                            })
                            .catch(error => {
                                postMessage(returnError(error));
                            });
                    })
                    .catch(message => {
                        postMessage(returnError(message));
                    });
            } catch (error) {
                postMessage(returnError(error.message));
            }
        } else {
            postMessage(returnError('Indexed DB not supported, please update your browser.'))
        }
    }
    else if (message.data.type === 'readAll') {
        dbUtility.readAll(message.data.dbDetails)
            .then(records => {
                postMessage(returnSuccess(records));
            })
            .catch(error => {
                return error;
            });
    }
    else if (message.data.type === 'pieChart') {
        dbUtility.readAll(message.data.dbDetails)
            .then(records => {
                postMessage(returnSuccess(records));
            })
            .catch(error => error);
    }

});