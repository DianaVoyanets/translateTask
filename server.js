const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
var cors = require("cors");
var db = require("../translateTask/db");

const app = express();
app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
	secret: "k12jh40918e4019u3",
	resave: false,
	saveUninitialized: true,
	cookie: { 
		maxAge: 60*60*1000 
	}
}));


const words = require("../translateTask/sources/controllers/words");

app.put("/server/words/:wordsId",words.updateData);
app.delete("/server/words/:wordsId",words.removeData);
app.post("/server/words",words.addData);
app.get("/server/words",words.getData);

const wordsGroup = require("../translateTask/sources/controllers/wordsGroup");

app.put("/server/wordsGroup/:wordsGroupId",wordsGroup.updateData);
app.delete("/server/wordsGroup/:wordsGroupId",wordsGroup.removeData);
app.post("/server/wordsGroup",wordsGroup.addData);
app.get("/server/wordsGroup",wordsGroup.getData);

const Users = require("../translateTask/sources/controllers/user")
// const testResult = require("./sources/controllers/testResults");

//app.put("server/user/:userId",Users.updateData);
app.post("/server/user/logout",Users.logout);
app.post("/server/user/login",Users.login);
app.post("/server/login/status",Users.loginStatus);
app.post("/server/user/register",Users.registration);

const testResult = require("../translateTask/sources/controllers/testResults");

app.post("/server/testResult",testResult.addData);
app.get("/server/testResult",testResult.getData);

app.listen(3000, () => console.log("Example app listening on port 3000!"));