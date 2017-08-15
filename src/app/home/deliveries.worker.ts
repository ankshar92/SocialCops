function jsonFromCsv(csv) {
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

var processing = (function () {
    let _deliveries;

    return {
        setDeliveries: function (deliveries) {
            _deliveries = deliveries;
        },
        getDeliveries: function () {
            return _deliveries;
        },
        calcRunRate: function (matchId) {
            let match = _deliveries.filter(function (matchDetails) {
                return matchDetails.match_id === matchId;
            });

            let runRate = {},
                over = 1,
                finalScore = 0,
                runRateDetails = {
                    "1": [{
                        over: 0,
                        runRate: 0
                    }],
                    "2": [{
                        over: 0,
                        runRate: 0
                    }]
                };

            for (var i = 0; i < match.length; i++) {
                if (i === match.length - 1) {
                    over = +match[i].over;
                    runRate = {
                        over: over,
                        runRate: finalScore / over
                    }

                    runRateDetails[match[i].inning].push(runRate);
                }
                else if (over < +match[i].over) {
                    over = match[i].over;
                    runRate = {
                        over: over - 1,
                        runRate: finalScore / (over - 1)
                    }

                    runRateDetails[match[i - 1].inning].push(runRate);
                }
                else if (over > +match[i].over) {
                    runRateDetails[match[i - 1].inning].push({
                        over: +match[i - 1].over,
                        runRate: finalScore / (+match[i - 1].over)
                    });
                    finalScore = 0;
                    over = match[i].over
                }

                finalScore += +match[i].total_runs;

            };

            return [{
                key: match[0].batting_team,
                values: runRateDetails["1"]
            }, {
                key: match[0].bowling_team,
                values: runRateDetails["2"]
            }]
        }
    }
})();

self.onmessage = function (message) {
    if (message.data.type === 'setData') {
        processing.setDeliveries(jsonFromCsv(message.data.csv));
        postMessage(true);
    }
    else if (message.data.type === 'runRate') {
        postMessage(processing.calcRunRate(message.data.matchId));
    }
}