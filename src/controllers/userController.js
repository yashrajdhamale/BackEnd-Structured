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

        // Ensure the user's current location exists
        if (user.location && user.location.type === "Point") {
            const [oldLon, oldLat] = user.location.coordinates;

            // Calculate distance using MongoDB's $geoNear or GeoJSON
            const haversineDistance = (lat1, lon1, lat2, lon2) => {
                const toRad = (value) => (value * Math.PI) / 180;

                const R = 6371000; // Radius of Earth in meters
                const dLat = toRad(lat2 - lat1);
                const dLon = toRad(lon2 - lon1);

                const a =
                    Math.sin(dLat / 2) ** 2 +
                    Math.cos(toRad(lat1)) *
                        Math.cos(toRad(lat2)) *
                        Math.sin(dLon / 2) ** 2;

                return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            };

            const distanceMoved = haversineDistance(
                oldLat,
                oldLon,
                latitude,
                longitude
            );

            console.log(`Distance moved: ${distanceMoved} meters`);

            // Update only if the user moved more than 10 meters
            if (distanceMoved > 0) {
                await collection.updateOne(
                    { email: req.user.email },
                    { $set: { location: newLocation } }
                );
                console.log("Location updated!");
                return res.status(200).json({ message: "Location updated!" });
            } else {
                console.log("User did not move significantly.");
                return res
                    .status(200)
                    .json({ message: "No significant movement detected." });
            }
        } else {
            // If the user has no location, initialize it
            await collection.updateOne(
                { email: req.user.email },
                { $set: { location: newLocation } }
            );
            console.log("Initial location set!");
            return res.status(200).json({ message: "Initial location set!" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const getprofilesss = async (req, res) => {
    try {
      const collection = await connectToCollection('LoginInformation');
  
      // Get the current user's location from the JWT
      const user = await collection.findOne({ email: req.user.email });
      const [longitude, latitude] = user.location.coordinates;

      
  
      // Radius in meters
      const radiusInMeters = 10;
      const radiusInRadians = radiusInMeters / 6378100;
  
      // Fetch nearby users
      const nearbyUsers = await collection.find({
        location: {
          $geoWithin: {
            $centerSphere: [[longitude, latitude], radiusInRadians]
          }
        }
      }).toArray();
  
      res.status(200).json(nearbyUsers);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
module.exports = { getprofile, updateLocation, getprofilesss };