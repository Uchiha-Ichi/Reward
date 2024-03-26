module.exports = function(app, obj) {
    app.get("/admin", function(req, res) {
        res.render("admin");
    })
    app.get("/", function(req, res) {
        res.render("user");
    })
}