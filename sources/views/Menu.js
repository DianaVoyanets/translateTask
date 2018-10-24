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
				{ id:"baseOfWords",value: _("Base of words"), icon:"mdi mdi-cart" },
				{ id:"wordsGroupList", value:_("Group of words"), icon:"mdi mdi-account-box" },
				{ id:"test", value:_("Test"), icon:"mdi mdi-chart-areaspline" },
				{ id:"testResult", value:_("Tests result"), icon:"mdi mdi-widgets" },
			]
		};
	}
	init(sidebar) {
		this.use(plugins.Menu,{
			id:sidebar,
		});
	}
}
