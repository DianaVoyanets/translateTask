import {JetView} from "webix-jet";
import {baseOfWordsCollection} from "models/baseOfWordsCollection";
import {wordsGroup} from "models/wordsGroup";

export default class addNewGroupPopupView extends JetView{
	config() {
		const _ = this.app.getService("locale")._;

		var form = {
			view:"form",
			width: 500,
			gravity: 0.2,
			elements: [
				{
					view: "text",
					label: _("Name of group:"),
					labelWidth: 120,
					name: "name",
					invalidMessage: _("Name of group can not be empty")
				}
			],
			rules: {
				"name": webix.rules.isNotEmpty
			}
		};

		var datatable = {
			view: "datatable",
			scroll: true,
			select: true,
			multiselect: true,
			columns: [
				{id: "originWords",header: _("Origin word"),width: 150},
				{id: "translation",header: _("Translation"),width: 150},
				{id: "partOfSpeach",header: _("Part of speech"),width: 150},      
			],
		};
		
		return {
			view:"window", 
			width: 470,
			height: 400,
			modal: true,
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
					{
						view: "label",
						label: _("*Сtrl + enter to add more than one word to the group."),
						css: "node_for_user"
					},
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
		const _ = this.app.getService("locale")._;

		let group = this._getForm().getValues();
		group.words = this._getDataTable().getSelectedItem();
		if(this._getForm().validate()) {
			if(!group.words) {
				this.app.showError({message: _("Please select the words,which you want to add to the words group")});
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
