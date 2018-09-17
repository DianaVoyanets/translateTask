import {JetView} from "webix-jet";

export default class wordsAddForm extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			view: "form",
			margin:20,
			elements:[
				{view:"combo", name: "origin",labelWidth: 110,label:_("Oringin word:") },
				{view:"combo",name: "translation", labelWidth: 110,label:_("Translation:") },
				{view: "combo",name: "partOfSpeech",labelWidth: 110,label: _("Part of speech:")},
				{cols:[
					{ view:"button", value:_("Add new word")},
					{ view:"button", value:_("ClearAll")},
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