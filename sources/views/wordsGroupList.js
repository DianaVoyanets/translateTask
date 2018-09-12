import {JetView} from "webix-jet";
import wordsDatatable from "views/wordsDatatable";
import wordsAddForm from "views/wordsAddForm";
import addGroupPopupView from "views/addGroupPopup";
import addWordsPopupView from "views/addWordPopup";
import {wordsGroup} from "models/wordsGroup";

export default class wordsGroupList extends JetView {
	config() {
		var wordsList = {
			rows: [{
				view:"toolbar",
				localId:"myToolbar",
				cols:[
					{ view:"label", id:"toolbar_label", label:"Group of word"},
				]},
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
				         <span>Count of words in a group: </span>`
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
						let word = this.$$("mylist").getSelectedItem().wordsIds;
						this.show(`wordsGroupList`);
						this.setParam("id", id,true);
						this.$$("add_word").show();
						this.app.callEvent("listSelected",[word]);
					}
				}
			},
			{view: "button",value:"Add new group",localId: "add_group",click: ()=>this._jetPopup.showWindow()},
			{view: "button",value: "Add new word in group",localId:"add_word",hidden: true,click: (id) => { 
				this._jetPopupWord.showWindowWord(JSON.parse(this.$$("mylist").getSelectedItem().wordsIds));
			}}
			]

		};
        
		return {
			cols: [wordsList,wordsDatatable]
		}; 
	}
	init() {
		this._jetPopup = this.ui(addGroupPopupView);
		this._jetPopupWord = this.ui(addWordsPopupView);

		wordsGroup.waitData.then(()=> {
			this.$$("mylist").sync(wordsGroup);
			this.$$("mylist").select(wordsGroup.getFirstId());
		})
	}
}
