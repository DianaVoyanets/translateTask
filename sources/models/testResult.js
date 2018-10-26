export var testResultsCollection = new webix.DataCollection ({
	url:"/server/testResult",
	save:"rest->/server/testResult",
	scheme: {
		$init(obj) {
			if(!obj.createdAt) return;
			let newCreatedAtObj = obj.createdAt.split("",19);
			let firstIndex = newCreatedAtObj.indexOf("T");
			let secondIndex = newCreatedAtObj.indexOf("Z");
			newCreatedAtObj[firstIndex] = " ";
			newCreatedAtObj[secondIndex] = "";
			obj.createdAt = newCreatedAtObj.join("");
		}
	}
});