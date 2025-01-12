require('dotenv').config();

const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const connectToCollection = async (collectionName) => {
    try {
        await client.connect();
        const db = client.db('Login');
        const collection = db.collection(collectionName);
        return collection;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

module.exports = connectToCollection;