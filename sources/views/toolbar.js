import {JetView} from "webix-jet";

export default class ToolView extends JetView {
	config(){
		const _ = this.app.getService("locale")._;

		return {
			view: "layout",
			type: "clean",
			borderless: true,
			css: "bg_opacity",
			cols: [
				{
					name:"lang", 
					optionWidth: 120, 
					view:"segmented", 
					options: [
						{ id:"en", value:_("English")},
						{ id:"ru", value:_("Russia")}
					], 
					click: () => this.toggleLanguage()
				},
				{
					view: "template",
					template: (obj) => {
						return `<span class='logged-user mdi mdi-account'>${obj ? obj.login : ""}</span>`;
					},
					url: "/server/login/status",
					width: 120
				},
				{
					view:"button",
					type:"iconButton", 
					icon:"mdi mdi-share",
					align:"center", 
					label:_("Sign out"), 
					autowidth:true, 
					click: () => this.show("/logout") 
				}
			]
		};
	}
    
	toggleLanguage() {
		const langs = this.app.getService("locale");
		const value = this.getRoot().queryView({ name:"lang" }).getValue();
		langs.setLang(value);
	}
}