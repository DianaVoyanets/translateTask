import "./styles/app.css";
import { JetApp, EmptyRouter, HashRouter, plugins } from "webix-jet";
import session from "models/session";

export default class MyApp extends JetApp {
	constructor(config) {
		const defaults = {
			id 		: APPNAME,
			version : VERSION,
			debug 	: !PRODUCTION,
			start 	: "/startPage/wordsGroupList"
		};

        super({ ...defaults, ...config });
		this.use(plugins.User, { model : session });
		this.use(plugins.Locale, { lang: "en" });
	}
}

if (!BUILD_AS_MODULE) {
	var app = new MyApp();
	webix.ready(() => {	
		app.use(plugins.Locale, { lang: "en" });
		app.render();
	});
}