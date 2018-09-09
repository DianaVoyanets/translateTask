import {JetView} from "webix-jet";

export default class LoginView extends JetView{
	config() {
		const login_register_form = {
			view: "tabview",
			cells: [
				{
					header: "Login",
					body: {
						view: "form",
						localId: "login:form",
						elements:[
							{ view: "spacer"},
							{ view:"text", name:"login", label:"User Name:",labelWidth:110,width: 350},
							{ view:"text",name:"pass", label:"Password:",type:"password",labelWidth:110,width: 350},
							{rows:[
								{view:"spacer"},
								{view:"button", value:"Login", click:() => this.doLogin(), hotkey:"enter",width:100,align:"right"},
							]}
						],
						rules:{
							login:webix.rules.isNotEmpty,
							pass:webix.rules.isNotEmpty
						}
					}
				},
				{
					header: "Register",
					body: {
						view: "form",
						localId: "register:form",
						elements: [
							{ view:"text", name:"login", label:"User Name:",labelWidth:100,width: 350},
							{ view:"text",name:"pass", label:"Password:", type:"password",labelWidth:100,width: 350},
							{rows:[
								{view:"spacer"},
								{ view:"button", value:"Register", click:() => this.doRegister(), hotkey:"enter",width:100,align:"right"}
							]},
						]
						
					}
				}
			]
		};

		return {
			rows:[
				{view: "spacer"},
				{cols: [
					{view:"spacer"},
					login_register_form,
					{view: "spacer"}
				],
				},
				{view:"spacer"}
			]
		};
	}

	init(view){
		view.$view.querySelector("input").focus();
	}

	doLogin() {
		const user = this.app.getService("user");
		const form = this.$$("login:form");

		if (form.validate()){
			const data = form.getValues();
            
			user.login(data.login, data.pass)
				.catch(function() {
					webix.html.removeCss(form.$view, "invalid_login");
					form.elements.pass.focus();
					webix.delay(function() {
						webix.html.addCss(form.$view, "invalid_login");
					});
				});
		}
	}
    
	doRegister() {
		const form = this.$$("register:form");

		if (form.validate()) {
			const data = form.getValues();
            
			webix
				.ajax()
				.post("http://localhost:3000/server/register", { 
					user: data.login, 
					pass: data.pass 
				})
				.then(response => response.json());
		}
	}
}