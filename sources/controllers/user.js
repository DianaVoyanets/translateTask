
var db = require("../../db");

module.exports = {
    
	login: (req, res) => {
		db.Users.findOne({ where: {login: req.body.user,password: req.body.pass}}).then(
			user => {
				if(user) {
					const user = {login: req.body.user,password: req.body.pass};
					req.session.user = user;
					res.send(user);
				} else {
					res.send(null);
				}
			}
		);
	},

	loginStatus: (req, res) => {
		res.send(req.session.user || null);
	},

	logout: (req, res) => {
		delete req.session.user;
		res.send({});
	},

	registration: (req,res) => {
		db.Users.findAll({ where: {login: req.body.user,password: req.body.pass}}).then(
			(user) => {
				if(user.length !== 0) {
					res.json({message:"The user with this login is already registered"});
				} else {
					db.Users.create({ 
						login: req.body.user,
						password: req.body.pass
					}).then(() => 
						res.json({ message: "You're successs register!"})
					);

				}
			});
	}};