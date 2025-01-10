const { MongoClient } = require('mongodb');
require('dotenv').config();
const bcrypt = require('bcrypt');

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

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const collection = await connectToCollection('LoginInformation');

        const user = await collection.findOne({ email });
        if (user) {
            // Compare hashed password
            const isMatch = await bcrypt.compare(password, user.hashedPassword);
            if (isMatch) {
                res.status(200).json({ message: 'Login successful!' });
            } else {
                res.status(401).json({ error: 'Invalid credentials!' });
            }
        } else {
            res.status(401).json({ error: 'Invalid credentials!' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
};

const signup = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const collection = await connectToCollection('LoginInformation');

        // Check if user already exists
        const user = await collection.findOne({ email });
        if (user) {
            res.status(400).json({ error: 'User already exists!' });
        } else {
            // Insert new user
            await collection.insertOne({ firstname, lastname, email, hashedPassword });
            res.status(201).json({ message: 'User created!' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
};

module.exports = { login, signup };
