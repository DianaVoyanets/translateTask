import {JetView} from "webix-jet";
import addGroupPopupView from "views/addGroupPopup";
import addWordsPopupView from "views/addWordPopup";
import {wordsGroup} from "models/wordsGroup";

export default class wordsGroupList extends JetView {
	config() {
		this.countWordsInGroup = 0;
		const _ = this.app.getService("locale")._;

		this.countOfWords = null;
		var wordsDatatable = {
			rows: [
				{
					view:"toolbar",
					localId:"myToolbar",
					cols:[
						{view: "spacer"},
						{view: "spacer"},
						{	view: "button",
							type:"iconButton",
							icon: "plus",
							label: _("Add new words"),
							localId:"add_word",
							hidden: true,
							width: 170,
							click: () => {
								let selectedItem = this.$$("mylist").getSelectedItem();
								let words = this.$$("mylist").getSelectedItem().wordsIds;
								if (!words) {
									this._jetPopupWord.showWindow(null,selectedItem);
								} 
								else {
										this._jetPopupWord.showWindow(words,selectedItem);
									}
									
								}
							},
						{   view:"button",
							type:"iconButton",
							localId:"export_to_excel",
							label: '<span class="webix_icon fa fa-file-excel-o"></span><span class="text">Export to Excel</span>',
							autowidth:true,
							click: () => {
								webix.toExcel(this.$$("datatable"));
							}
						},
					]
				},
				{
					view: "datatable",
					localId: "datatable",
					columns: [
						{id: "originWords",header: _("Origin word")},
						{id: "translation",header: _("Translation")},
						{id: "partOfSpeach",header: _("Part of speech"),width: 130},
					]
				}
			]
		};
	

		var wordsList = {
			rows: [{
				view:"toolbar",
				localId:"myToolbar",
				cols:[
					{ view:"label", id:"toolbar_label", label:_("Group of words")},
				]},
			{view: "search",localId: "search_input",placeholder: _("search of group name")},
			{
				view: "list",
				localId: "mylist",
				css: "list_height",
				width: 300,
				select:true,
				template: (obj) =>  {
					return (
						`<span class='delete_button'>×</span>
						 <span>${_("Group name:")} ${obj.name}</span><br>
				         <span>${_("Count of words in a group:")} ${obj.wordsIds.length}</span>`
					);
				},	
				onClick: {
					"delete_button":(e,id) => {
						webix.confirm({
							text: "Do you still want to delete this group?",
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
			{view: "button",value:_("Add new group"),localId: "add_group",click: ()=>this._jetPopup.showWindow()},
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
			this.$$("mylist").select(wordsGroup.getFirstId());	
		});
		this.$$("search_input").attachEvent("onTimedKeyPress",function(){
			var value = this.getValue().toLowerCase();
			this.$scope.$$("mylist").filter(function(obj){
			  return obj.name.toLowerCase().indexOf(value) === 0;
			})
		});
	}

}
