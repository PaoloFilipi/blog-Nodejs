const Sequelize =  require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category");

const Article = connection.define('articles',{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

//Relacionamento 1 para Muitos
Category.hasMany(Article);//Uma categoria Tem muito artigoes

//Relacionamento 1 para 1  
Article.belongsTo(Category);// Um Artigo pertence a uma categoria

//Article.sync({force: true});

module.exports = Article;