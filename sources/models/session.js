function status() {
	return webix.ajax().post("/server/login/status")
		.then(response => response.json());
}

function login(user, pass) {
	return webix.ajax().post("/server/user/login", {
		user, pass
	}).then(response => response.json());
}

function logout() {
	return webix.ajax().post("/server/user/logout")
		.then(response => response.json());
}

export default {
	status, login, logout
};