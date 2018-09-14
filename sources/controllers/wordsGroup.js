// var db = require("../../db");


// module.exports = {
// 	getData : (req, res) => {
// 		db.wordsGroup.findAll({user: req.session.login}).then((data) => {
// 			let mass = data.map((item)=>{
// 				item.id = item._id;
// 				return item;
// 			});
// 			res.json(mass);
// 		}) 
// 	},

// 	removeData: (req, res) => {
// 		db.wordsGroup.findById(req.params.wordsGroupId)
// 			.then((wordsgroup) => 
// 				wordsgroup.destroy()
// 					.then(()=>
// 						res.json({})));
// 	},
    
// 	addData: (req, res) => {
// 		let name = req.body.name;
// 		let words = JSON.parse(req.body.wordsIds);
// 		let newGroup = {
// 			name,
// 			words,
// 			"user" : req.session.user.login
// 		};
// 		db.wordsGroup.create(newGroup, function(err){
// 			if(err){
// 				res.send(null);
// 			} else {
// 				res.json({});
// 			}
// 		});
// 	},
    
// 	updateData: (req, res) => {
// 		let name = req.body.name;
// 		var words = JSON.parse(req.body.wordsIds);
// 		let newGroup = {
// 			name,
// 			words
// 		};
// 		db.wordsGroup.findByIdAndUpdate(req.params.id, newGroup, function(err){
// 			if(err){
// 				res.status(500).send(err);
// 				console.log(err);
// 			} else {
// 				res.json({});
// 			}
// 		})
// 	},
    
// };

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
			.then((company) => 
				company.update(req.body))
			.then(() => 
				res.json({}));
	}
    
};