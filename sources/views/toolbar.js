import {JetView} from "webix-jet";

export default class ToolView extends JetView {
	config(){
		const _ = this.app.getService("locale")._;
		const theme = this.app.config.theme;

		return {
			view:"toolbar", css:theme,
			height:56,
			elements:[
				{
					name:"lang", 
					optionWidth: 120, 
					view:"segmented", 
					options: [
						{ id:"en", value:_("English")},
						{ id:"ru", value:_("Russia")}
					], 
					click:() => this.toggleLanguage()
				},
				{	
					view: "button",
					value: _("Log out"),
					width:200,
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