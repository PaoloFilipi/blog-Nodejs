const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session =require("express-session");
const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController")
const articleController = require("./articles/ArticlesController")
const usersController = require("./users/UsersController")


const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User =  require("./users/User")


//View engine
app.set('view engine','ejs');




//Session
app.use(session({
    secret: "ijnijadnaisjdn123dap2ij=ds",
    cookie: {maxAge: 3000000} //segundos para deslogar
    //se fosse um projeto de media e grande escala teria que usar por exemplo o Redis
    // Para salvar nossa session e tira-la da memoria do servidor 
}))


//Static
app.use(express.static('public'));

//Body parser
app.use(bodyParser.urlencoded({extended:false}));// aceitar dados de formulario
app.use(bodyParser.json());// aceitar dados no formato json

//Database
connection
    .authenticate()
    .then(() =>{
        console.log("Conexão com o banco feita com sucesso ")
    }).catch((erro) =>{
        console.log("Houve um erro : "+erro);
    })

//Rotas

// estou dizendo que quero utilizar as rotas que estao dentro de CategorieController
app.use("/",categoriesController);

//rotas de articles
app.use("/",articleController);

app.use("/",usersController);

app.get("/session",(req,res) =>{
    req.session.treinamento = "Formação Node.js"
    req.session.ano = 2019
    req.session.email ="teste@teste.com"
    req.session.user = {
        username: "PaoloFilipi",
        email: "email@email.com",
        id:10
    }
    res.send("Sessão gerada!")
})

app.get("/leitura", (req,res) =>{
    res.json({
        reinamento:req.session.treinamento,
        ano:req.session.ano,
        email:req.session.email,
        user:req.session.user
    })
})


app.get("/",(req,res) => {
    
    Article.findAll({
        order:[
            ['id','desc']
        ],
        limit:4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index",{articles:articles,categories:categories});
        })
        
    });
    
});

app.get("/:slug",(req,res) =>{
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug:slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article",{article:article,categories:categories});
            })
        }else{
            res.redirect("/");
        }
    }).catch( err =>{
        res.redirect("/");
    })
})

app.get("/category/:slug",(req,res) =>{
    var slug = req.params.slug;
    Category.findOne({
        where:{
            slug:slug
        },
        include:[{model:Article}]
    }).then(category => {
        if( category != undefined){
            Category.findAll().then(categories =>{
                res.render("indexCategory",{articles:category.articles,categories:categories})
            })
        }else{
            res.redirect("/")
        }
    }).catch( err =>{
        res.redirect("/")
    })
})

app.listen(8080,() =>{
    console.log("O servidor esta rodando!")
})