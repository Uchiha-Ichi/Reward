const express = require("express");
const pool = require('./pool');
const bodyParser = require('body-parser');
const app = express();
app.set('view engine', 'ejs');
app.set("views", "./views");
app.use(express.static("public"));
app.use("/web3", express.static(__dirname + "/node_modules/web3.js-browser/build/"));
app.listen(3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/submit-data', async (req, res) => {
    try {
        // Lấy dữ liệu từ yêu cầu POST
        const query = req.body;

        console.log(query);
        // Thực hiện thao tác chèn dữ liệu vào cơ sở dữ liệu
        const result = await pool.query(query);

        // Gửi phản hồi về trình duyệt web để thông báo rằng dữ liệu đã được chèn thành công
        res.status(200).send('Data inserted successfully');
    } catch (error) {
        console.error('Error handling data:', error);
        res.status(500).send('Internal server error');
    }
});
app.get('/get-data', async (req, res) => {
    try {
        // Thực hiện truy vấn để lấy dữ liệu từ cơ sở dữ liệu
        const result = await pool.query("SELECT * from list_reward");
        console.log(result.rows);
        // Gửi dữ liệu về cho giao diện dưới dạng JSON
        res.json(result.rows);
    } catch (error) {
        console.error('Error handling data:', error);
        res.status(500).send('Internal server error');
    }
});

var fs = require("fs");
loatConfigFile("./config.json");


function loatConfigFile(file) {
    var obj = null;
    fs.readFile(file, "utf8", function (err, data) {
        if (err) throw err;
        obj = JSON.parse(data);
        console.log(obj);
        require("./routes/main")(app, obj);
    });
}