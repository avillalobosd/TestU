require('dotenv').config()
var db = require("../models");





db.User.create({
    email: "gustavo.canales@gmail.com",
    password: "1234",
    empresa: "TestU",
    role: "superadmin"
  }).then(project => {

    console.log("Usuario Creado")
    })
  .catch(function (err) {
    console.log(err);
  });