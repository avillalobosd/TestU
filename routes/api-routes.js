// Requiring our models and passport as we've configured it
var db = require("../models");
//var passport = require("../config/passport");
const jwt = require('jsonwebtoken');
var bcrypt = require("bcrypt-nodejs");
//multer config
const path = require("path");
//add multer to manage multipart form
const multer = require("multer");



module.exports = function (app) {
  app.post("/api/login", (req, res) => {
    db.User.findOne({
      where: {
        email: req.body.email
      }
    }).then(project => {

      if (project === null) {
        //console.log("No exite el usuario")
        return res.json({
          mensaje: "No user"
        });
      }
      else {
        const user = {
          id: project.id,
          email: project.email,
          role: project.role,
          FirstName:project.FirstName,
          LastName:project.LastName,
          empresa:project.empresa,
          Picture:project.Picture
        }
        //console.log("El req password es: " + req.body.password)
        //console.log("El project password es: " + project.password)
        //console.log(JSON.stringify(project))
        var passworIsvalid = bcrypt.compareSync(req.body.password, project.password)
        if (passworIsvalid) {
          jwt.sign({ user }, "secretkey", { expiresIn: "24h" }, (err, tk) => {
            res.json({
              token: tk,
              role: user.role
            });
            console.log("Este es el token: " + token);
          });
        }
        else {
          res.json({
            mensaje: "Incorrect Password"
          })
        }
      }

    })

  })


  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function (req, res) {
    console.log(req.body);
    db.User.create({
      email: req.body.email,
      password: req.body.password,
      empresa: req.body.empresa,
      role: "admin"
    }).then(project => {
      //res.redirect(307, "/api/login");
      return res.json({
        mensaje: "Empresa Creada"
      })
    }).catch(function (err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });

 
  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", verifyToken, (req, res) => {
    jwt.verify(req.token, "secretkey", (err, authData) => {
      if (err) {
        res.json(null);
      }
      else {
        res.json({
          authData
        })
      }
    })
  });

  //* Route for getting all uploaded documents
  app.get("/api/documentos", (req, res) => {
    db.Clase.findAll()
      .then(data => {
        res.json(data)
      })
      .catch(function (err) {
        console.log(err)
        res.json(err)
      })

  })

  //Verify Token
  function verifyToken(req, res, next) {
    //Get auth header value
    const bearerHeader = req.headers["x-token"];
    //Check if bearer is undefined
    if (typeof bearerHeader !== "undefined") {
      //Split at the space
      const bearer = bearerHeader.split(" ");
      //Get token from array
      const bearerToken = bearer[1];
      //Set the token
      req.token = bearerToken;
      //Next Middleware
      next();
    }
    else {
      res.sendStatus(403);
    }

  }

  //Api Route to update user profile
  app.put("/api/update",(req,res)=>{
    db.User.update(req.body,{
      where:{
        email:req.body.email
      }
    }).then(function(dbUser){
      res.json(dbUser)
    })
    .catch(function(err){
      console.log(err)
      res.json(err)
    })
  })


  //-----Manage the post requests.
  app.post("/upload", (req, res, ) => {
        console.log(req.body)
        db.Clase.create({
          clase: req.body.clase,
          documento: req.body.documento
        }).then(data => {
          res.json(data)
        })
        .catch(function(err){
          console.log(err)
        })
      });

  


}