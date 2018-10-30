import {JetView} from "webix-jet";
import {wordsGroup} from "models/wordsGroup";
import {baseOfWordsCollection} from "models/baseOfWordsCollection";
import {testResultsCollection} from "models/testResult";


export default class doTest extends JetView {

	config() {
		// const _ = this.app.getService("locale")._;
		
		this.groupName = "";
		this.selectedValue = "";
		this.testNumber = 0;
		this.totalResult = 0;
		this.randomWordId;
		this.randomWordGroup;
		this.buttonIndexForRemove;
		this.rightAnswerButton;
        
		let richSelectView = {
			rows: [
				{
					view: "richselect",
					localId: "group:richselect",
					label: "Please select a group of words:",
					labelPosition: "top",
					align: "center",
					width: 300,
					options: { 
						body: {
							template:"#name#", data: wordsGroup
						} 
					},
					on: {
						"onChange": (selectedGroup) => {
							if(!selectedGroup) return;
							let countWordsInGroup = wordsGroup.getItem(selectedGroup).words.length;
							if (!countWordsInGroup) {
								this.app.showError({message: "Please add more words to the group" });
								return;
							}
							this.$$("group:richselect").hide();
							this.$$("segmented:layout").show();
						}
					}
				},
			]
		};

        
		let segmentedView = {
			rows: [{
				hidden: true,
				localId: "segmented:layout",
				rows: [
					{
						view:"segmented",
						label: "Please select language to pass the test:",
						labelPosition: "top",  
						width: 300,
						options:[
							{ id:"Russia", value:"Russia" },
							{ id:"English", value:"English"},
						],
					},
					{view: "spacer", height: 30},
					{
						cols: [
							{view: "spacer"},
							{
								view: "button",
								localId: "start:test",
								value: "Start test",
								width: 200,
								click: () => {
									this.$$("segmented:layout").hide();
									this.onAfterStartTestButtonClick();
								}
							},
							{view: "spacer"}
						]
					}  
				]
			}      
			]
		};
        
		let resultLayout = {
			rows: [
				{
					cols: [
						{view: "spacer"},
						{
							view: "label",
							localId: "test:result",
							css: "test_result_style",
							width: 200,
							align: "center",
							label: ""
						},
						{view: "spacer"},
					]
				},
				{view: "spacer", height: 50},
				{
					cols: [
						{view: "spacer"},
						{
							view: "button",
							localId: "start:again",
							hidden: true,
							width: 200,
							value: "Start again",
							click: () => {
								this.$$("test:result").hide();
								this.$$("start:again").hide();
								this.$$("group:richselect").setValue("");
								this.$$("group:richselect").show();
							}
						},
						{view: "spacer"},
					]
				}
			]
		};

		let wordsForTestView = {
			rows: [
				{
					localId: "button:test:words",
					hidden: true,
					rows: [
						{
							cols: [
								{view: "spacer"},
								{
									view: "label",
									align: "center",
									label: "",
									localId: "word:to:translate:label",
									css: "word_to_translate_label_style"
								},
								{view: "spacer"}
							]
						},
						{ margin: 20,cols: [
							{ 
								view: "button",
								localId:"1",
								value: "",
								width: 200,
								click:() => {
									this.checkRightAnswer(this.rightAnswerButton,"1");
									this.generateTest();
								}},
							{ 
								view: "button",
								localId:"3",
								value: "",
								width: 200,
								click:() => {
									this.checkRightAnswer(this.rightAnswerButton,"3");
									this.generateTest();
								}},    
						]
						}, 
						{
							rows: [
								{
									margin: 20,
									cols: [
										{ 
											view: "button",
											localId:"2",
											value: "",
											width: 200,
											click:() => {
												this.checkRightAnswer(this.rightAnswerButton,"2");
												this.generateTest();
											}},
										{ 
											view: "button",
											localId:"4",
											value: "",
											width: 200,
											click:() => {
												this.checkRightAnswer(this.rightAnswerButton,"4");
												this.generateTest();
											}
										},
									]},
							]
						},	
					]
				}
			]
            
		};
        
		return {
			rows: [
				{view: "spacer",height: 100},
				{
					cols: [
						{view: "spacer"},
						richSelectView,
						{view: "spacer"}
					]
				},
				{
					cols: [
						{view: "spacer"},
						segmentedView,
						{view: "spacer"}
					]
				},
				{
					cols: [
						{view: "spacer"},
						wordsForTestView,
						{view: "spacer"}
					]  
				},
				resultLayout,
				{view: "spacer"},
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
		this.$$("test:result").setValue(_("Your result:") + this.totalResult);
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

	setLabelWordForQuestion(selectedGroup) {
		this.randomWordId = this.getRandomRange(0, selectedGroup.words.length);
		this.randomWordGroup = selectedGroup.words[this.randomWordId];
		let randomWordfromSelectedGroup;

		if(this.selectedValue === "Russia") {
			randomWordfromSelectedGroup = this.randomWordGroup.translation;
		} else {
			randomWordfromSelectedGroup = this.randomWordGroup.originWords;
		}
		this.$$("word:to:translate:label").setValue(randomWordfromSelectedGroup);
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
		if (this.getNeedBaseOfWords().length === 0) {
			this.app.showError({message: "Base of words is empty. Please, add in base more words"});	
			return;
		}
        
		let indexButtonForDelete = this.buttonIndexForRemove;
		let buttonIds = this.getButtonIds();
        
		let baseWords = this.generateAnswers(buttonIds.length);

		buttonIds.splice(indexButtonForDelete, 1);
		for (var i = 0; i < buttonIds.length; i++) { 
			let randomSpeachWord = baseWords[i];
            
			if (this.selectedValue === "Russia") {
				this.$$(buttonIds[i]).setValue(randomSpeachWord.originWords);
			} else {
				this.$$(buttonIds[i]).setValue(randomSpeachWord.translation);
			}
		}
	}
    
	generateAnswers(count) {
		let answers = [];
		let baseWords = this.getNeedBaseOfWords();
        
		if (baseWords.length < 4) {
			for (let i = 0; i < count; i++) {
				answers[i] = this.getRandom(baseWords.length);
			}
		} else {
			let prevRandom;
			for (let i = 0; i < count; i++) {
				let newRandom;
                
				do {
					newRandom = this.getRandom(baseWords.length);
				} while (prevRandom === newRandom);

				prevRandom = newRandom;
				answers[i] = baseWords[newRandom];
			}
		}
        
		return answers;
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
		this.$$("test:result").show();
		this.$$("start:again").show();
	}

	hideStartAgainButton() {
		this.$$("start:again").hide();
	}

	allButtonValueClear() {
		this.$$("1").setValue("");
		this.$$("2").setValue("");
		this.$$("3").setValue("");
		this.$$("4").setValue("");
	}
    
	allButtonHide() {
		this.$$("button:test:words").hide();
	}

	allButtonShow() {
		this.$$("button:test:words").show();
	}

	_getSegmentedView() {
		return this.getRoot().queryView({view: "segmented"});
	}
}
