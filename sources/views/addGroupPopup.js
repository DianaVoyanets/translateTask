import {JetView} from "webix-jet";
import {baseOfWordsCollection} from "models/baseOfWordsCollection";
import {wordsGroup} from "models/wordsGroup";

export default class addGroupPopupView extends JetView{
	config() {
		const _ = this.app.getService("locale")._;

		var form = {
			view:"form",
			localId: "form",
			width: 600,
			gravity: 0.2,
			elements: [
				{view: "text",labelWidth: 120,label: _("Name of group:"),name: "name",invalidMessage: "Name can not be empty"},
				{view:"datepicker",labelWidth: 120,label: _("Date of creation:"),value: new Date(),name: "dateOfCreation"},
			],
			rules: {
				"name": webix.rules.isNotEmpty
			}
		};

		var datatable = {
			view: "datatable",
			localId: "mydatatable",
			scroll: false,
			select:true,
			multiselect:true,
			width: 600,
			columns: [
				{id: "originWords",header: _("Origin word")},
				{id: "translation",header: _("Translation")},
				{id: "partOfSpeach",header: _("Part of speech"),width: 150},      
			],
		};
		
		return {
			view:"window", 
			height: 500,
			move:true,
			localId: "formPopup",
			head:_("Add new group"),
			position:"center",
			body:{
				rows: [
					form,
					datatable,
					{cols:[
						{view: "spacer"},
						{view: "button",value:_("Add"),width: 120,click: () => {
							let groupValues = this.$$("form").getValues();
							groupValues.wordsIds = this.$$("mydatatable").getSelectedItem();
							if(this.$$("form").validate()) {
								if(!groupValues.wordsIds) {
									webix.message({text:"Please select the words,which you want to add to the form",type: "error"});
									return;
								} else {
									wordsGroup.add(groupValues);
									this.$$("formPopup").hide();
									this.$$("form").clear();
									this.$$("mydatatable").unselectAll();
								}
							}
						}},
						{view: "button",value: _("Cancel"),width: 120,click: () => this.$$("formPopup").hide()},
					]}  
				]
				
			}
		};

	}
	
	showWindow(id) {
		this.getRoot().show();
	}
	
	init() {
		this.$$("mydatatable").sync(baseOfWordsCollection);
	}
}
