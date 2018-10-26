
var db = require("../../db");

module.exports = {
	getData : (req, res) => {
		db.wordsGroup.findAll()
			.then(data => res.json(data));
	},

	removeData: (req, res) => {
		db.wordsGroup.findById(req.params.wordsGroupId)
			.then((company) => 
				company.destroy()
					.then(()=>
						res.json({})));
	},
    
	addData: (req, res) => {
		db.wordsGroup.create(req.body).then((obj) => 
			res.json({ id: obj.id }));
	},
    
	updateData: (req, res) => {
		db.wordsGroup.findById(req.params.wordsGroupId)
			.then((wordGroup) => 
				wordGroup.update(req.body)
			)
			.then(() => 
				res.json({}));
	} 
};