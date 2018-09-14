var Sequelize = require("sequelize");

var sequelize = new Sequelize("sampledb","root","1",{
	host: "localhost",
	dialect: "sqlite",
	storage: "database.sqlite"
});

var Users = sequelize.define("users",{
	login: Sequelize.STRING,
	password: Sequelize.STRING,
});


var Words = sequelize.define("words", {
	originWords: Sequelize.STRING,
	translation: Sequelize.STRING, 
	partOfSpeach: Sequelize.STRING,
});

var testResult = sequelize.define("testResult",{
	result: Sequelize.INTEGER,
	groupName: Sequelize.STRING
});


var wordsGroup = sequelize.define("wordsGroup",{
	name: Sequelize.STRING,
	dateOfCreation: Sequelize.DATE,
	//user: Sequelize.STRING,
	wordsIds: [
		{
			type: Sequelize.INTEGER,
			references: {
				model: "words",
				key: "id",
				deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
			},
		}
	] 
});


module.exports = {
	Users,Words,wordsGroup,testResult
};