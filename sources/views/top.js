import {JetView, plugins} from "webix-jet";



export default class TopView extends JetView{
	config(){
		var header = {
			type:"header", template:"Menu"
		};

		var menu = {
			view:"menu", id:"top:menu", 
			width:180, layout:"y", select:true,
			template:"<span class='webix_icon fa-#icon#'></span> #value# ",
			data:[
				{value:"Base of words", id:"baseOfWords", icon:"envelope-o" },
				{value:"Group of world", id:"wordsGroupList", icon:"envelope-o" },
				{value:"Test",id:"test",  icon:"briefcase" },
				{value:"Tests result",id:"testResult",  icon:"briefcase" },
				{value: "Settings",id: "settings",icon:"briefcase"}
			]
		};

		var ui = {
			rows:[
				{view:"toolbar",css: "top_toolbar",elements:[
					{view:"spacer"},
					{view:"spacer"},
					{view: "button",value: "Log out",width:200,click: () => this.show("/logout")}
				]},
				{
					type:"line", cols:[
						{ type:"clean", css:"app-left-panel",
							padding:10, margin:20, borderless:true, rows: [ header, menu ]},
						{ rows:[ { height:10}, 
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
}