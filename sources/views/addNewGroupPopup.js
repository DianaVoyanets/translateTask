import {JetView} from "webix-jet";
import {baseOfWordsCollection} from "models/baseOfWordsCollection";
import {wordsGroup} from "models/wordsGroup";

export default class addNewGroupPopupView extends JetView{
	config() {
		const _ = this.app.getService("locale")._;

		var form = {
			view:"form",
			width: 600,
			gravity: 0.2,
			elements: [
				{
					view: "text",
					labelWidth: 120,
					label: _("Name of group:"),
					name: "name",
					invalidMessage: "Name of group can not be empty"
				}
			],
			rules: {
				"name": webix.rules.isNotEmpty
			}
		};

		var datatable = {
			view: "datatable",
			scroll: true,
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
						{
							view: "button",
							value:_("Add"),
							width: 120,
							click: () => this.addGroup()
						},
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
    
	init() {
		this._getDataTable().sync(baseOfWordsCollection);
	}

	addGroup() {
		let group = this._getForm().getValues();
		group.words = this._getDataTable().getSelectedItem();
		if(this._getForm().validate()) {
			if(!group.words) {
				this.app.showError({message: "Please select the words,which you want to add to the words group"});
				return;
			} else {
				wordsGroup.add(group);
				this.app.callEvent("onAfterAddNewGroup");
				this.getRoot().hide();
			}
		}
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
}
