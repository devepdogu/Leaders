const { redis } = require("./redis");
const mongoDB = require('./mongoDB');

const getKey = (...options) => {
    options = options.map((item) => item.toLowerCase());

    Date.prototype.GetFirstDayOfWeek = function () {
        return (new Date(this.setDate(this.getDate() - this.getDay() + (this.getDay() == 0 ? -6 : 1))));
    }
    Date.prototype.GetLastDayOfWeek = function () {
        return (new Date(this.setDate(this.getDate() - this.getDay() + 7)));
    }

    var settingDate = new Date();
    if (options.includes("lastdayofweek"))
        settingDate = new Date().GetLastDayOfWeek();
    else if (options.includes("firstdayofweek"))
        settingDate = new Date().GetFirstDayOfWeek();
    else if (options.includes("today"))
        settingDate = new Date();
    else if (options.includes("yesterday"))
        settingDate.setDate(settingDate.getDate() - 1);
    else {
        var week = [], today = new Date();
        today.setDate((today.getDate() - today.getDay() + 1));
        for (var i = 0; i < 7; i++) {
            let day = ("0" + today.getDate()).slice(-2),
                month = ("0" + (today.getMonth() + 1)).slice(-2),
                year = today.getFullYear();
            week.push(
                `${day}.${month}.${year}`
            );
            if (typeof options[1] !== "undefined" && week[week.length - 1] == options[1])
                break;
            today.setDate(today.getDate() + 1);
        }

        return week
    }


    let day = ("0" + settingDate.getDate()).slice(-2),
        month = ("0" + (settingDate.getMonth() + 1)).slice(-2),
        year = settingDate.getFullYear();
    return `${day}.${month}.${year}`;
}

const getTopLeaders = function (data = { offset: 0, count: 100 }) {
    redis().zUnionStore("outs", getKey("isAllWeek"), data).then(async (a) => {
        let fetchPlayer = [];
        for (let [index, [key, value]] of Object.entries(Object.entries(a))) {
            await redis().zRevRankUnion(getKey("isallweek", getKey("yesterday")), key).then(async (indis) => {
                await mongoDB.getUser({ playerId: key }).then((item) => {
                    if (item && typeof item[0] !== "undefined") {
                        fetchPlayer.push({ ...item[0], weekMoney: value, daysRank: { today: parseInt(index) + 1, yesterday: indis + 1, diff: (indis + 1) - (parseInt(index) + 1) } });
                    } else
                        console.error('key not found')
                });

            });
        }
        await mongoDB.disconnectClient();
        await this.emit("fetchTopLeader", {
            data: fetchPlayer,
        });
       


    });
}

module.exports = {
    getKey,
    getTopLeaders
}


