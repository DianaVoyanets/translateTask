import {JetView} from "webix-jet";
import {baseOfWordsCollection} from "models/baseOfWordsCollection";
import {partOfSpech} from "models/partOfSpeachCollection";
import {wordsGroup} from "models/wordsGroup";

export default class BaseOfWords extends JetView {
	config() {
		var baseOfWords = {
			view: "datatable",
			localId: "mydatatable",
			select: true,
			columns: [
				{id: "originWords",header: "Origin word"},
				{id: "translation",header: "Translation"},
				{id: "partOfSpeach",header: "Part of speach",width:150},         
			],
			onClick: {
				"fa-trash": function(e, id) {
					webix.confirm({
						text:"Do you still want to remove field?",
						callback: (result) => {
							if(result) {
								baseOfWordsCollection.remove(id);
								return false;
							}
						}
					});
				},
			},
			on: {
				onAfterSelect: (id)=>{
					let values = this.$$("mydatatable").getItem(id);
					this.$$("myform").setValues(values);
					this.$$("add_button").hide();
					this.$$("save_button").show();
				}
			}

		};

		var form  = {
			view: "form",
			localId: "myform",
			width: 400,
			margin:20,
			elements:[
				{view:"text", name: "originWords",labelWidth: 110,label:"Oringin word:" },
				{view:"text",name:  "translation", labelWidth: 110,label:"Translation:" },
				{view: "combo",name: "partOfSpeach",labelWidth: 110,options: {data:partOfSpech},label: "Part of speech:"},
                
				{cols:[
					{ view:"button", localId:"add_button",value:"Add",
						click:  (id) => {
							this.addData();
					}},
					{ view:"button", hidden: true,localId:"save_button",value:"Save",
						click:  (id) => {
							this.saveData();
					}},
				]},
				{view: "spacer"}
			]
		};
    
		return {
			cols: [baseOfWords,form]
		};
	}

	addData() {
		var data = this.$$("myform").getValues();
		baseOfWordsCollection.add(data);
		this.$$("myform").clear();
	}

	saveData() {
		let value = this.$$("myform").getValues();
		baseOfWordsCollection.updateItem(value.id,value);
		this.$$("myform").clear();
		this.$$("save_button").hide();
		this.$$("add_button").show();
	}

	init() {
		this.$$("mydatatable").sync(baseOfWordsCollection);
		this.$$("add_button").show();
	}}