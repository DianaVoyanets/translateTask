export var baseOfWordsCollection = new webix.DataCollection({
	url: "http://localhost:3000/words",
	save: "rest->http://localhost:3000/words/",
});