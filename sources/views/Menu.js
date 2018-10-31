import {JetView, plugins} from "webix-jet";


export default class MenuView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const theme = this.app.config.theme;
		return {
			view:"sidebar",
			css:theme,
			width:200,
			data:[
				{ id:"baseOfWords",value: _("Base of words"),icon: "mdi mdi-database"},
				{ id:"wordsGroupList", value:_("Groups of words"),icon: "mdi mdi-group"},
				{ id:"test", value:_("Test"), icon: "mdi mdi-pencil"},
				{ id:"testResult", value:_("Tests result"),icon: "mdi mdi-clipboard-check"},
			]
		};
	}
	
	init(sidebar) {
		this.use(plugins.Menu,{
			id:sidebar,
		});
	}
}
