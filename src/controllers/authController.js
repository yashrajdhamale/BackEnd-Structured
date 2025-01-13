const connectToCollection = require('../middlewares/connectToCollection');

require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// MongoClient is imported her to only close the connection after the operation is done
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);



const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const collection = await connectToCollection('LoginInformation');
        const user = await collection.findOne({ email });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.hashedPassword);
            if (isMatch) {
                const token = jwt.sign(
                    { userId: user._id, email: user.email }, // payload
                    process.env.JWT_SECRET
                );

                // Set a cookie with a far-future expiration date
                res.cookie('authToken', token, {
                    httpOnly: true,       // Prevents client-side JavaScript from accessing the cookie
                    secure: false,        // Allows the cookie to be sent over HTTP (not recommended for production)
                    sameSite: 'None',     // Allows the cookie to be sent with cross-origin requests
                    path: '/',            // Makes the cookie accessible to all paths on your server
                    expires: new Date(9999, 11, 31), // Sets a long expiration date
                });
                
                

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

const logout = async (req, res) => {
    try {
        res.clearCookie('authToken');
        res.status(200).json({ message: 'Logout successful!' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { login, signup ,logout};
