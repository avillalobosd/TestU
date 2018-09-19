module.exports = function (sequelize, DataTypes) {
    var Contestado = sequelize.define("Contestado", {
        respuesta: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },


    });

    Contestado.associate = function (models) {
        // Associating Author with Posts
        // When an Author is deleted, also delete any associated Posts
        Contestado.belongsTo(models.Respuesta, {
            onDelete: "cascade",
            foreignKey: {
                allowNull: false
            }
        });
        Contestado.belongsTo(models.User, {
            onDelete: "cascade",
            foreignKey: {
                allowNull: false
            }
        });
        Contestado.belongsTo(models.Curso, {
            onDelete: "cascade",
            foreignKey: {
                allowNull: false
            }
        })

    };



    return Contestado;
};