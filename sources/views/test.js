import {JetView} from "webix-jet";
import {wordsGroup} from "models/wordsGroup";
import {baseOfWordsCollection} from "models/baseOfWordsCollection";
import {testResultsCollection} from "models/testResult";


export default class doTest extends JetView {

	config() {
		const _ = this.app.getService("locale")._;
		
		this.groupName = "";
		this.selectedValue = "";
		this.testNumber = 0;
		this.totalResult = 0;
		this.randomWordId;
		this.randomWordGroup;
		this.buttonIndexForRemove;
		this.rightAnswerButton;
		return {
			rows: [
				{localId: "hidden:layout", rows: [
					{view: "spacer"},
					{view: "spacer"},
					{
						cols: [
							{view: "spacer"},
							{rows: [
								{view: "spacer"},
								{
									view: "label",
									localId: "richselect:label",
									label: "Please choose the group of words:",
									align: "center"
								},
								{
									view: "richselect",
									align: "center",
									width: 300,
									options: { 
										body: {
											template:"#name#", data: wordsGroup
										} 
									},
									on: {
										"onChange": () => {
											this.$$("segmented:label").show();
											this._getSegmentedView().show();
											this.getRoot().queryView({view: "richselect"}).hide();
											this.$$("richselect:label").hide();
											this.$$("start:button").show();
										}
									}
								},
							]
							},
							{view: "spacer"}
						]
					},
					{
						cols: [
							{view: "spacer"},
							{
								rows: [
									{
										view: "label",
										localId: "segmented:label",
										hidden: true,
										label: "Please choose the language for test:",
										align: "center"
									},
									{
										view:"segmented", hidden: true, width: 300,options:[
											{ id:"Russia", value:"Russia" },
											{ id:"English", value:"English"},
										],
									},
									
								]
							},
							{view: "spacer"}
						]
					},
					{},
					{
						cols: [
							{view: "spacer"},
							{
								view: "button", 
								localId: "start:button",
								hidden: true, 
								value: "Start test",
								width: 250,
								click: () => {
									this.$$("hidden:layout").hide();
									this.onAfterStartTestButtonClick();
								} 
							},
							{view: "spacer"}
						]
					}]},

				{
					cols: [
						{
							view: "label",
							align:"center",
							label: "",
							localId: "mylabel",
							css: "result_label"
						}
					]
				},
				{
					margin:30, cols: [
						{view: "spacer"},
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
								this.onAfterStartTestButtonClick();
							}
						},
						// {
						// 	view: "button",
						// 	localId: "another_group",
						// 	value: "Another group",
						// 	width: 200,
						// 	hidden: true,
						// 	// TODO
						// 	click: () => { 
						// 		this.show("/startPage/test");
						// 	}
						// },
						{view: "spacer"}
					]
				},

				{
					margin: 30,cols: [
						{view: "spacer"},
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

	onAfterStartTestButtonClick() {
		this.selectedValue = this._getSegmentedView().getValue();
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
		this.countTestNumber();

		if (!this.groupName)  {
			this.app.showError({message: "Please,select the words group"});	
			return;
		}

		if (this.countTestNumber() > 10) {
			this.showTestResult();
			this.showStartAgainButton();
			return;
		}

		if (Array.isArray(this.getSelectedGroup().words)) {
			this.allButtonValueClear();
			this.setLabelWordForQuestion(this.getSelectedGroup());

			if (this.getNeedBaseOfWords().length === 0) {
				this.getNeedBaseOfWords().push(this.randomWordGroup);
			}
			this.setButtonRightAnswer();
			this.setButtonsWrongAnswer();

		} else {
			this.allButtonHide();
			// TODO 
			// webix.alert({
			// 	title: "Close",
			// 	text: "Add more words to the group",
			// 	type:"alert-error",
			// 	callback: (result) => {
			// 		if (result) {
			// 			alert("asdad");
			// 		} 
			// 	}
			// });
			// return;
		}
	}
	
	checkRightAnswer(rightAnswerButton,clickButton) {
		if (clickButton === rightAnswerButton) {
			let clickButtonValue = this.$$(clickButton).getValue();
			if (this.selectedValue === "Russia") {
				if (this.randomWordGroup.originWords === clickButtonValue) {
					if (this.randomWordGroup.partOfSpeach === "Verb" || this.randomWordGroup.partOfSpeach === "Noun"){
						this.totalResult += 2;
					} else {
						this.totalResult++;
					}
					webix.message("You're right");
					return;
				}
			} else {
				if (this.randomWordGroup.translation === clickButtonValue) {
					if (this.randomWordGroup.partOfSpeach === "Verb" || this.randomWordGroup.partOfSpeach === "Noun"){
						this.totalResult += 2;
					} else {
						this.totalResult++;
					}
					webix.message("You're right");
					return;
				}
			}
		} else {
			webix.message({type:"error", text:"False"});
			return;
		}
	}

	setLabelWordForQuestion (selectedGroup) {
		this.randomWordId = this.getRandomRange(0, selectedGroup.words.length);
		this.randomWordGroup = selectedGroup.words[this.randomWordId];
		let randomWordfromSelectedGroup;

		if(this.selectedValue === "Russia") {
			randomWordfromSelectedGroup = this.randomWordGroup.translation;
		} else {
			randomWordfromSelectedGroup = this.randomWordGroup.originWords;
		}
		this.$$("mylabel").setValue(randomWordfromSelectedGroup);
	}

	setButtonRightAnswer() {
		let randomRightTranslateWord;
		if (this.selectedValue === "Russia") {
			randomRightTranslateWord = this.randomWordGroup.originWords;
		} else {
			randomRightTranslateWord = this.randomWordGroup.translation;
		}
		let randomIndex = this.getRandomButtonIndex();
		let randomButtonId = this.getButtonIds()[randomIndex];
		this.$$(randomButtonId).setValue(randomRightTranslateWord);
		this.rightAnswerButton = randomButtonId;
		this.buttonIndexForRemove = randomIndex;
	}

	setButtonsWrongAnswer() {
		let indexButtonForDelete = this.buttonIndexForRemove;
		let buttonIds = this.getButtonIds();

		buttonIds.splice(indexButtonForDelete,1);
		for (var i = 0; i < buttonIds.length; i++) {
			let randomSpeachWordId = this.getRandom(this.getNeedBaseOfWords().length); 
			let randomSpeachWord = this.getNeedBaseOfWords()[randomSpeachWordId];
			if (this.getNeedBaseOfWords().length === 0) {
				this.app.showError({message: "Base of words is empty.Please, add in base more words"});	
				return;
			}
			if (this.selectedValue === "Russia") {
				this.$$(buttonIds[i]).setValue(randomSpeachWord.originWords);
			} else {
				this.$$(buttonIds[i]).setValue(randomSpeachWord.translation);
			}
		}
	}

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
		this.$$("another_group").show();
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

	_getSegmentedView() {
		return this.getRoot().queryView({view: "segmented"});
	}
}
