import {JetView} from "webix-jet";
import {baseOfWordsCollection} from "models/baseOfWordsCollection";
import {wordsGroup} from "models/wordsGroup";

export default class addGroupPopupView extends JetView{
	config() {
		const _ = this.app.getService("locale")._;

		var form = {
			view:"form",
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
			head:_("Add new group"),
			position:"center",
			on: {
				"onHide": () => {
					this._getForm().clear();
					this._getDataTable().unselectAll();
				}
			},
			body:{
				rows: [
					form,
					datatable,
					{cols:[
						{view: "spacer"},
						{view: "button",value:_("Add"),width: 120,click: () => {
							let groupValues = this._getForm().getValues();
							groupValues.words = this._getDataTable().getSelectedItem();
							if(this._getForm().validate()) {
								if(!groupValues.words) {
									webix.message({text:"Please select the words,which you want to add to the form",type: "error"});
									return;
								} else {
									wordsGroup.add(groupValues);
									this.getRoot().hide();
								}
							}
						}},
						{
							view: "button",
							value: _("Cancel"),
							width: 120,
							click: () => this.getRoot().hide()
						},
					]}  
				]
				
			}
		};

	}
	
	showWindow() {
		this.getRoot().show();
	}

	_getDataTable() {
		return this.getRoot().queryView({view: "datatable"});
	}

	_getForm() {
		return this.getRoot().queryView({view: "form"});
	}

	init() {
		this._getDataTable().sync(baseOfWordsCollection);
	}
}
