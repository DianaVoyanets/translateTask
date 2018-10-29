const db = require("../../db");

module.exports = {
	getData : (req, res) => {
		db.Word.findAll()
			.then(data => res.json(data));
	},

	removeData: (req, res) => {
		db.Word.findById(req.params.wordsId)
			.then((company) => 
				company.destroy()
					.then(()=>
						res.json({})));
	},
    
	addData: (req, res) => {
		db.Word.create(req.body).then((obj) => 
			res.json({ id: obj.id }));
	},
    
	updateData: (req, res) => {
		db.Word.findById(req.params.wordsId)
			.then((company) => 
				company.update(req.body))
			.then(() => 
				res.json({}));
	}
    
};