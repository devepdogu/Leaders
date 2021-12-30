const { MongoClient } = require("mongodb")
let db_name = "leader",
    collection = "users",
    url = `mongodb://localhost:27017/${db_name}`;


const client = new MongoClient(url, { useUnifiedTopology: true }, { useNewUrlParser: true });

async function isConnect() {
    try {
        await client.connect();
        await client.db(db_name).command({ ping: 0 });
    } finally {
        await client.close();
    }
}
isConnect().catch((e) => console.error("Mongodb not start!"));

exports.getUser = async (user = {}, limit = Number.MAX_SAFE_INTEGER) => {
    try {
        await client.connect();
        let db = client.db(db_name);

        return await db.collection(collection).find(user).limit(limit).toArray()
    } catch (e) {
        console.error(e);
    } 
}

exports.disconnectClient = async () => {
    await client.close();
}

exports.insertUser = async (user = {}) => {
    try {
        await client.connect();
        let db = client.db(db_name);

        return await db.collection(collection).insertOne(user);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

exports.updateUser = async (user = {}, data = {}) => {
    try {
        await client.connect();
        let db = client.db(db_name);

        return await db.collection(collection).updateOne(user, data);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

exports.deleteOneUser = async (user = {}) => {
    try {
        await client.connect();
        let db = client.db(db_name);
        return db.collection(collection).deleteOne(user, data);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

exports.deleteManyUser = async (users = {}) => {
    try {
        await client.connect();
        let db = client.db(db_name);

        return await db.collection(collection).deleteMany(users);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}