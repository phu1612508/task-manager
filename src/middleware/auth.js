const jwt = require("jsonwebtoken");
const User = require("../models/user");
const privateKey = `MIICXgIBAAKBgQCHYw4zQtMKbyr3Fh4aahIY/Y7eDsCef91UvxMU1RLEhLZl1Ojt
avSjLOslK6Y6wFbjW4pjvJVBf02QeoROVXceG5IziwbeZSeOVTt0pFeZXiY3fEF5
Fw9Tbmt0zUHI2pzU6APLjrYJhbx5jslcVh11VOeeAP2P7jkXgqCj9PoO+wIDAQAB
AoGAJZy4UjdraAewWQq0/EOhmX2/1iMlEiOVuriGtY/ocd4oyiuXNnYzVq3g+eeh
e8r5mJpS3RiEIrkaNFxFK3oE6FnCY31hfNMWC2GeTfmIeC00r9ZrEyYDcQXTD5k5
Q5nq0eX3zFCuiihkU46ImulREmI8+nJEcqSwhtgCCS47v8ECQQDFmMO0P8eoJH8D
DDZHP3wbIFtphm/0zJqNLgaF1HeRIfqcC6Vij4SqiSSJGZr8nmLBDPtzgMRnwdDk
TAWWAUyhAkEAr2cpZiOeRhNn2dEZnJlu3A9AYSW7qLoqdQA4J/KLISX8aRtlFilu
h3L/uA5cv2SrzggKdN5179jgZBRYZuq6GwJBALeyiKZG8ReZLlcoAEIGfBs/3pvg
9q4vlLMRidDbMHlFjJWLoipZ4G0maEfo/RRDLu3oYtADcxQ+tDO5lSvac2ECQQCF
5xxcpA5c8s2SJCYIPb26802znCmxukVVQpCcNnXuHWCfING/5GtDrg/4A8bcOc9K
nyrUY0vniUpsPHfsQX9HAkEAtLDFP12RskuGxA/8MiFHSe+iN3+prRt+MCLm+7JO
NbgxyWleAbnNqHrA2xbQIv2yn80moxZUAopFO/zzmRfEQw==`
const auth = async (req, res, next) => {
    try {
        const token = req.headers["authorization"].replace("Bearer ", "");
        const decoded = jwt.verify(token, privateKey);
        const user = await User.findOne({
            _id: decoded._id,
            "tokens.token": token
        });
        if (!user) {
            throw new Error("")
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401).send({
            error: "please authenticate."
        });
    }
};

module.exports = auth