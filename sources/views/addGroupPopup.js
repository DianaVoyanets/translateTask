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
			select:"row",
			multiselect:true,
			width: 600,
			columns: [
				{id: "originWords",header: "Origin word"},
				{id: "translation",header: "Translation"},
				{id: "partOfSpeach",header: "Part of speach"},
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
					// "fa-pencil": (e,id) => {
					// 	this._jetPopup.showWindow(id);
					// }
				},
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
							// var data = this.$$("form").getValues();
							// wordsGroup.add(data);
							// data.wordsIds = [];
							// for(var i = 0;i < this.$$("mydatatable").getSelectedItem().length;i++) {
							// 	data.wordsIds.push(this.$$("mydatatable").getSelectedItem()[i].id);
							// }
							// console.log(data);
							let group = this.$$("form").getValues();
							group.wordsIds = this.$$("mydatatable").getSelectedItem();
							if(group.hasOwnProperty("id")){
								wordsGroup.updateItem(group.id, group);
							}
							else{
								wordsGroup.add(group);
							}

							this.$$("form").clear();
							this.$$("formPopup").hide();
							
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
	// saveData() {
		
	// }

	// hide() {
	// 	return this.$$("formPopup").hide();
	// }
}
