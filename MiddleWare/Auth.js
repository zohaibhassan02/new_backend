const jwt = require('jsonwebtoken');

exports.authCheck = (req, res, next) => {
    const token = req.cookies.token 
    // console.log(token)
    if (token) {
        jwt.verify(token, process.env.JET_SECREAT, (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: "error",
                    message: "Invalid or expired token",
                    error: error
                })
            }
            req.userId = decoded._id;
            req.userType = decoded.type;
            next();
        })
    } else {
        return res.status(400).json({
            status: "error",
            message: "Authorization required"
        })
    }
}