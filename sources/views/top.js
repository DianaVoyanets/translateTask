import {JetView, plugins} from "webix-jet";



export default class TopView extends JetView{
	config() {	
		const _ = this.app.getService("locale")._;

		var header = {
			type:"header", template: "MyApp"
		};

		var menu = {
			view:"menu", id:"top:menu", 
			width:180, layout:"y", select:true,
			template:"<span class='webix_icon fa-#icon#'></span> #value# ",
			data:[
				{value:_("Base of words"), id:"baseOfWords", icon:"fas fa-book" },
				{value:_("Group of words"), id:"wordsGroupList", icon:"fas fa-list-ul"},
				{value:_("Test"),id:"test",  icon:"fas fa-question" },
				{value:_("Tests result"),id:"testResult",  icon:"briefcase" },
			]
		};

		var ui = {
			rows:[
				{view:"toolbar",css: "top_toolbar",elements:[
					{view:"spacer"},
					{view: "spacer"},
					{view: "spacer"},
						{ name:"lang", optionWidth: 120, view:"segmented", label:_("Language"), options:[
							{ id:"en", value:_("English") },
							{ id:"ru", value:_("Russia") }
						], click:() => this.toggleLanguage()},
						{view: "button",value: _("Log out"),width:200,click: () => this.show("/logout")}
					]
				},
				{
					type:"line", cols:[
						{ type:"clean", css:"app-left-panel",
							padding:10, margin:20, borderless:true, rows: [ header, menu ]},
						{ rows:[{height:10}, 
							{ type:"clean", css:"app-right-panel", padding:4, rows:[
								{ $subview:true } 
							]}
						]}
					] 
				}
			]
		};


		return ui;
	}

	init(){
		this.use(plugins.Menu, "top:menu");
	}
	toggleLanguage() {
		const langs = this.app.getService("locale");
        const value = this.getRoot().queryView({ name:"lang" }).getValue();
        langs.setLang(value);
	}
}