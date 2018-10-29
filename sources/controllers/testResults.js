var db = require("../../db");

module.exports = {
	getData : (req, res) => {
		db.User
			.findOne({ where: req.session.user })
			.then((user) => 
				user.getTestResult().then((tr) => res.json(tr))
			);
	},
    
	addData: (req, res) => {
		db.testResult
			.create(req.body)
			.then((wg) => {
				db.User
					.findOne({ where: req.session.user })
					.then(user => Promise.resolve(user.setTestResult(wg)));
				return res.json({ id: wg.id });
			});
	},
    
};