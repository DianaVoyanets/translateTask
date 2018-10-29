
var db = require("../../db");

module.exports = {
	getData : (req, res) => {
		db.User
			.findOne({ where: req.session.user })
			.then((user) => {
				user.getWordsGroup().then((wg) => res.json(wg));
			});
	},

	removeData: (req, res) => {
		db.wordsGroup.findById(req.params.wordsGroupId)
			.then((wordsGroup) => 
				wordsGroup.destroy()
					.then(()=>
						res.json({})));
	},
    
	addData: (req, res) => {
		db.wordsGroup
			.create(req.body)
			.then((wg) => {
				db.User
					.findOne({ where: req.session.user })
					.then(user => Promise.resolve(user.setWordsGroup(wg)));
				return res.json({ id: wg.id });
			});
	},
    
	updateData: (req, res) => {
		db.wordsGroup
			.findById(req.params.wordsGroupId)
			.then((wg) => 
				wg.update(req.body).then((uwg) => {
					db.User
						.findOne({ where: req.session.user })
						.then(user => Promise.resolve(user.setWordsGroup(uwg)));
				})
			)
			.then(() => res.json({}));
	} 
};