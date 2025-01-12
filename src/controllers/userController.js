const connectToCollection = require('../middlewares/connectToCollection');

const getprofile = async (req, res) => {
    try {
        const collection = await connectToCollection('LoginInformation');
        const user = await collection.findOne({ email: req.user.email });
        res.status(200).json({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { getprofile };