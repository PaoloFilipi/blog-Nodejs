const Sequelize = require("sequelize");

const connection = new Sequelize('blogNodejs','root','suasenha',{
    host:'localhost',
    dialect: 'mysql',
    timezone: "-03:00"
});

//exportar
module.exports = connection;