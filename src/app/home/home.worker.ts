declare function postMessage(message?);

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
                    console.log("error: ", event);
                    reject('Error opening Indexed DB');
                };

                request.onsuccess = function (event) {
                    _db = request.result;
                    console.log("success: " + _db);
                    resolve();
                };

                request.onupgradeneeded = function (event) {
                    _db = event.target.result;

                    var objectStore = _db.createObjectStore(dbDetails.collection, { keyPath: dbDetails.id });

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
                        console.log("Success in save collection...", index);
                        if (index === collection.length - 1) {
                            resolve('All records saved successfully...');
                        }
                    };

                    request.onerror = function (event) {
                        console.log("Error in save collection: ", event);
                        reject(`Error in saving index ${index}`);
                    }
                });
            });
        }
    }
})();

self.addEventListener('message', (message) => {
    let csv = message.data.rows,
        json = csvToJson(csv),
        dbDetails = message.data.dbDetails;

    console.log(json);

    if (dbUtility.initializeDb()) {
        console.log('DB supported');
        try {
            dbUtility.openDatabase(dbDetails)
                .then(response => {
                    dbUtility.saveCollection(dbDetails, json)
                        .then(message => {
                            console.log(message);
                        })
                        .catch(error => {
                            console.log(error);
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
});