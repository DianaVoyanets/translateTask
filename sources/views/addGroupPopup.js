import {JetView} from "webix-jet";

export default class addGroupPopupView extends JetView{
	config() {
		return {
			view:"window", 
			move:true,
			localId: "formPopup",
			head:"Add group of words",
			position:"center",
			body:{
				view:"form",
				localId: "form",
				elements: [
					{view: "text",labelWidth: 120,label: "Name of group:",name: ""},
					{view:"datepicker",labelWidth: 120,label: "Date of creation:",value: new Date(),name: ""},
					{cols:[
						{view: "spacer"},
						{view: "button",value: "Add",width: 120},
						{view: "button",value: "Cancel",width: 120,click: () => this.hide()},
					]}
				],
			}
		};
	}
    
	showWindow(id) {
		this.getRoot().show();
	}
    
	saveData() {
		
	}

	hide() {
		return this.$$("formPopup").hide();
	}
}