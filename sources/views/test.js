import {JetView} from "webix-jet";
import {wordsGroup} from "models/wordsGroup";
import {baseOfWordsCollection} from "models/baseOfWordsCollection";
import {testResultsCollection} from "models/testResult";

export default class doTest extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		
		this.groupName = "";
		this.buttonClick = null;
		this.randomButton;
		this.testNumber = 0;
		this.result = 0;
		return {
			rows: [
				{
					view: "label",
					label: _("Please choose the group of words:")
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
								this.$$("start_again").hide();
								this.testNumber = 0;
								this.allButtonShow();
								this.generateTest();
							}
						}
					},
					{view: "spacer"}
				]
				},
				{
					cols: [
						{view: "label",label: "",align: "center",localId: "mylabel",css: "result_label"}
					]
				},
                
				{
					margin:30,cols: [
						{ view:"spacer"},
						{ view: "button",localId:"1",hidden: true,value: "",width: 200,click:() => {
							this.checkRightAnswer(this.randomButton,"1");
							this.generateTest();
						}},
						{ view: "button",localId:"2",hidden: true,value: "",width: 200,click: () => {
							this.checkRightAnswer(this.randomButton,"2");
							this.generateTest();
						}},
						{view: "button",localId:"start_again",value: _("Start again"),width: 200,hidden: true,click: () =>{
							this.$$("start_again").hide();
							this.testNumber = 0;
							this.generateTest();
							if (!this.testNumber) return;
							this.allButtonShow();
						}},
						{ view: "spacer"}
					]
				},

				{
					margin: 30,cols: [
						{ view:"spacer"},
						{ view: "button",localId:"3",hidden: true,value: "",width: 200,click:()=> {
							this.checkRightAnswer(this.randomButton,"3");
							this.generateTest();
						}},
						{ view: "button",localId:"4",hidden: true,value: "",width: 200,click:()=> {
							this.checkRightAnswer(this.randomButton,"4");
							this.generateTest();
						}},
						{ view: "spacer"}
					]
				},
				{view: "spacer"}
			]
           
		};   
        
	}
    
	countTestNumber() {
		return this.testNumber++; 
	}
    
	doAfterTest() {
		const _ = this.app.getService("locale")._;
		this.allButtonHide();
		this.$$("mylabel").setValue(_("Your result:") + this.result);
		testResultsCollection.add({"result": this.result,"groupName": this.groupName});
		this.testNumber = 0;
		this.result = 0;
		this.$$("start_again").show();
	}

	generateTest() {
		if (!this.groupName)  {
			webix.message({type:"error", text:"Please,select the words group"});
			return;
		}

		this.countTestNumber();
        
		if (this.countTestNumber() > 5) {
			this.doAfterTest();
			return;
		}

		this.allButtonValueClear();

		let selectedGroup = wordsGroup.find(obj => obj.name === this.groupName, true);
        
		let buttonIds = ["1", "2", "3", "4"];
		let randomButtonId = this.getRandomRange(0, buttonIds.length - 1);
		this.randomButton = buttonIds[randomButtonId];
        
		let randomWordId;
		let partOfSpeachWords;
		this.randomWordGroup;

		if (Array.isArray(selectedGroup.wordsIds)) {
			randomWordId = this.getRandomRange(0, selectedGroup.wordsIds.length);
			this.randomWordGroup = selectedGroup.wordsIds[randomWordId];
            
			let randomWordfromSelectedGroup = this.randomWordGroup.originWords;
			this.$$("mylabel").setValue(randomWordfromSelectedGroup);

			partOfSpeachWords = baseOfWordsCollection.find(obj => {
				return obj.partOfSpeach === this.randomWordGroup.partOfSpeach 
                    && obj.translation !== 	this.randomWordGroup.translation 
                    && obj.originWords !== 	this.randomWordGroup.originWords;
			});
            
			if (partOfSpeachWords.length === 0) {
				partOfSpeachWords.push(this.randomWordGroup);
			}

			let randomRightTranslateWord = this.randomWordGroup.translation;
			this.$$(this.randomButton).setValue(randomRightTranslateWord);

		} else {
			this.singleWordGroup = selectedGroup.wordsIds;

			this.$$("mylabel").setValue(this.singleWordGroup.originWords);
			this.$$(this.randomButton).setValue(this.singleWordGroup.translation);

			partOfSpeachWords = baseOfWordsCollection.find(obj => {
				return obj.partOfSpeach === this.singleWordGroup.partOfSpeach 
                    && obj.translation !== this.singleWordGroup.translation 
                    && obj.originWords !== this.singleWordGroup.originWords;
			});
            
			if (partOfSpeachWords.length === 0) {
				partOfSpeachWords.push(this.singleWordGroup);
			}

		}
        
		buttonIds.splice(randomButtonId, 1);
        
		for (var i = 0; i < buttonIds.length; i++) {
			let randomSpeachWordId = this.getRandom(partOfSpeachWords.length); 
			let randomSpeachWord = partOfSpeachWords[randomSpeachWordId];
			this.$$(buttonIds[i]).setValue(randomSpeachWord.translation);
		}
	}
    
	checkRightAnswer(clickButton,rightAnswerButton) {
		if (clickButton === rightAnswerButton) {
			let clickButtonValue = this.$$(clickButton).getValue();
			if (!this.randomWordGroup) {
				if (this.singleWordGroup.translation === clickButtonValue) {
					if (this.singleWordGroup.partOfSpeach === "Verb" || this.singleWordGroup.partOfSpeach === "Noun"){
						this.result+=2;
					} else {
						this.result++;
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
					this.result+=2;
				} else {
					this.result++;
				}
			}
			webix.message("You're right");
		} else {
			webix.message({type:"error", text:"False"});
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
