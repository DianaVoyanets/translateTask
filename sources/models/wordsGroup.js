export const wordsGroup = new webix.DataCollection({
	url: "/server/wordsGroup",
	save: "rest->/server/wordsGroup/",
	scheme: {
		$init(obj) {
			if(typeof obj.words === "object") return;
			obj.words = JSON.parse(obj.words);
			
			let newCreatedAtObj = obj.dateOfCreation.split("",19);
			let firstIndex = newCreatedAtObj.indexOf("T");
			let secondIndex = newCreatedAtObj.indexOf("Z");
			newCreatedAtObj[firstIndex] = " ";
			newCreatedAtObj[secondIndex] = "";
			obj.dateOfCreation = newCreatedAtObj.join("");
		}
	}
});