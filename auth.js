// [SECTION] Dependencies and Modules
const jwt = require("jsonwebtoken");
require('dotenv').config();


module.exports.createAccessToken = (user) => {

	console.log(user);
	const data = {
		id: user._id,
		email: user.email,
		username: user.username,
		isAdmin: user.isAdmin
	}

	return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
}

// [SECTION] Token Verification

module.exports.verify = (req, res, next) => {
	console.log(req.headers.authorization);


	let token = req.headers.authorization;

	if(typeof token === "undefined"){
		return res.send({auth: "Failed. No Token"});
	} else {
		console.log(token)
		token = token.slice(7, token.length);
		console.log(token);

		// [SECTION] Token decryption

		jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decodedToken){
			if(err){
				return res.status(403).send({
					auth: "Failed",
					message: err.message
				});
			} else {
				console.log("result from verify method:");
				console.log(decodedToken);

				req.user = decodedToken;

				next();
			}
		})
	}
}

// module.exports.verify = (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//         return res.status(401).send({ auth: "Failed. No Token" });
//     }

//     // Extract token from header
//     const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

//     if (!token) {
//         return res.status(401).send({ auth: "Failed. Invalid Token Format" });
//     }

//     // Verify token
//     jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
//         if (err) {
//             return res.status(403).send({
//                 auth: "Failed",
//                 message: err.message
//             });
//         } else {
//             req.user = decodedToken; // Attach decoded token to request
//             next(); // Proceed to next middleware or route handler
//         }
//     });
// }


// [SECTION] Admin Verification

module.exports.verifyAdmin = (req, res, next) => {

	if(req.user.isAdmin){
		next();
	} else {
		return res.status(403).send({
			auth: "Failed",
			message: "Action Forbidden"
		})
	}
}

// [SECTION] Error Handler
module.exports.errorHandler = (err, req, res, next) => {
	// Log error
	console.error(err);

	const errorMessage = err.message || 'Internal Server Error';
	const statusCode = err.status || 500;

	res.status(statusCode).json({
		error: {
			message: errorMessage,
			errorCode: err.code || 'SERVER_ERROR',
			details: err.details || null
		}
	})
}

// [SECTION] Middleware to check if the user is authenticated
module.exports.isLoggedIn = (req, res, next) => {
	if(req.user){
		next();
	} else {
		res.sendStatus(401);
	}
}