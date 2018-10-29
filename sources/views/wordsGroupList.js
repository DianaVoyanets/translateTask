import {JetView} from "webix-jet";
import addNewGroupPopupView from "views/addNewGroupPopup";
import addNewWordsPopupView from "views/addNewWordPopup";
import {wordsGroup} from "models/wordsGroup";

export default class wordsGroupList extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		var wordsDatatable = {
			rows: [
				{
					view:"toolbar",
					cols:[
						{view: "spacer"},
						{view: "spacer"},
						{	
							view: "button",
							type:"iconButton",
							icon: "plus",
							label: _("Edit group"),
							localId: "newWord:button",
							hidden: true,
							autowidth: true,
							click: () => this.showPopup()
						},
						{   
							view:"button",
							type:"iconButton",
							label: "<span class='webix_icon fa fa-file-excel-o'></span><span class='text'>Export to Excel</span>",
							autowidth:true,
							click: () => {
								webix.toExcel(this._getDataTable());
							}
						},
					]
				},
				{
					view: "datatable",
					scroll:true,
					columns: [
						{id: "originWords",header: _("Origin word")},
						{id: "translation",header: _("Translation")},
						{id: "partOfSpeach",header: _("Part of speech"),width: 130},
					]
				}
			]
		};

		var wordsList = {
			rows: [
				{
					view:"toolbar",
					cols:[
						{ 
							view:"label",
							label:_("Group of words")
						},
					]
				},
				{   
					view: "search",
					placeholder: _("search of group name")
				},
				{
					view: "list",
					css: "list_height",
					width: 300,
					select:true,
					template: (obj) =>  {
						return (
							`<span class='delete_button'>×</span>
						 	 <span><b>${_("Group name:")}</b> ${obj.name}</span><br>
							 <span><b>${_("Count of words in a group:")}</b> ${Array.isArray(obj.words) ? obj.words.length : 1}</span><br>`
					
						);
					},	
					onClick: {
						"delete_button":(event,item) => {
							webix.confirm({
								text: "Do you still want to delete this group?",
								callback: function(confirmed) {
									if(confirmed) {
										wordsGroup.remove(item); 
										return false;
									}
								}
							});
						}
	
					},
					on: {
						onAfterSelect: (selectedItem) => {
							this.onafterSelectItemInList(selectedItem);
						}
					}
				},
				{
					view: "button",
					value:_("Add new group"),
					click: () => this._addNewGroupPopupView.showWindow()
				},
			]
		};
		return {
			rows: [
				{
					cols: [wordsList,wordsDatatable]
				}
			]
		}; 
	}

	init() {
		this._addNewGroupPopupView = this.ui(addNewGroupPopupView);
		this._addNewWordsPopupView = this.ui(addNewWordsPopupView);

		wordsGroup.waitData.then(()=> {
			this._getWordsGroupList().sync(wordsGroup);	
			this._getWordsGroupList().select(wordsGroup.getFirstId());	
		});

		this.on(this.app,"onAfterAddNewGroup",() => this._getWordsGroupList().select(wordsGroup.getLastId()));
		this.searchWordsGroup();
	}

	_getWordsGroupList() {
		return this.getRoot().queryView({view: "list"});
	}

	_getDataTable() {
		return this.getRoot().queryView({view: "datatable"});
	}

	onafterSelectItemInList(selectedItem) {
		this.showAddNewWordsButton();
		this.setParam("id", selectedItem,true);
		let wordsInGroup = this._getWordsGroupList().getSelectedItem().words;
		if (wordsInGroup) {
			this._getDataTable().clearAll();
			this._getDataTable().parse(wordsInGroup);
		}
	}

	showAddNewWordsButton() {
		return this.$$("newWord:button").show();
	}

	searchWordsGroup() {
		const seurchInput = this.getRoot().queryView({view: "search"});
		seurchInput.attachEvent("onTimedKeyPress", function(){
			var value = this.getValue().toLowerCase();
			this.$scope._getWordsGroupList().filter(function (obj) {
				return obj.name.toLowerCase().indexOf(value) === 0;
			});
		});
	}
    
	showPopup() {
		let selectedGroup = this._getWordsGroupList().getSelectedItem();
		if(!selectedGroup) {
			webix.message("Please,select the group, which you want to edit!");
		}
		let wordsInGroup = this._getWordsGroupList().getSelectedItem().words;
		this._addNewWordsPopupView.showWindow({
			words: wordsInGroup,
			group: selectedGroup
		});
	}	
}
