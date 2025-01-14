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

const updateLocation = async (req, res) => {
    try {
        const collection = await connectToCollection('LoginInformation');

        // Fetch the user's current location
        const user = await collection.findOne({ email: req.user.email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { latitude, longitude } = req.body;
        const newLocation = {
            type: "Point",
            coordinates: [longitude, latitude],
        };

        // Update the user's location in the database
        await collection.updateOne(
            { email: req.user.email },
            { $set: { location: newLocation } }
        );

        console.log("Location updated successfully!");
        return res.status(200).json({ message: "Location updated successfully!" });
    } catch (error) {
        console.error("Error updating location:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const getprofilesss = async (req, res) => {
  try {
    const collection = await connectToCollection('LoginInformation');

    // Get the current user's location and email from the JWT
    const user = await collection.findOne({ email: req.user.email });
    const [longitude, latitude] = user.location.coordinates;
    const userEmail = user.email;

    // Radius in meters
    const radiusInMeters = 10;
    const radiusInRadians = radiusInMeters / 6378100;

    // Fetch nearby users excluding the current user
    const nearbyUsers = await collection.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radiusInRadians]
        }
      },
      email: { $ne: userEmail } // Exclude the current user by email
    }).toArray();

    res.status(200).json(nearbyUsers);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

  
module.exports = { getprofile, updateLocation, getprofilesss };