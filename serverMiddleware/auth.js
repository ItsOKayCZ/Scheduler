const cookieParser = require('cookie-parser');
const app = require('express')();

require('dotenv').config({
	path: '../.env'
});
const { authPath, authCookie } = process.env;

app.use(cookieParser());
app.use(function(req, res, next){
	if(process.env.NODE_ENV == 'development'){
		next();
		return;
	}

	if(req.url ==  `/${authPath}`){
		res.cookie('authCookie', authCookie, { maxAge: 1000 * 60 * 60 * 24 * 365 * 10, sameSite: "lax" });
		console.log(`Sent cookie for ${req.ip}`);
	}

	if(req.cookies.authCookie == authCookie){
		console.log(`Cookie exist for ${req.ip}`);
		next();
	} else {
		console.log(`Cookie doesn't exist for ${req.ip}`);
		res.status(200).send();
	}
});

module.exports = app;