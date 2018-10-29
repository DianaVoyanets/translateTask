import {JetView} from "webix-jet";
import {baseOfWordsCollection} from "models/baseOfWordsCollection";
import {wordsGroup} from "models/wordsGroup";

export default class addNewWordsPopupView extends JetView{
	config() {	
		const _ = this.app.getService("locale")._;
        
		return  {
			view:"window", 
			width: 460,
			height: 400,
			scroll: false,
			modal: true,
			head:_("Edit group"),
			position:"center",
			on: {
				"onHide": () => {
					this.getRoot().hide();
					this._getDataTable().unselectAll();
				}
			},
			body:{
				view: "form",
				elements: [
					{
						view: "text",
						labelWidth: 120,
						label: _("Name of group:"),
						name: "name"
					},
					{
						view: "datatable",
						select:"row",
						multiselect: true,
						scroll: true,
						columns: [
							{id: "originWords",header: _("Origin word"),width: 150},
							{id: "translation",header: _("Translation")},
							{id: "partOfSpeach",header: _("Part of speech"),width: 150},    
						],
					},
					{cols:[
						{view: "spacer"},
						{
							view: "button",
							value: _("Add"),
							width: 120,
							click: () => {
								this.addNewWordsInGroup();
							}},
                        
						{	
							view: "button",
							value: _("Cancel"),
							width: 120,
							click: () => {
								this.getRoot().hide();
							}}
					]}  
				]
				
			}
		};
	}

	init() {
		this._getDataTable().sync(baseOfWordsCollection);
	}

	addNewWordsInGroup() {
		let group  = this._getForm().getValues();
		let newWords = this._getDataTable().getSelectedItem();
		group.words = newWords;
		wordsGroup.updateItem(group.id,group);
		this.getRoot().hide();
	}
	
	showWindow(optionsForShow) {
		const words = optionsForShow.words;
		const selectedGroup = optionsForShow.group;

		this._getDataTable().unselectAll();
		if (!optionsForShow.words) {
			this._getForm().setValues(selectedGroup);
			this.getRoot().show();
			return;
		}
		if(Array.isArray(words)) {
			for(var i = 0; i < words.length;i++) {
				this._getDataTable().select(words[i].id,true);
			}
		} else {
			this._getDataTable().select(words.id);
		}
		this._getForm().setValues(selectedGroup);
		this.getRoot().show();
	}
	
	_getDataTable() {
		return this.getRoot().queryView({view: "datatable"});
	}

	_getForm() {
		return this.getRoot().queryView({view: "form"});
	}
}
