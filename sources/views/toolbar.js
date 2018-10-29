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
						return `<span class='logged-user'>${obj ? obj.login : ""}</span>`;
					},
					url: "/server/login/status",
					width: 120
				},
				{	
					view: "button",
					value: _("Log out"),
					width: 200,
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