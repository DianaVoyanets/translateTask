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
		this.randomWordForQuestion;
		this.buttonIndexForRemove;
		this.rightAnswerButton;
        
		let richSelectView = {
			rows: [
				{
					view: "richselect",
					localId: "group:richselect",
					label: _("Please select a group of words:"),
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
								this.app.showError({message: _("Please add more words to the group")});
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
						label: _("Please select language to pass the test:"),
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
								value: _("Start test"),
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
							localId: "test:result:label",
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
							value: _("Start again"),
							click: () => {
								this.$$("test:result:label").hide();
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
								}
							},
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
												this.generateTest();}
										},
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
		this.$$("test:result:label").setValue(_("Your result:") + this.totalResult);
		testResultsCollection.add({"result": this.totalResult,"groupName": this.groupName});
		this.testNumber = 0;
		this.totalResult = 0;
	}

	generateTest() {
		this.countTestNumber();
		const _ = this.app.getService("locale")._;
		
		if (!this.groupName)  {
			this.app.showError({message: _("Please,select the words group")});	
			return;
		}

		if (this.countTestNumber() > 10) {
			this.showTestResult();
			this.showStartAgainButton();
			return;
		}

		let selectedGroupWords = webix.copy(this.getSelectedGroup().words);

		if (Array.isArray(this.getSelectedGroup().words)) {
			this.allButtonRefresh();
			this.allButtonValueClear();
   
			this.setLabelWordForQuestion(selectedGroupWords);

			if (this.getNeedBaseOfWords().length === 0) {
				this.getNeedBaseOfWords().push(this.randomWordForQuestion);
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
				if (this.randomWordForQuestion.originWords === clickButtonValue) {
					if (this.randomWordForQuestion.partOfSpeach === "Verb" || this.randomWordForQuestion.partOfSpeach === "Noun"){
						this.totalResult += 2;
					} else {
						this.totalResult++;
					}
					webix.message("You're right");
					return;
				}
			} else {
				if (this.randomWordForQuestion.translation === clickButtonValue) {
					if (this.randomWordForQuestion.partOfSpeach === "Verb" || this.randomWordForQuestion.partOfSpeach === "Noun"){
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

	setLabelWordForQuestion(selectedGroupWords) {
		this.randomWordId = this.getRandomRange(0,selectedGroupWords.length);

	
		this.randomWordForQuestion = selectedGroupWords[this.randomWordId];
		selectedGroupWords.splice(selectedGroupWords[this.randomWordId],1);


		let randomWordfromSelectedGroup;

		if(this.selectedValue === "Russia") {
			randomWordfromSelectedGroup = this.randomWordForQuestion.translation;
		} else {
			randomWordfromSelectedGroup = this.randomWordForQuestion.originWords;
		}
		this.$$("word:to:translate:label").setValue(randomWordfromSelectedGroup);
	}

	setButtonRightAnswer() {
		let randomRightTranslateWord;
		if (this.selectedValue === "Russia") {
			randomRightTranslateWord = this.randomWordForQuestion.originWords;
		} else {
			randomRightTranslateWord = this.randomWordForQuestion.translation;
		}
		let randomIndex = this.getRandomButtonIndex();
		let randomButtonId = this.getButtonIds()[randomIndex];

		this.$$(randomButtonId).setValue(randomRightTranslateWord);
		this.rightAnswerButton = randomButtonId;
		this.buttonIndexForRemove = randomIndex;
	}

	setButtonsWrongAnswer() {
		const _ = this.app.getService("locale")._;

		if (this.getNeedBaseOfWords().length === 0) {
			this.app.showError({message: _("Base of words is empty. Please, add in base more words")});	
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
			return obj.partOfSpeach === this.randomWordForQuestion.partOfSpeach 
				&& obj.translation !== 	this.randomWordForQuestion.translation 
				&& obj.originWords !== 	this.randomWordForQuestion.originWords;
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
		this.$$("test:result:label").show();
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

	allButtonRefresh() {
		this.$$("1").refresh();
		this.$$("2").refresh();
		this.$$("3").refresh();
		this.$$("4").refresh();
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
