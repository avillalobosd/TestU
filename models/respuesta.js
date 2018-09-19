module.exports = function (sequelize, DataTypes) {
    var Respuesta = sequelize.define("Respuesta", {
        Respuesta: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        Correcta: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }

    });

    Respuesta.associate = function (models) {
        // We're saying that a Post should belong to an Author
        // A Post can't be created without an Author due to the foreign key constraint
        Respuesta.belongsTo(models.preguntas, {
            onDelete: "cascade",
            foreignKey: {
                allowNull: false
            }
        });
        Respuesta.hasMany(models.Contestado,{
            onDelete:"cascade"
        });
       
        
    };

    return Respuesta;
};