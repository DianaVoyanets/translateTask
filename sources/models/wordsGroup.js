export const wordsGroup = new webix.DataCollection({
	url: "/server/wordsGroup",
	save: "rest->/server/wordsGroup/",
	scheme: {
		$init(obj) {
			if(typeof obj.wordsIds === "object") return;
			obj.wordsIds = JSON.parse(obj.wordsIds);
		}
	}
});