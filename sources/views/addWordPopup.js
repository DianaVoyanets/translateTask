import {JetView} from "webix-jet";
import {baseOfWordsCollection} from "models/baseOfWordsCollection";
import {wordsGroup} from "models/wordsGroup";

export default class addWordsPopupView extends JetView{
	config() {		
		let popup = {
			view:"window", 
            height: 500,
            modal: true,
			move:true,
			localId: "formPopup",
			head:"Add group of words",
			position:"center",
			body:{
                    view: "form",
                    localId: "myform",
                    select:"row",
                    multiselect:true,
                    width: 600,
                    elements: [
                        {view: "text",labelWidth: 120,label: "Name of group:",name: "name"},
                        {view: "datatable",localId: "mydatatable",
                        columns: [
                            {id: "originWords",header: "Origin word"},
                            {id: "translation",header: "Translation"},
                            {id: "partOfSpeach",header: "Part of speach"},      
                        ],
                    },
					{cols:[
						{view: "spacer"},
                        {view: "button",value: "Add",width: 120,click: () => {
                            let group = this.$$("form").getValues();
							group.values = this.$$("mydatatable").getSelectedItem();
							if(group.hasOwnProperty("id")){
								wordsGroup.updateItem(group.id, group);
							}
							else{
								wordsGroup.add(group);
							}
                        }},
                        
						{view: "button",value: "Cancel",width: 120,click: () => {
                            this.$$("formPopup").hide();
                        }}
					]}  
				]
				
			}
        }
        return popup;

    }
	
	showWindowWord(item) {
        this.$$("mydatatable").unselectAll();
        if(Array.isArray(item)) {
            for(var i = 0;i < item.length;i++) {
                this.$$("mydatatable").select(item[i].id,true);
            } 
        } else {
            this.$$("mydatatable").select(item.id)
        }
		this.getRoot().show();
	}
	
	init() {
		this.$$("mydatatable").sync(baseOfWordsCollection);
	}
}
