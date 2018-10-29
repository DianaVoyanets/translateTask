const db = require("../../db");

module.exports = {
	login: (req, res) => {
		const user = { login: req.body.user, password: req.body.pass};

		db.User
			.findOne({ where: user })
			.then(u => {
				if (u) {
					req.session.user = user;
					res.send(user);
				} else {
					res.send(null);
				}
			});
	},
    
	getUser: (req, res) => {
		db.User
			.findAll()
			.then(data => res.json(data));
	},
    
	loginStatus: (req, res) => {
		res.send(req.session.user || null);
	},

	logout: (req, res) => {
		delete req.session.user;
		res.send({});
	},
    
	registration: (req,res) => {
		const user = { login: req.body.user, password: req.body.pass};

		db.User
			.findAll({ where: user })
			.then((u) => {
				if (u.length !== 0) {
					res.json({ message: "The user with this login is already registered" });
				} else {
					db.User
						.create(user)
						.then(() => res.json({ message: "You are successfully registered!"}));
				}
			});
	}
};