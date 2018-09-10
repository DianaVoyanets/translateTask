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
						{view: "spacer"},
						{view:"button",localId:"export_to_excel",label:"Export to Excel",width: 120}
					]
				},
				{
					view: "datatable",
					localId: "datatable",
					columns: [
						{id: "originWords",header: "Origin word"},
						{id: "translation",header: "Translation"},
						{id: "partOfSpeach",header: "Part of speech"},
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
	init() {
		this.on(this.app,"listSelected",(data) => {
			if(data) {
				this.$$("datatable").parse(data);
			}
		})
	}
}
        
