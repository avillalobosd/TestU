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

    
    return Curso;
};