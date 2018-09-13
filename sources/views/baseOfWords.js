import {JetView} from "webix-jet";
import {baseOfWordsCollection} from "models/baseOfWordsCollection";
export default class BaseOfWords extends JetView {
	config() {
		var baseOfWords = {
			view: "datatable",
			localId: "mydatatable",
			columns: [
				{id: "originWords",header: "Origin word"},
				{id: "translation",header: "Translation"},
				{id: "partOfSpeach",header: "Part of speach",width:150},
				{id: "pencil-icon", header:"",template: "{common.editIcon()}",width:50},
				{id: "trash-icon", header: "",template: "{common.trashIcon()}",width:50},            
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
		};

		var form  = {
			view: "form",
			localId: "myform",
			width: 400,
			margin:20,
			elements:[
				{view:"text", name: "originWords",labelWidth: 110,label:"Oringin word:" },
				{view:"text",name:  "translation", labelWidth: 110,label:"Translation:" },
				{view: "combo",name: "partOfSpeach",labelWidth: 110,label: "Part of speech:"},
                
				{cols:[
					{ view:"button", value:"Add new word",
						click:  (id) => {
							var data = this.$$("myform").getValues();
							baseOfWordsCollection.add(data);
							this.$$("myform").clear();
						}},
				]},
				{view: "spacer"}
			]
		};
    
		return {
			cols: [baseOfWords,form]
		};
	}

	init() {
		this.$$("mydatatable").sync(baseOfWordsCollection);
	}}