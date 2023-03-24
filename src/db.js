// tests/db-handler.js
require("dotenv").config();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = new MongoMemoryServer();

/**
 * Connect to the in-memory database.
 */
 const mongodbURL = process.env.TEST_SUIT == "true"?process.env.MONGO_DB_TEST:process.env.MONGO_DB
// const mongodbURL = process.env.MONGO_DB_TEST
const connect = async () => {
    mongoose.connect(mongodbURL, {useNewUrlParser: true}).then((res)=>{
        console.log('connect on db');
    }).catch((err)=>{
        console.log(err);
    });
}

/**
 * Drop database, close the connection and stop mongod.
 */
const closeDatabase = async () => {
    await mongoose.connection.close();
}

/**
 * Remove all the data for all db collections.
 */
const clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        console.log('collection-->',collections[key]);
        const collection = collections[key];
       
        await collection.deleteMany();
    }
}

module.exports = {
    connect,
    closeDatabase,
    clearDatabase,
}