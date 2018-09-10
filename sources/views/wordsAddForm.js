import {JetView} from "webix-jet";

export default class wordsAddForm extends JetView {
	config() {
		return {
			view: "form",
			margin:20,
			elements:[
				{view:"combo", name: "origin",labelWidth: 110,label:"Oringin word:" },
				{view:"combo",name: "translation", labelWidth: 110,label:"Translation:" },
				{view: "combo",name: "partOfSpeech",labelWidth: 110,label: "Part of speech:"},
				{cols:[
					{ view:"button", value:"Add new word"},
					{ view:"button", value:"ClearAll"},
				]},
				{view: "spacer"}
			]
		};
	}

	addData() {
 
	}

	init() {

	}
}