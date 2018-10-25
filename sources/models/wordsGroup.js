export const wordsGroup = new webix.DataCollection({
	url: "/server/wordsGroup",
	save: "rest->/server/wordsGroup/",
	scheme: {
		$init(obj) {
			if(typeof obj.words === "object") return;
			obj.words = JSON.parse(obj.words);
		}
	}
});