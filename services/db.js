"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEntry = exports.removeEntry = exports.addEntry = exports.getEntry = exports.dropAllEntries = exports.getAllEntries = exports.end_server = exports.run = void 0;
const mongodb_1 = require("mongodb");
const uri = process.env.DB_CONN_URL ? process.env.DB_CONN_URL : "mongodb+srv://admin:admin123@glass-edge.hqmedfc.mongodb.net/?retryWrites=true&w=majority";
const client = new mongodb_1.MongoClient(uri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    catch (error) {
        throw "Fucking server crashed!";
    }
}
exports.run = run;
function end_server() {
    client.close();
}
exports.end_server = end_server;
// * Testing
async function getAllEntries(options) {
    return new Promise(async (resolve, reject) => {
        const result = client
            .db("development")
            .collection("item")
            .find({}, { limit: options.limit, skip: options.skip });
        let send_back = [];
        for await (const doc of result) {
            send_back.push(doc);
        }
        resolve(send_back);
    });
}
exports.getAllEntries = getAllEntries;
// ! DO NOT USE THIS! FOR RESETTING DB ONLY
async function dropAllEntries() {
    return new Promise((resolve, reject) => {
        client
            .db("development")
            .collection("item")
            .deleteMany({})
            .then((result) => {
            resolve(result);
        });
    });
}
exports.dropAllEntries = dropAllEntries;
async function getEntry(entry_id) {
    return new Promise((resolve, reject) => {
        client
            .db("development")
            .collection("item")
            .findOne({ _id: new mongodb_1.ObjectId(entry_id) })
            .then((result) => {
            resolve(result);
        });
    });
}
exports.getEntry = getEntry;
async function addEntry(entry) {
    return new Promise((resolve, reject) => {
        client
            .db("development")
            .collection("item")
            .insertOne(entry)
            .then((result) => {
            resolve(result);
        })
            .catch((failed) => {
            reject(new Error("Unexpected Failure!"));
        });
    });
}
exports.addEntry = addEntry;
async function removeEntry(entry_id) {
    return new Promise((resolve, reject) => {
        client
            .db("development")
            .collection("item")
            .deleteOne({ _id: new mongodb_1.ObjectId(entry_id) })
            .then((result) => {
            resolve(result);
        });
    });
}
exports.removeEntry = removeEntry;
async function updateEntry(entry_id, body_replacement) {
    return new Promise((resolve, reject) => {
        client
            .db("development")
            .collection("item")
            .updateOne({ _id: new mongodb_1.ObjectId(entry_id) }, { $set: body_replacement })
            .then((result) => {
            resolve(result);
        });
    });
}
exports.updateEntry = updateEntry;
