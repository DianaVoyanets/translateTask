var db = require("../../db");

module.exports = {
	getData : (req, res) => {
		db.Words.findAll()
			.then(data => res.json(data));
	},

	removeData: (req, res) => {
		db.Words.findById(req.params.wordsId)
			.then((company) => 
				company.destroy()
					.then(()=>
						res.json({})));
	},
    
	addData: (req, res) => {
		db.Words.create(req.body).then((obj) => 
			res.json({ id: obj.id }));
	},
    
	updateData: (req, res) => {
		db.Words.findById(req.params.wordsId)
			.then((company) => 
				company.update(req.body))
			.then(() => 
				res.json({}));
	}
    
};