module.exports = function (sequelize, DataTypes) {
    var Curso = sequelize.define("Curso", {
        curso: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        empresa:{
            type:DataTypes.STRING,
            allowNull:false,
        }

    });

    
    return Curso;
};