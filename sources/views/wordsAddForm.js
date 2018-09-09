import {JetView} from "webix-jet";

export default class wordsAddForm extends JetView {
	config() {
		return {
			view: "form",
			margin:20,
			elements:[
				{view:"text", name: "origin",labelWidth: 110,label:"Oringin word:" },
				{view:"text",name: "translation", labelWidth: 110,label:"Translation:" },
				{view: "text",name: "partOfSpeech",labelWidth: 110,label: "Part of speech:"},
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