var express = require("express");
var app = express();
app.set('view engine', 'ejs');
app.set("views", "./views");
app.use(express.static("public"));
app.use("/web3", express.static(__dirname + "/node_modules/web3.js-browser/build/"));
app.listen(3000);
var fs = require("fs");
loatConfigFile("./config.json");

function loatConfigFile(file) {
    var obj = null;
    fs.readFile(file, "utf8", function(err, data) {
        if (err) throw err;
        obj = JSON.parse(data);
        console.log(obj);
        require("./routes/main")(app, obj);
    });
}