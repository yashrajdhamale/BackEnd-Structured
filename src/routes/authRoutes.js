const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const getdata = async (req, res) => {
    try {        
        const data = await client.db('Practice').collection('InsertOperation').find({}).toArray();
        res.json(data);
        console.log(data);
    } catch (error) {
        console.error(error.message);
    }
};

module.exports = getdata;