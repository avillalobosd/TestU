module.exports = function (sequelize, DataTypes) {
    var Curso = sequelize.define("Curso", {
        curso: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        empresa:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        Material:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:false,
        }

    });

    Curso.associate = function(models) {
        // Associating Author with Posts
        // When an Author is deleted, also delete any associated Posts
        Curso.hasMany(models.Clase,{
            onDelete:"cascade"
        });
        Curso.hasMany(models.preguntas,{
            onDelete:"cascade"
        })
      };


    
    return Curso;
};