module.exports = function(sequelize, DataTypes) {
    var Examen = sequelize.define("Examen", {
      Numpregunta:{
        type: DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0
      }
  
    });
  
   
    Examen.associate = function(models) {
      // We're saying that a Post should belong to an Author
      // A Post can't be created without an Author due to the foreign key constraint
      Examen.belongsTo(models.Curso, {
        onDelete:"cascade",
        foreignKey: {
          allowNull: false
        }
      });
  
    };
    return Examen;
  };