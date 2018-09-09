function status() {
	return webix.ajax().post("http://localhost:3000/server/login/status")
		.then(response => response.json());
}

function login(user, pass){
	return webix.ajax().post("http://localhost:3000/server/login", {
		user, pass
	}).then(response => response.json());
}

function logout(){
	return webix.ajax().post("http://localhost:3000/server/logout")
		.then(response => response.json());
}

export default {
	status, login, logout
};