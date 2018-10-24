import {JetView} from "webix-jet";
import {baseOfWordsCollection} from "models/baseOfWordsCollection";
import {partOfSpech} from "models/partOfSpeachCollection";


export default class BaseOfWords extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		
		var baseOfWords = {
			view: "datatable",
			localId: "mydatatable",
			columns: [
				{id: "originWords",header: _("Origin word")},
				{id: "translation",header: _("Translation")},
				{id: "partOfSpeach",header: _("Part of speech"),width:150},         
			],
		};

		var form  = {
			view: "form",
			localId: "myform",
			width: 400,
			margin:20,
			select: true,
			elements:[
				{view:"text", name: "originWords",labelWidth: 130,label:_("Origin word:") },
				{view:"text",name:  "translation", labelWidth: 130,label:_("Translation:") },
				{view: "combo",name: "partOfSpeach",labelWidth: 130,options: {data:partOfSpech},label: _("Part of speech:")},
                
				{cols:[
					{ view:"button", localId:"add_button",value:_("Add"),
						click:  () => {
							this.addData();
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

	init() {
		this.$$("mydatatable").sync(baseOfWordsCollection);
	}}