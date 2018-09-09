import {JetView} from "webix-jet";
import wordsDatatable from "views/wordsDatatable";
import wordsAddForm from "views/wordsAddForm";
import addGroupPopupView from "views/addGroupPopup";

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
				width: 300,
				select:true,
				template: (obj) =>  {
					return (
						`<span class='delete_button'>×</span>
                         <span>Group Name: </span>
				         <span>Date of creation: </span>
				         <span>Count of words in a group: </span>`
					);
				}
			},
			{view: "button",value:"Add new group",localId: "add_group",click: (id)=>this._jetPopup.showWindow(id)}
			]

		};
        
		return{
			cols: [wordsList,wordsDatatable,wordsAddForm]
		}; 
	}
	init() {
		this._jetPopup = this.ui(addGroupPopupView);
	}
    
}
