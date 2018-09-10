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

const backend = express.Router();

app.use("/server", backend);

backend.post("/login", (req, res) => {
	db.Users.findOne({ where: {login: req.body.user,password: req.body.pass}}).then(
		user => {
			if(user) {
				const user = {login: req.body.user,password: req.body.pass};
				req.session.user = user;
				res.send(user);
			} else {
				res.send(null);
			}
		}
	);
});

backend.post("/register",(req,res) => {
	db.Users.sync({ force: true }).then(() => {
	db.Users.create({ 
		login: req.body.user,
		password: req.body.pass
	});
});
	res.send({login: req.body.user,password: req.body.pass});
});

backend.post("/login/status", (req, res) => {
	res.send(req.session.user || null);
});

backend.post("/logout", (req, res) => {
	delete req.session.user;
	res.send({});
});

const words = require("../translateTask/sources/controllers/words");

app.put("/words/:wordsId",words.updateData);
app.delete("/words/:wordsId",words.removeData);
app.post("/words",words.addData);
app.get("/words",words.getData);

const wordsGroup = require("../translateTask/sources/controllers/wordsGroup");

app.put("/wordsGroup/:wordsGroupId",wordsGroup.updateData);
app.delete("/wordsGroup/:wordsGroupId",wordsGroup.removeData);
app.post("/wordsGroup",wordsGroup.addData);
app.get("/wordsGroup",wordsGroup.getData);


app.listen(3000, () => console.log("Example app listening on port 3000!"));