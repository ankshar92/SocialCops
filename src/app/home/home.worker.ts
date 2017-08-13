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
                    console.log("Error opening Indexed DB: ", event);
                    reject('Error opening Indexed DB');
                };

                request.onsuccess = function (event) {
                    _db = request.result;
                    console.log("Opened Indexed DB: " + _db);
                    resolve();
                };

                request.onupgradeneeded = function (event) {
                    _db = event.target;
                    _db = _db.result;

                    console.log('\n\nUPGRADE NEEDED...\n\n')

                    var objectStore = _db.createObjectStore(dbDetails.collection, { keyPath: dbDetails.id });

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
                        reject(`Error in saving index ${index}`);
                    }
                });
            });
        },
        readAll: function (dbDetails) {
            return new Promise((resolve, reject) => {
                var transaction = _db.transaction([dbDetails.collection], "readwrite");
                var objectStore = transaction.objectStore(dbDetails.collection);
                var request = objectStore.openCursor(IDBKeyRange.only("101"));
                var index = objectStore.index(dbDetails.index);
                var range = IDBKeyRange.only(dbDetails.keyValue.toString());
                var request = index.openCursor(range);

                console.log('Reading....', request);

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
                                console.log('Save Collection: ', message);
                                postMessage(returnSuccess(message));
                            })
                            .catch(error => {
                                console.log('Error in save collection: ', error);
                                postMessage(returnError(error));
                            });
                    })
                    .catch(message => {
                        postMessage(returnError(message));
                    });
            } catch (error) {
                console.log(error.stack);
                postMessage(returnError(error.message));
            }
        } else {
            postMessage(returnError('Indexed DB not supported, please update your browser.'))
        }
    }
    else if (message.data.type === 'readAll') {
        console.log('Read all....');
        dbUtility.readAll(message.data.dbDetails)
            .then(records => {
                console.log(records);
                postMessage(returnSuccess(records));
            })
            .catch(error => error);
    }
});

// dbUtility.readAll(dbDetails, {index: 'season', keyValue: 2011});
