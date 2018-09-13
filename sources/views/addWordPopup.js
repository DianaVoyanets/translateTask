import {JetView} from "webix-jet";
import {baseOfWordsCollection} from "models/baseOfWordsCollection";
import {wordsGroup} from "models/wordsGroup";

export default class addWordsPopupView extends JetView{
	config() {	
        
		return  {
			view:"window", 
			width: 500,
			height: 400,
			scroll: false,
			modal: true,
			move:true,
			localId: "formPopup",
			head:"Edit group of words",
			position:"center",
			body:{
				view: "form",
				localId: "myform",
				elements: [
					{view: "text",labelWidth: 120,label: "Name of group:",name: "name"},
					{view: "datatable",id:"mydatatable",select:"row",multiselect: true,width:500,scrollY:false,
						columns: [
							{id: "originWords",header: "Origin word",width: 150},
							{id: "translation",header: "Translation"},
							{id: "partOfSpeach",header: "Part of speach",width: 150},    
						],
					},
					{cols:[
						{view: "spacer"},
						{view: "button",value: "Add",width: 120,click: () => {
							let group = this.$$("myform").getValues();
							group.wordsIds = this.$$("mydatatable").getSelectedItem();
							wordsGroup.updateItem(group.id,group);
							this.$$("formPopup").hide();
						}},
                        
						{view: "button",value: "Cancel",width: 120,click: () => {
							this.$$("formPopup").hide();
						}}
					]}  
				]
				
			}
		};
	}
	
	showWindow(words,item) {
		this.$$("mydatatable").unselectAll();
		if (!words) {
			this.$$("myform").setValues(item);
			this.getRoot().show();
			return;
		}
        
		this.$$("myform").setValues(item);
		this.$$("mydatatable").filter((item) => words.find(i => i.id === item.id) == undefined);
		this.getRoot().show();
	}	
	
	init() {
		this.$$("mydatatable").sync(baseOfWordsCollection);
	}
}
