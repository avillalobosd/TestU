module.exports = function(sequelize, DataTypes) {
    var Clase = sequelize.define("Clase", {
      // The email cannot be null, and must be a proper email before creation
      /*curso: {
        type: DataTypes.STRING,
        allowNull: false,
      },*/
      // The password cannot be null
      documento: {
        type: DataTypes.STRING,
      },
      ubicacion:{
        type:DataTypes.STRING,
        allowNull:false
      },
      empresa:{
        type:DataTypes.STRING,
        allowNull:false
      }

    });

    Clase.associate = function(models) {
      // We're saying that a Post should belong to an Author
      // A Post can't be created without an Author due to the foreign key constraint
      Clase.belongsTo(models.Curso, {
        onDelete:"cascade",
        foreignKey: {
          allowNull: false
        }
      });
    };



    return Clase;
  };