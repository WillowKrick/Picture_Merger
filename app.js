const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.all("*", function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Methods",
		"PUT",
		"GET",
		"POST",
		"DELETE",
		"OPTIONS"
	);
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", express.static("./"));
app.use("*", cors());
app.listen(3663, "0.0.0.0", () => {
	console.log("open your broswer then browse: localhost:3663");
	console.log("打开浏览器访问: localhost:3663");
});
