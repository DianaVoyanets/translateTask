import {JetView} from "webix-jet";
import {baseOfWordsCollection} from "models/baseOfWordsCollection";
import {wordsGroup} from "models/wordsGroup";

export default class addWordsPopupView extends JetView{
	config() {	
		const _ = this.app.getService("locale")._;
        
		return  {
			view:"window", 
			width: 500,
			height: 400,
			scroll: false,
			modal: true,
			move:true,
			localId: "formPopup",
			head:_("Edit group of words"),
			position:"center",
			body:{
				view: "form",
				localId: "myform",
				elements: [
					{view: "text",labelWidth: 120,label: _("Name of group:"),name: "name"},
					{view: "datatable",id:"mydatatable",select:"row",multiselect: true,width:500,scrollY:false,
						columns: [
							{id: "originWords",header: _("Origin word"),width: 150},
							{id: "translation",header: _("Translation")},
							{id: "partOfSpeach",header: _("Part of speech"),width: 150},    
						],
					},
					{cols:[
						{view: "spacer"},
						{view: "button",value: _("Add"),width: 120,click: () => {
							let group = this.$$("myform").getValues();
							group.wordsIds = this.$$("mydatatable").getSelectedItem();
							wordsGroup.updateItem(group.id,group);
							this.$$("formPopup").hide();
							this.$$("myform").clear();
							this.$$("mydatatable").unselectAll();
						}},
                        
						{view: "button",value: _("Cancel"),width: 120,click: () => {
							this.$$("formPopup").hide();
							this.$$("myform").clear();
							this.$$("mydatatable").unselectAll();
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
		if(Array.isArray(words)) {
			for(var i = 0; i < words.length;i++) {
				this.$$("mydatatable").select(words[i].id,true);
			}
		} else {
			this.$$("mydatatable").select(words.id);
		}
		this.getRoot().show();
	}	
	
	init() {
		this.$$("mydatatable").sync(baseOfWordsCollection);
	}
}
