
const getlocation = async (req, res) => {
    try {
        const collection = await connectToCollection('LoginInformation');
        const user = await collection.findOne({ email: req.user.email });
        res.status(200).json({
            latitude: user.latitude,
            longitude: user.longitude,
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
module.exports = getlocation;
