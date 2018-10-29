const Sequelize = require("sequelize");

const sequelize = new Sequelize(
	"sampledb", 
	"root", 
	"1", 
	{
		host: "localhost",
		dialect: "sqlite",
		storage: "database.sqlite"
	}
);

const User = sequelize.define("user", {
	login: Sequelize.STRING,
	password: Sequelize.STRING,
});

const Word = sequelize.define("word", {
	originWords: Sequelize.STRING,
	translation: Sequelize.STRING, 
	partOfSpeach: Sequelize.STRING,
});

const testResult = sequelize.define("testResult", {
	result: Sequelize.INTEGER,
	groupName: Sequelize.STRING
});

const wordsGroup = sequelize.define("wordsGroup",{
	name: Sequelize.STRING,
	dateOfCreation: Sequelize.DATE,
	words: [{
		type: Sequelize.INTEGER,
		references: {
			model: "Word",
			key: "id",
			deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
		}
	}] 
});

User.hasMany(wordsGroup, {as: "WordsGroup"});
wordsGroup.belongsTo(User);
User.hasMany(testResult, {as: "TestResult"});
testResult.belongsTo(User);

module.exports = {
	sequelize, User, Word, wordsGroup, testResult
};