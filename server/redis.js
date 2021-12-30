const { Tedis, TedisPool } = require("tedis");


const client = new Tedis({
    port: 6379,
    host: "127.0.0.1"
});
client["onConnection"] = null;

client.on("connect", () => {
    client["onConnection"] = true;
});
client.on("error", err => {
    console.log(err);
    client["onConnection"] = false;
    client.close();
});
client.on("close", had_error => {
    console.log("close with err: ", had_error);
    client["onConnection"] = false;
    client.close();
});



function redis() {

    if (client.onConnection || client.onConnection == null) {
        let zIncrBy = function (key, amount, member) {
            new Promise(async (res, rej) => {
                let result = await client.zincrby(key, amount, member);
                if (result)
                    res(result)
                else
                    rej(0)
            }).catch((k) => k)
            return this;
        };
        let zAdd = function (key, members) {

            for (let member of members) {
                client.command("ZADD", key, member.score, member.value);
            }
            return this;
        };



        let zRevRange = async function (key, limit) {
            return await client.zrevrangebyscore(key, "+inf", "-inf", { withscores: "WITHSCORES", limit });
        }
        let zUnionStore = async (key, union, limit) => {
            var obj = {};
            for (let day of union) {
                obj[day] = 1;
            }
            client.zunionstore(key, obj);
            return await client.zrevrangebyscore(key, "+inf", "-inf", { withscores: "WITHSCORES", limit });
        };

        let zRevRank = async (key, member) => {
            return await client.zrevrank(key, member);
        }

        let zRevRankUnion = async (union, member) => {
            var obj = {};
            for (let day of union) {
                obj[day] = 1;
            }
            client.zunionstore("outRankUnion", obj);
            return await client.zrevrank("outRankUnion", member);

        }
       
        return {
            client,
            zRevRange: zRevRange,
            zUnionStore: zUnionStore,
            zIncrBy: zIncrBy,
            zAdd: zAdd,
            zRevRankUnion: zRevRankUnion,
            zRevRank: zRevRank
        };
    }
    return ;
}

module.exports = {
    redis
}