
const db = require("../../db");

module.exports = {
	getData: (req, res) => {
		db.User
			.findOne({ where: req.session.user })
			.then(user => user.getWordsGroup())
			.then(wordGroup => res.json(wordGroup));
	},

	removeData: (req, res) => {
		db.wordsGroup
			.findById(req.params.wordsGroupId)
			.then(wordsGroup => wordsGroup.destroy())
			.then(() => res.json({}));
	},
	addData: (req, res) => {
		let createWordGroup = (user) => {
			req.body.userId = user.id;
			return req.body;
		};

		db.User
			.findOne({ where: req.session.user })
			.then(user => db.wordsGroup.create(createWordGroup(user), { include: [db.User] }))
			.then(wordGroup => res.json({ id: wordGroup.id }));
	},
	updateData: (req, res) => {
		let updateWordsGroup = (user) => {
			req.body.userId = user.id;
			return req.body;
		};

		db.User
			.findOne({ where: req.session.user })
			.then((user) => 
				db.wordsGroup
					.findById(req.params.wordsGroupId)
					.then((wordGroup) => wordGroup.update(updateWordsGroup(user), { include: [db.User] }))
			)
			.then(() => res.json({}));
	} 
};