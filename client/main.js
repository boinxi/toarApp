var loadedAds = false;
var ads;
const screenID = 3;
var calledDoIt = false;

function start() {
    $("#screenIdHeader").html("screenID: " + screenID.toString());

    var socket = io();
    socket.emit('screenId', screenID);
    socket.on('msg', function (msg) {
        console.log("got from server", msg)
    });
    socket.on('data', function (data) {
        console.log("DATATAA!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", data)
        ads = data;
        if (!calledDoIt) {
            doIt();
            console.log('called do it')
            calledDoIt = true;
        }
    });
}


const noAdToShowPlaceholder = {
    name: 'noAdToShowPlaceholder',
    template: './noAdToShowPlaceholder.html',
    length: 15,
    showTimes: [
        {
            startDate: '10/1/1970',
            endDate: '10/10/9999',
            weekDays: ['1', '2', '3', '4', '5', '6', '7'],
            dayHours: {
                start: [0, 0],
                end: [23, 59]
            }
        },
    ]

};

var adIndex = 0;

function isHourToShow(showTimes) {
    function isHourBetween(hour, min, startHour, startMin, endHour, endMin) {
        let sDate = new Date('1/1/1970 ' + startHour + ":" + startMin);
        let eDate = new Date('1/1/1970 ' + endHour + ":" + endMin);
        let checkDate = new Date('1/1/1970 ' + hour + ":" + min);

        let secondBetweenStart = (sDate.getTime() - checkDate.getTime()) / 1000;
        let secondBetweenEnd = (eDate.getTime() - checkDate.getTime()) / 1000;

        return secondBetweenStart <= 0 && secondBetweenEnd >= 0;
    }

    const dt = new Date();
    let isInHours = false;
    const hour = dt.getHours();
    const min = dt.getMinutes();
    showTimes.forEach((showTimesElement) => {
        let startTS = new Date('1/1/1970 ' + showTimesElement.dayHours.start[0] + ':' + showTimesElement.dayHours.start[1]);
        let endTS = new Date('1/1/1970 ' + showTimesElement.dayHours.end[0] + ':' + showTimesElement.dayHours.end[1]);
        if (isHourBetween(
            hour,
            min,
            showTimesElement.dayHours.start[0],
            showTimesElement.dayHours.start[1],
            showTimesElement.dayHours.end[0],
            showTimesElement.dayHours.end[1])) {
            isInHours = true;
        }
    });
    return isInHours;
}

function isInTimeFrame(showTimes) {
    const dt = new Date();
    const timestamp = dt.getTime();
    let isTime = false;
    showTimes.forEach((showTimesElement) => {
        let startTS = new Date(showTimesElement.startDate + ' 00:00');
        let endTS = new Date(showTimesElement.endDate + ' 23:59');
        if (startTS.getTime() <= timestamp && endTS.getTime() >= timestamp) {
            isTime = true;
        }
    });
    return isTime;
}

function isWeekDayOK(showTimes) {
    const dt = new Date();
    const day = dt.getDay() + 1;
    let isDayGood = false;

    showTimes.forEach((showTimesElement) => {
        if (showTimesElement.weekDays.includes(day))
            isDayGood = true;
    });
    return isDayGood;
}

function getCurrentIndex() {
    const dt = new Date();
    const day = dt.getDay() + 1;
    for (let i = adIndex; i < ads.length; i++) {
        console.log('checking ad', i);
        console.log("isInTimeFrame", isInTimeFrame(ads[i].showTimes));
        console.log("isHourToShow", isHourToShow(ads[i].showTimes));
        console.log("isWeekDayOK", isWeekDayOK(ads[i].showTimes));
        let canShowAd = isInTimeFrame(ads[i].showTimes)
            && isHourToShow(ads[i].showTimes)
            && isWeekDayOK(ads[i].showTimes);
        if (canShowAd) {
            return i;
        }
    }
    return -1;
}

function loadAd(ad) {
    console.log('loaded ad:', ad.name);
    $("#adTitle").html("showing ad: " + JSON.stringify(ad));
    const mainStage = $("#result");
    mainStage.load(ad.template)
}

function doIt() {
    const currAdIndex = getCurrentIndex();
    console.log("currIndex", currAdIndex);
    adIndex = currAdIndex;
    if (currAdIndex === -1) {
        loadAd(noAdToShowPlaceholder);
        adIndex = 0;
        setTimeout(function () {
            doIt();
        }, 1000);
    } else {
        loadAd(ads[currAdIndex]);
        adIndex++;
        if (adIndex >= ads.length) {
            adIndex = 0;
        }
        setTimeout(function () {
            doIt();
        }, ads[currAdIndex].length * 1000);
    }

}
