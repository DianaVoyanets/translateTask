var db = require("../../db");

module.exports = {
	getData : (req, res) => {
		db.testResult.findAll()
			.then(data => res.json(data));
	},
    
	addData: (req, res) => {
		db.testResult.create(req.body).then((obj) => 
			res.json({ id: obj.id }));
	},
    
};