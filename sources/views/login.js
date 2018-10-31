import {JetView} from "webix-jet";

export default class LoginView extends JetView {
	config() {

		const loginRegisterForm = {
			view: "tabview",
			cells: [
				{
					header: "Login",
					body: {
						view: "form",
						localId: "login:form",
						elements:[
							{ 
								view:"text", 
								name:"login", 
								label: "User Name:",
								labelWidth:110,
								width: 350,
								invalidMessage: "login can not be empty"
							},
							{ 
								view:"text",
								name:"pass", 
								label: "Password:",
								type:"password",
								labelWidth:110,
								width: 350,
								invalidMessage: "password can not be empty"
							},
							{rows:[
								{
									view:"button", 
									value: "Login", 
									hotkey:"enter",
									width:100,
									align:"right",
									click:() => this.doLogin(), 
								},
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
							{ 
								view:"text", 
								name:"login", 
								label: "User Name:",
								labelWidth:100,
								width: 350,
								invalidMessage: "Login can not be empty"
							},
							{ 
								view:"text",
								name:"pass", 
								label: "Password:", 
								type:"password",
								labelWidth:100,
								width: 350,
								invalidMessage: "Password can not be empty"
							},
							{rows:[
								{ 
									view:"button",
									value: "Register", 
									click:() => this.doRegister(),
									hotkey:"enter",
									width:100,
									align:"right"
								}
							]},
						],
						rules:{
							login:webix.rules.isNotEmpty,
							pass:webix.rules.isNotEmpty
						}
						
					}
				}
			]
		};

		return {
			rows:[
				{view: "spacer"},
				{cols: [
					{view:"spacer"},
					loginRegisterForm,
					{view: "spacer"}
				],
				},
				{view:"spacer"}
			]
		};
	}

	init (view) {
		view.$view.querySelector("input").focus();
	}

	doLogin() {
		const user = this.app.getService("user");
		const form = this.$$("login:form");

		if (form.validate()) {
			const dataFromFormInputs = form.getValues();
			
			user.login(dataFromFormInputs.login, dataFromFormInputs.pass)
				.catch( () => {
					form.elements.pass.focus();
					webix.delay(() => { 
						this.app.showError({message: "Incorrect login or password"});
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
				.post("/server/user/register", { 
					user: data.login, 
					pass: data.pass 
				})
				.then( response => {
					webix.message(response.json().message);
				}).
				fail((err) => {
					this.app.showError({message: JSON.parse(err.response).message});
				});
		}
	}
}