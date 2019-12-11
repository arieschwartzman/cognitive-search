var wordsToNumber = require("words-to-num");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.age) {
        context.res = {
            status: 200, 
            body: {
                age: durationInDaysFromText(req.query.age.toLowerCase())
            },
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a age string on the query string"
        };
    }
};

function durationInDaysFromText(text) {   
    text = text.replace(/-/g," "); 
    const split = text.split(" ");
    var i = 0;
    var ageInDays = null;
    var multiplier = null;
    const timeUnits = {
        "year": ["years", "year", "yo", "y"],
        "month": ["months", "month", "mo", "m"],
        "week": ["weeks", "week", "wo", "w"],
        "day": ["days", "day", "do", "d"]
    };
    var findSpecialPhrase = function (text) {
        const specialTimePhrases = {
            "and a half": 0.5
        };
        const timePhrases = Object.keys(specialTimePhrases);
        var specialPhraseValue = 0;
        for (var m = 0; m <= timePhrases.length && !specialPhraseValue; m++) {
            if (text.includes(timePhrases[m])) {
                specialPhraseValue = specialTimePhrases[timePhrases[m]];
            }
        }
        return specialPhraseValue;
    };
    var findAndConvertTextualNumber = function (text, i, j) {
        var res = null;
        for (var diff = j - i; diff >= 0 && !res; diff--) {
            var k;
            for (k = j; k >= diff && !res; k--) {
                res = wordsToNumber.convert(text.slice(k - diff, k + 1).join(" ")); // slice(i,j + 1) = [i,j]
                if (res && k <= j) {
                    const numberSuffix = text.slice(k, j + 1).join(" ");
                    res = res + findSpecialPhrase(numberSuffix);
                }
            }
        }
        return res;
    };
    var isLegalNumber = function (num) {
        return Number.isFinite(num) && num > 0;
    };
    // multiplier represents the time unit, for example - 30 = month
    // number is the prefix number for the time unit
    var calculateDays = function (multiplier, num) {
        switch (multiplier) {
            case 7:
                return Math.floor(num / 4) * 30 + (num % 4) * 7;
            case 30:
                return (Math.floor(num / 12) * 365) + ((num % 12) * 30);
            default:
                return num * multiplier;
        }
    };
    for (var j = 0; j < split.length; j++) {
        if (timeUnits.year.includes(split[j])) {
            multiplier = 365;
        }
        else if (timeUnits.month.includes(split[j])) {
            multiplier = 30;
        }
        else if (timeUnits.week.includes(split[j])) {
            multiplier = 7;
        }
        else if (timeUnits.day.includes(split[j])) {
            multiplier = 1;
        }
        if (multiplier) {
            const prefixNumber = findAndConvertTextualNumber(split, i, j - 1);
            i = j + 1;
            if (isLegalNumber(prefixNumber)) {
                ageInDays += calculateDays(multiplier, prefixNumber);
                multiplier = null;
            }
            else {
                return null;
            }
        }
        else {
            var lastLetter = split[j].slice(-1);
            switch (lastLetter) {
                case "y":
                    multiplier = 365;
                    break;
                case "m":
                    multiplier = 30;
                    break;
                case "w":
                    multiplier = 7;
                    break;
                case "d":
                    multiplier = 1;
                    break;
                default:
                    multiplier = null;
            }
            if (multiplier) {
                var num = Number.parseInt(split[j].substring(0, split[j].length - 1));
                if (isLegalNumber(num)) {
                    ageInDays += calculateDays(multiplier, num);
                }
            }
            multiplier = null;
        }
    }
    if (!ageInDays) { // 4.5, twenty one
        const prefixNumber = findAndConvertTextualNumber(split, 0, split.length - 1);
        if (prefixNumber) {
            ageInDays = prefixNumber * 365;
        }
    }
    return Math.round(ageInDays / 365);
}
