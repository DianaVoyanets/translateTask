import {JetView} from "webix-jet";
import {wordsGroup} from "models/wordsGroup";
import {baseOfWordsCollection} from "models/baseOfWordsCollection";

export default class doTest extends JetView {
	config() {
		this.groupName = "";

		return {
			rows: [
				{
					view: "label",
					label: "Please choose the group of words:"
				},
				{cols: [
					{
						view: "richselect",
						localId: "myrichselect",
						options: {body:{template:"#name#", data: wordsGroup} },
						width: 200,
						on: {
							"onChange": () => {
								this.groupName = this.$$("myrichselect").getText();
								this.getRandomWordLabel();
							}
						}
					},
					{view: "spacer"},
				]
				},
				{
					cols: [
						{view: "label",label: "",align: "center",localId: "mylabel"}
					]
				},
                
				{
					margin:30,cols: [
						{ view:"spacer"},
						{ view: "button",localId:"1",value: "",width: 200},
						{ view: "button",localId:"2",value: "",width: 200},
						{ view: "spacer"}
					]
				},

				{
					margin: 30,cols: [
						{ view:"spacer"},
						{ view: "button",localId:"3",value: "",width: 200},
						{ view: "button",localId:"4",value: "",width: 200},
						{ view: "spacer"}
					]
				},
				{view: "spacer"}

			]
           
		};   
        
	}


	getRandomWordLabel() {
    
		this.allButtonValueClear();

		let selectedGroup = wordsGroup.find(obj => obj.name === this.groupName, true);
        
		let buttonIds = ["1", "2", "3", "4"];
		let randomButtonId = this.getRandomRange(0, buttonIds.length - 1);
		let randomButton = buttonIds[randomButtonId];
        
		let randomWordId;
		let partOfSpeachWords;
		let randomWordGroup;

		if (Array.isArray(selectedGroup.wordsIds)) {
			randomWordId = this.getRandomRange(0, selectedGroup.wordsIds.length);
			randomWordGroup = selectedGroup.wordsIds[randomWordId];

			partOfSpeachWords = baseOfWordsCollection.find(obj => {
				return obj.partOfSpeach === randomWordGroup.partOfSpeach 
                    && obj.translation !== randomWordGroup.translation 
                    && obj.originWords !== randomWordGroup.originWords;
			});
            
			if (partOfSpeachWords.length === 0) {
				partOfSpeachWords.push(randomWordGroup);
			}

			let randomRightTranslateWord = randomWordGroup.translation;
			this.$$(randomButton).setValue(randomRightTranslateWord);
            
			let randomWordfromSelectedGroup = randomWordGroup.originWords;
			this.$$("mylabel").setValue(randomWordfromSelectedGroup);

		} else {
			let singleWordGroup = selectedGroup.wordsIds;

			this.$$("mylabel").setValue(singleWordGroup.originWords);
			this.$$(randomButton).setValue(singleWordGroup.translation);
 
			partOfSpeachWords = baseOfWordsCollection.find(obj => {
				return obj.partOfSpeach === singleWordGroup.partOfSpeach 
                    && obj.translation !== singleWordGroup.translation 
                    && obj.originWords !== singleWordGroup.originWords;
			});
            
			if (partOfSpeachWords.length === 0) {
				partOfSpeachWords.push(singleWordGroup);
			}
		}
        
		buttonIds.splice(randomButtonId, 1);
        
		for (var i = 0; i < buttonIds.length; i++) {
			let randomSpeachWordId = this.getRandom(partOfSpeachWords.length); 
			let randomSpeachWord = partOfSpeachWords[randomSpeachWordId];
			this.$$(buttonIds[i]).setValue(randomSpeachWord.translation);
		}
	}
    
	getRandom(max) {
		return Math.floor(Math.random() * max);
	}

	getRandomRange(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}

	allButtonValueClear() {
		this.$$("1").setValue("");
		this.$$("2").setValue("");
		this.$$("3").setValue("");
		this.$$("4").setValue("");
	}

	init() {
    
	}
}
