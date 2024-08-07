const bcrypt = require('bcrypt');
const User = require("../models/User.js");
// Importing auth.js
const auth = require("../auth.js");
const { errorHandler } = auth;

module.exports.getProfile = (req, res) => {
	
	return User.findById(req.user.id)
	.then(user => {

		if(!user){
			return res.status(403).send({ message: 'invalid signature' })
		}else {
			user.password = "";
			return res.status(200).send({user: user});
		}  
	})
	.catch(error => errorHandler(error, req, res));
};

module.exports.registerUser = (req,res) => {
	if (!req.body.email.includes("@")){
		return res.status(400).send({error: "Email invalid"});
	}
    // Checks if the password has atleast 8 characters
	else if (req.body.password.length < 8) {
		return res.status(400).send({error: "Password must be atleast 8 characters"});
    // If all needed requirements are achieved
	} else {
		let newUser = new User({
			username: req.body.username,
			email : req.body.email,
			password : bcrypt.hashSync(req.body.password, 10)
		})

		return newUser.save()
		.then((result) => res.status(201).send({
			message: "Registered Successfully"
					}))
		.catch(error => errorHandler(error, req, res));
	}
};


module.exports.checkEmailExists = (req, res) => {
	if(req.body.email.includes("@")){
		return User.find({ email : req.body.email })
		.then(result => {
			if (result.length > 0) {
	        	// 409 is the http status code for duplicate record which is used when there is another resource with the same data in the request
				return res.status(409).send({message: "Duplicate email found"});
	        // else, there is no duplicate email, send false with the status code back to the client
			} else {
	        	// 404 http status code refers to documents or resources that are not found
				return res.status(404).send({error: "No Email Found"});
			};
		})
		.catch(error => errorHandler(error, req, res));
	}else{
		res.status(400).send({error: "Invalid Email"})
	}
};


module.exports.loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            console.log("No Username Found");
            console.log(req.body.username);
            return res.status(404).send({ success: false, message: 'No Username Found' });
        } else {
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
            if (isPasswordCorrect) {
                console.log("Password correct, generating token");
                const accessToken = auth.createAccessToken(user);
                return res.status(200).send({ access: accessToken });
            } else {
                console.log("Password incorrect");
                return res.status(401).send({ success: false, error: 'Username and password do not match' });
            }
        }
    } catch (error) {
        console.error("Error during login:", error);
        return errorHandler(error, req, res);
    }
};

