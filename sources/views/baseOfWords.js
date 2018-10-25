import {JetView} from "webix-jet";
import {baseOfWordsCollection} from "models/baseOfWordsCollection";
import {partOfSpech} from "models/partOfSpeachCollection";


export default class BaseOfWords extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		
		var baseOfWordsDatatable = {
			view: "datatable",
			columns: [
				{id: "originWords",header: _("Origin word")},
				{id: "translation",header: _("Translation")},
				{id: "partOfSpeach",header: _("Part of speech"),width:150},         
			],
		};

		var addNewWordsForm  = {
			view: "form",
			width: 400,
			margin: 20,
			select: true,
			elements:[
				{view:"text", name: "originWords",labelWidth: 130,label:_("Origin word:") },
				{view:"text",name:  "translation", labelWidth: 130,label:_("Translation:") },
				{view: "combo",name: "partOfSpeach",labelWidth: 130,options: {data:partOfSpech},label: _("Part of speech:")},   
				{cols:[
					{ 	
						view:"button", 
						value:_("Add"),
						click:  () => {
							this.addNewWords();
						}},
				]},
				{view: "spacer"}
			]
		};
    
		return {
			cols: [baseOfWordsDatatable,addNewWordsForm]
		};
	}

	addNewWords() {
		var valuesFromForm = this.getForm().getValues();
		baseOfWordsCollection.add(valuesFromForm);
		this.getForm().clear();
	}

	getForm() {
		return this.getRoot().queryView({view: "form"});
	}

	init() {
		this.getRoot().queryView({view: "datatable"}).sync(baseOfWordsCollection);
	}

}