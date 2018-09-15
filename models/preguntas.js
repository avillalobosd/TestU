module.exports = function(sequelize, DataTypes) {
  var preguntas = sequelize.define("preguntas", {
    pregunta:{
      type: DataTypes.TEXT,
      allowNull:false
    },
  
    Empresa: {
      type:DataTypes.STRING,
      allowNull:false
    }

  });

 
  preguntas.associate = function(models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    preguntas.belongsTo(models.Curso, {
      onDelete:"cascade",
      foreignKey: {
        allowNull: false
      }
    });
    preguntas.hasMany(models.Respuesta,{
      onDelete:"cascade"
  });

  };
  return preguntas;
};
