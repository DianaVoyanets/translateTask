import {JetView} from "webix-jet";

export default class wordsDatatable extends JetView {
	config() {
		var wordsDatatable = {
			rows: [
				{
					view:"toolbar",
					localId:"myToolbar",
					cols:[
						{view: "spacer"},
						{ view:"button",localId:"export_to_excel",label:"Export to XLSX"}
					]
				},
				{
					view: "datatable",
					columns: [
						{id: "origin",header: "Origin word"},
						{id: "translation",header: "Translation"},
						{id: "partOfSpeech",header: "Part of speech"},
						{id: "pencil-icon", header:"",template: "{common.editIcon()}",width:50},
				        {id: "trash-icon", header: "",template: "{common.trashIcon()}",width:50},
					]
				}
			]
		};
		return {
			rows: [wordsDatatable]
		};
	}
}
        
