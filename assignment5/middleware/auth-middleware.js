module.exports = async function (req, res, next) {
    if (!req.session.user) return res.redirect("/login");
    else next();
  };
  /*module.exports = async function (req, res, next) {
    if (!req.session.user?.role.includes("admin")) return res.redirect("/login");
    else next();
  };*/