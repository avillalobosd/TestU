// Requiring our models and passport as we've configured it
var db = require("../models");
//var passport = require("../config/passport");
const jwt = require('jsonwebtoken');
var bcrypt = require("bcrypt-nodejs");




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
          FirstName: project.FirstName,
          LastName: project.LastName,
          empresa: project.empresa,
          Picture: project.Picture
        }
        //console.log("El req password es: " + req.body.password)
        //console.log("El project password es: " + project.password)
        //console.log(JSON.stringify(project))
        var passworIsvalid = bcrypt.compareSync(req.body.password, project.password)
        if (passworIsvalid) {
          jwt.sign({ user }, "secretkey", { expiresIn: "24h" }, (err, tk) => {
            res.json({
              token: tk,
              role: user.role,
              empresa: user.empresa,
              id: user.id
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

 
//* Route to get user by id
app.get("/api/UserOne/:id", (req, res) => {
  console.log(req.params.id);
  db.User.findOne({
    where:{
      id: req.params.id
    }
    
  })
    .then(data => {

      res.json({
        nombre: data.FirstName, 
        apellido: data.LastName,
      picture: data.Picture})
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
  app.get("/api/documentos/:empresa", (req, res) => {
    db.Clase.findAll({
      where: {
        empresa: req.params.empresa
      },
      include: [db.Curso],
      order: [
        [db.Curso, "curso", "ASC"]
      ]

    })
      .then(data => {
        res.json(data)
      })
      .catch(function (err) {
        console.log(err)
        res.json(err)
      })

  })

  //* Route to get documents per curso
  app.get("/api/documentocurso/:id", (req, res) => {
    db.Clase.findAll({
      where: {
        CursoId: req.params.id
      },
      include: [db.Curso],
      order: [
        [db.Curso, "curso", "ASC"]
      ]

    })
      .then(data => {
        if (data.length > 0) {
          res.json({ mensaje: "Si" })
        }
        else
          res.json({ mensaje: "No" })
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
  app.put("/api/update", (req, res) => {
    db.User.update(req.body, {
      where: {
        email: req.body.email
      }
    }).then(function (dbUser) {
      res.json(dbUser)
    })
      .catch(function (err) {
        console.log(err)
        console.log(err)
        res.json(err)
      })
  })

  //Api Route to create a course
  app.post("/api/curso", (req, res) => {
    //console.log(req.body);
    db.Curso.create({
      curso: req.body.curso,
      empresa: req.body.empresa
    })
      .then(data => {
        res.json(data)
        db.Examen.create({
          Numpregunta: 0,
          CursoId: data.id
        }).then(data2 => {
          res.json(data2)
        }).catch(function (err) {
          console.log(err)
        })

      })
      .catch(function (err) {
        res.json(err)
      })


  })

  //Api Route to get course by empresa and find associates
  app.get("/api/curso/:empresa", (req, res) => {
    db.Curso.findAll({
      /*attribitutes:{
        include:[[Sequelize.fn("COUNT",Sequelize.col("clases.id"),"claseCount")]]
      },*/
      include: [db.Clase, db.preguntas, db.Contestado],
      where: {
        empresa: req.params.empresa
      }
    })
      .then(data => {
        res.json(data)
      })
      .catch(function (err) {
        console.log(err)
        res.json(err)
      })
  })

  //Borrar curso
  app.delete("/borrar/curso/:id", (req, res) => {
    db.Curso.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(data => {
        res.json(data)
      })
      .catch(function (err) {
        console.log(err)
      })
  })

  //Borrar Material
  app.post("/documento/delete", (req, res) => {
    db.Clase.destroy({
      where: {
        id: req.body.id
      }
    })
      .then(data => {
        res.json(data)
      })
      .catch(function (err) {
        console.log(err)
      })
  })




  //Añadir material para el curso
  app.post("/upload", (req, res, ) => {
    console.log(req.body)
    db.Clase.create({
      CursoId: req.body.CursoId,
      ubicacion: req.body.ubicacion,
      documento: req.body.documento,
      empresa: req.body.empresa
    }).then(data => {
      res.json(data)
    })
      .catch(function (err) {
        console.log(err)
      })
  });

  //*Añadir Pregunta a Curso
  app.post("/api/pregunta", (req, res) => {
    db.preguntas.create({
      CursoId: req.body.CursoId,
      pregunta: req.body.pregunta,
      Empresa: req.body.Empresa
    }).then(data => {
      res.json(data)
    })
      .catch(function (err) {
        console.log(err)
      })
  })

  //*Ver preguntas del curso
  app.get("/api/pregunta/:curso", (req, res) => {
    db.preguntas.findAll({
      where: {
        CursoId: req.params.curso
      },
      include: [db.Respuesta]
    }).then(data => {
      res.json(data)
    }).catch(function (err) {
      console.log(err)
    })
  })


  //*Añadir respuestas
  app.post("/api/respuestas", (req, res) => {
    db.Respuesta.create({
      Respuesta: req.body.Respuesta,
      Correcta: req.body.Correcta,
      preguntaId: req.body.preguntaId
    }).then(data => {
      res.json(data)
    }).catch(function (err) {
      console.log(err)
    })
  })

  //* Añadir examen
  app.put("/api/examen/", (req, res) => {
    db.Examen.update({
      CursoId: req.body.CursoId,
      Numpregunta: req.body.Numpregunta,
    },
      {
        where: {
          CursoId: req.body.CursoId
        }

      }).then(data => {
        res.json(data)
      }).catch(function (err) {
        console.log(err)
      })
  })

  //*Respuesta de Examen
  app.get("/api/respuesta/:id", (req, res) => {
    db.Respuesta.findOne({
      where: {
        id: req.params.id
      }
    }).then(data => {
      res.json(data)
    }).catch(function (err) {
      console.log(err)
    })
  })

  //*Examen contestado
  app.post("/api/contestado/", (req, res) => {
    db.Contestado.create({
      respuesta: req.body.respuesta,
      RespuestumId: req.body.RespuestumId,
      UserId: req.body.UserId,
      CursoId: req.body.CursoId
    }).then(data => {
      res.json(data)
    }).catch(function (err) {
      console.log(err)
    })
  })

  //*Crear Usuario
  app.post("/api/usuario", function (req, res) {
    //console.log(req.body);
    db.User.create({
      email: req.body.email,
      password: req.body.password,
      empresa: req.body.empresa,
      role: "user"
    }).then(project => {
      //res.redirect(307, "/api/login");
      return res.json({
        mensaje: "Usuario Creado"
      })
    }).catch(function (err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });

  //*Encontrar los usuarios con examenes
  app.get("/api/usuarios/:empresa/:curso", function (req, res) {
    db.User.findAndCountAll({
      where: {
        empresa: req.params.empresa,
      },
      include: [{
        model: db.Contestado,
        where: {
          CursoId: req.params.curso,
          Respuesta: false
        }
      }]
    }).then(data => {
      res.json(data)
    }).catch(function (err) {
      console.log(err)
    })
  })

  app.get("/api/contestados/:curso", function (req, res) {
    db.preguntas.findAndCountAll({
      include: [{
          model:db.Curso,
        where:{
          id:req.params.curso
        }}]
    }).then(data => {
      res.json(data)
    }).catch(function (err) {
      console.log(err)
    })
  })

  app.get("/api/contestadostrue/:user/:curso", function (req, res) {
    db.Contestado.findAndCountAll({
      where:{
        respuesta:true
      },
      include: [{
        model:db.User,
        where:{
          id:req.params.user
        }},{
          model:db.Curso,
        where:{
          id:req.params.curso
        }}]
    }).then(data => {
      res.json(data)
    }).catch(function (err) {
      console.log(err)
    })
  })

  app.get("/api/numusuarios/:empresa", function (req, res) {
    db.User.findAll({
      where: {
        empresa: req.params.empresa,
        role:"user"
      }
    }).then(data => {
      res.json(data)
    }).catch(function (err) {
      console.log(err)
    })
  })

  //Route to put a user in an exam
  app.post("/api/examen",function(req,res){
    db.Examen.create({
      CursoId:req.body.CursoId,
      UserId:req.body.UserId,
    }).then(data=>{
      res.json(data)
    }).catch(function(err){
      console.log(err)
    })

  })

  //Sacar el numero total de preguntas
  //*Ver preguntas del curso
  app.get("/api/numpregunta/:curso", (req, res) => {
    db.preguntas.findAndCountAll({
      where: {
        CursoId: req.params.curso
      }
    }).then(data => {
      res.json(data)
    }).catch(function (err) {
      console.log(err)
    })
  })

  app.put("/api/calificacion",(req,res)=>{
    db.Examen.update({
      Calificacion:req.body.Calificacion
    },
    {
      where:{
        UserId:req.body.UserId,
        CursoId:req.body.CursoId
      }
      
    }).then(data=>{
      res.json(data)
    }).catch(function(err){
      console.log(err)
    })
  })

  app.get("/api/tomados/:user/:curso",(req,res)=>{
    db.Examen.findOne({
      where:{
        UserId:req.params.user,
        CursoId:req.params.curso
      }
    }).then(data=>{
      res.json(data)
    }).catch(function(err){
      console.log(err)
    })
  })

  app.get("/api/examen",(req,res)=>{
    db.Examen.findAll({
      include:[db.User,db.Curso]
    }).then(data=>{
      res.json(data)
    }).catch(function(err){
      console.log(err)
    })
  })



}