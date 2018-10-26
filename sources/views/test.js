import {JetView} from "webix-jet";
import {wordsGroup} from "models/wordsGroup";
import {baseOfWordsCollection} from "models/baseOfWordsCollection";
import {testResultsCollection} from "models/testResult";

export default class doTest extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		
		this.groupName = "";
		this.testNumber = 0;
		this.totalResult = 0;
		this.randomWordId;
		this.randomWordGroup;
		this.buttonIndexForRemove;
		this.rightAnswerButton;
		return {
			rows: [
				{
					view: "label",
					label: _("Please choose the group of words:")
				},
				{cols: [
					{
						view: "richselect",
						options: { 
							body: {
								template:"#name#", data: wordsGroup
							} 
						},
						width: 200,
						on: {
							"onChange": () => {
								this.onAfterWordGroupSelect();
							}
						}
					},
					{view: "spacer"}
				]
				},
				{
					cols: [
						{
							view: "label",
							label: "",
							align: "center",
							localId: "mylabel",
							css: "result_label"
						}
					]
				},
                
				{
					margin:30,cols: [
						{ view:"spacer"},
						{ 
							view: "button",
							localId:"1",
							hidden: true,
							value: "",
							width: 200,
							click:() => {
								this.checkRightAnswer(this.rightAnswerButton,"1");
								this.generateTest();
							}
						},
						{ 
							view: "button",
							localId:"2",
							hidden: true,
							value: "",
							width: 200,
							click: () => {
								this.checkRightAnswer(this.rightAnswerButton,"2");
								this.generateTest();
							}},
						{
							view: "button",
							localId:"start_again",
							value: _("Start again"),
							width: 200,
							hidden: true,
							click: () => {
								this.startAgain();
							}},
						{ view: "spacer"}
					]
				},

				{
					margin: 30,cols: [
						{view:"spacer"},
						{ 
							view: "button",
							localId:"3",
							hidden: true,
							value: "",
							width: 200,
							click:() => {
								this.checkRightAnswer(this.rightAnswerButton,"3");
								this.generateTest();
							}},
						{ 
							view: "button",
							localId:"4",
							hidden: true,
							value: "",
							width: 200,
							click:() => {
								this.checkRightAnswer(this.rightAnswerButton,"4");
								this.generateTest();
							}},
						{view: "spacer"}
					]
				},
				{view: "spacer"}
			]
           
		};   
        
	}
    
	countTestNumber() {
		return this.testNumber++; 
	}

	onAfterWordGroupSelect() {
		this.groupName = this.getRoot().queryView({view: "richselect"}).getText();
		this.hideStartAgainButton();
		this.testNumber = 0;
		this.allButtonShow();
		this.generateTest();
	}
	
	startAgain() {
		this.hideStartAgainButton();
		this.testNumber = 0;
		this.generateTest();
		if (!this.testNumber) return;
		this.allButtonShow();
	}

	showTestResult() {
		const _ = this.app.getService("locale")._;
		this.allButtonHide();
		this.$$("mylabel").setValue(_("Your result:") + this.totalResult);
		testResultsCollection.add({"result": this.totalResult,"groupName": this.groupName});
		this.testNumber = 0;
		this.totalResult = 0;
	}

	generateTest() {
		if (!this.groupName)  {
			webix.message({type:"error", text:"Please,select the words group"});
			return;
		}

		this.countTestNumber();
        
		if (this.countTestNumber() > 5) {
			this.showTestResult();
			this.showStartAgainButton();
			return;
		}

		if (Array.isArray(this.getSelectedGroup().words)) {
			this.allButtonValueClear();
			this.setLabelWordForQuestion(this.getSelectedGroup());

			// if in base words collection isn't part of speach === part of speach set in label
			// TODO error popup
			if (this.getNeedBaseOfWords().length === 0) {
				this.getNeedBaseOfWords().push(this.randomWordGroup);
			}
			this.setButtonRightAnswer();

		} else {
			this.allButtonHide();
			// TODO create error popup	
			webix.message({type:"error", text:"Please,add more than one word in this group"});
			return;
		}
		this.setButtonWrongAnswer();
	}
	
	checkRightAnswer(rightAnswerButton,clickButton) {
		if (clickButton === rightAnswerButton) {
			let clickButtonValue = this.$$(clickButton).getValue();
			if (!this.randomWordGroup) {
				if (this.singleWordGroup.translation === clickButtonValue) {
					if (this.singleWordGroup.partOfSpeach === "Verb" || this.singleWordGroup.partOfSpeach === "Noun"){
						this.totalResult += 2;
					} else {
						this.totalResult++;
					}
					webix.message("You're right");
					return;
				} else {
					webix.message({type:"error", text:"False"});
					return;
				}
			}
			if (this.randomWordGroup.translation === clickButtonValue) {
				if (this.randomWordGroup.partOfSpeach === "Verb" || this.randomWordGroup.partOfSpeach === "Noun"){
					this.totalResult += 2;
				} else {
					this.totalResult++;
				}
			}
			webix.message("You're right");
		} else {
			webix.message({type:"error", text:"False"});
		}
	}

	setLabelWordForQuestion (selectedGroup) {
		this.randomWordId = this.getRandomRange(0, selectedGroup.words.length);
		this.randomWordGroup = selectedGroup.words[this.randomWordId];
            
		let randomWordfromSelectedGroup = this.randomWordGroup.originWords;
		this.$$("mylabel").setValue(randomWordfromSelectedGroup);
	}

	setButtonRightAnswer() {
		let randomRightTranslateWord = this.randomWordGroup.translation;
		let randomIndex = this.getRandomButtonIndex();
		let randomButtonId = this.getButtonIds()[randomIndex];
		this.$$(randomButtonId).setValue(randomRightTranslateWord);
		this.rightAnswerButton = randomButtonId;
		this.buttonIndexForRemove = randomIndex;
	}

	setButtonWrongAnswer() {
		let indexButtonForDelete = this.buttonIndexForRemove;
		let buttonIds = this.getButtonIds();

		buttonIds.splice(indexButtonForDelete,1);
		for (var i = 0; i < buttonIds.length; i++) {
			let randomSpeachWordId = this.getRandom(this.getNeedBaseOfWords().length); 
			let randomSpeachWord = this.getNeedBaseOfWords()[randomSpeachWordId];
			if(this.getNeedBaseOfWords().length === 0) {
				// TODO text webix.message
				webix.message({type:"error", text:"Base of words is empty.Please, add in base of words more words"});
				return;
			}
			this.$$(buttonIds[i]).setValue(randomSpeachWord.translation);
		}
	}

	// return array of words which part of speach === ppart of spach question word
	getNeedBaseOfWords() {
		let partOfSpeachWords = baseOfWordsCollection.find(obj => {
			return obj.partOfSpeach === this.randomWordGroup.partOfSpeach 
				&& obj.translation !== 	this.randomWordGroup.translation 
				&& obj.originWords !== 	this.randomWordGroup.originWords;
		});
		return partOfSpeachWords;
	}

	getSelectedGroup() {
		return wordsGroup.find(obj => obj.name === this.groupName, true);
	}

	getButtonIds() {
		let buttonIds = ["1", "2", "3", "4"];
		return buttonIds;
	}

	getRandomButtonIndex() {
		let randomButtonId = this.getRandomRange(0, this.getButtonIds().length - 1);
		return randomButtonId;
	}
    
	getRandom(max) {
		return Math.floor(Math.random() * max);
	}

	getRandomRange(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}

	showStartAgainButton() {
		this.$$("start_again").show();
	}

	hideStartAgainButton() {
		this.$$("start_again").hide();
	}

	allButtonValueClear() {
		this.$$("1").setValue("");
		this.$$("2").setValue("");
		this.$$("3").setValue("");
		this.$$("4").setValue("");
	}
    
	allButtonHide() {
		this.$$("1").hide();
		this.$$("2").hide();
		this.$$("3").hide();
		this.$$("4").hide();
	}

	allButtonShow() {
		this.$$("1").show();
		this.$$("2").show();
		this.$$("3").show();
		this.$$("4").show();
	}
}
