export var wordsGroup = new webix.DataCollection({
	url: "http://localhost:3000/wordsGroup",
	save: "rest->http://localhost:3000/wordsGroup/",
	scheme: {
		$init(obj) {
			if(typeof obj.wordsIds === "object") return;
			obj.wordsIds = JSON.parse(obj.wordsIds);
		}
	}
});