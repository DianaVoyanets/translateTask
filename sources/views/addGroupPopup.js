import {JetView} from "webix-jet";
import {baseOfWordsCollection} from "models/baseOfWordsCollection";
import {wordsGroup} from "models/wordsGroup";

export default class addGroupPopupView extends JetView{
	config() {
		var form = {
				view:"form",
				localId: "form",
				width: 600,
				gravity: 0.2,
				elements: [
					{view: "text",labelWidth: 120,label: "Name of group:",name: "name"},
					{view:"datepicker",labelWidth: 120,label: "Date of creation:",value: new Date(),name: "dateOfCreation"},
				],
			}

		var datatable = {
			view: "datatable",
			localId: "mydatatable",
			select:true,
			multiselect:true,
			width: 600,
			columns: [
				{id: "originWords",header: "Origin word"},
				{id: "translation",header: "Translation"},
				{id: "partOfSpeach",header: "Part of speach"},      
			],
		}
		
		return {
			view:"window", 
			height: 500,
			move:true,
			localId: "formPopup",
			head:"Add group of words",
			position:"center",
			body:{
				rows: [
					form,
					datatable,
					{cols:[
						{view: "spacer"},
						{view: "button",value: "Add",width: 120,click: () => {
							let group = this.$$("form").getValues();
							group.wordsIds = this.$$("mydatatable").getSelectedItem();
							if (group.hasOwnProperty("id")) {
								wordsGroup.updateItem(group.id, group);
							}
							else{
								wordsGroup.add(group);
							}
							this.$$("formPopup").hide();
							this.$$("form").clear();
							
						}},
						{view: "button",value: "Cancel",width: 120,click: () => this.$$("formPopup").hide()},
					]}  
				]
				
			}
		}

	}
	
	showWindow(id) {
		this.getRoot().show();
	}
	
	init() {
		this.$$("mydatatable").sync(baseOfWordsCollection);
	}
}
