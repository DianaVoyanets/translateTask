
var db = require("../../db");

module.exports = {
	getData : (req, res) => {
		db.User
			.findOne({ where: req.session.user })
			.then((u) => 
				u.getWordsGroup().then((wg) => res.json(wg))
			);
	},

	removeData: (req, res) => {
		db.wordsGroup.findById(req.params.wordsGroupId)
			.then((company) => 
				company.destroy()
					.then(()=>
						res.json({})));
	},
    
	addData: (req, res) => {
		db.wordsGroup
			.create(req.body)
			.then((wg) => {

				db.User
					.findOne({ where: req.session.user })
					.then(u => Promise.resolve(u.setWordsGroup(wg)));

				return res.json({ id: wg.id })
			});
	},
    
	updateData: (req, res) => {
		db.wordsGroup
			.findById(req.params.wordsGroupId)
			.then((wg) => 
				wg.update(req.body).then((uwg) => {
					db.User
						.findOne({ where: req.session.user })
						.then(u => Promise.resolve(u.setWordsGroup(uwg)))
				})
			)
			.then(() => res.json({}));
	}
    
};