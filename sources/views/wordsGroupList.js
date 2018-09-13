import {JetView} from "webix-jet";
import addGroupPopupView from "views/addGroupPopup";
import addWordsPopupView from "views/addWordPopup";
import {wordsGroup} from "models/wordsGroup";

export default class wordsGroupList extends JetView {
	config() {
		this.countOfWords = null;
		var wordsDatatable = {
			rows: [
				{
					view:"toolbar",
					localId:"myToolbar",
					cols:[
						{view: "spacer"},
						{view: "spacer"},
						{view: "button",
							value: "Add new words",
							localId:"add_word",
							hidden: true,
							width: 130,
							click: () => {
								let selectedItem = this.$$("mylist").getSelectedItem();
								let words = this.$$("mylist").getSelectedItem().wordsIds;
								if (!words) {
									this._jetPopupWord.showWindow(null,selectedItem);
								} else {
									words = JSON.parse(words);
									this._jetPopupWord.showWindow(words,selectedItem);
								}
							}},
						{ view:"button",
							localId:"export_to_excel",
							label:"Export to Excel",
							width: 120
						},
					]
				},
				{
					view: "datatable",
					localId: "datatable",
					columns: [
						{id: "originWords",header: "Origin word"},
						{id: "translation",header: "Translation"},
						{id: "partOfSpeach",header: "Part of speech",width: 150},
						{},
					]
				}
			]
		};
	

		var wordsList = {
			rows: [{
				view:"toolbar",
				localId:"myToolbar",
				cols:[
					{ view:"label", id:"toolbar_label", label:"Group of word"},
				]},
			{view: "search",placeholder: "search of group name"},
			{
				view: "list",
				localId: "mylist",
				css: "list_height",
				width: 300,
				select:true,
				template: (obj) =>  {
					return (
						`<span class='delete_button'>×</span>
						 <span>Group Name: ${obj.name}</span><br>
				         <span>Count of words in a group:</span>`
					);
				},	
				onClick: {
					"delete_button":(e,id) => {
						webix.confirm({
							text: "Do you still want to delete this company?",
							callback: function(result) {
								if(result) {
									wordsGroup.remove(id); 
									return false;
								}
							}
						});
					}
	
				},
				on: {
					onAfterSelect: (id)=>{
						this.show("wordsGroupList");
						this.setParam("id", id,true);
						this.$$("add_word").show();
						let word = this.$$("mylist").getSelectedItem().wordsIds;
						if(word) {
							this.$$("datatable").clearAll();
							this.$$("datatable").parse(word);
						}	
					}
				}
			},
			{view: "button",value:"Add new group",localId: "add_group",click: ()=>this._jetPopup.showWindow()},
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
		this._jetPopup = this.ui(addGroupPopupView);
		this._jetPopupWord = this.ui(addWordsPopupView);

		wordsGroup.waitData.then(()=> {
			this.$$("mylist").sync(wordsGroup);			
		});
	}
}
