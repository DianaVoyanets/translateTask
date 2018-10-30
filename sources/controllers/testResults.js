const db = require("../../db");

module.exports = {
	
	getData: (req, res) => {
		db.User
			.findOne({ where: req.session.user })
			.then((user) => 
				user.getTestResult().then((tr) => res.json(tr))
			);
	},

	addData: (req, res) => {

		let createWordGroup = (user) => {
			req.body.userId = user.id;
			return req.body;
		};
		db.User
			.findOne({ where: req.session.user })
			.then(user => db.testResult.create(createWordGroup(user), { include: [db.User] }))
			.then(testResult => res.json({ id: testResult.id }));
	}
};