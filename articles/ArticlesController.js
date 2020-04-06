const express = require("express");
const router = express.Router();
const Category =  require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");
router.get("/admin/articles",adminAuth, (req,res) =>{
    //para dar um join 
    Article.findAll({
        //estou incluindo na minha busca o model Category
        include: [{model: Category}]
    }).then(articles =>{
        res.render("admin/articles/index",{articles:articles});
    })
});

router.get("/admin/articles/new", adminAuth,(req,res) => {
    //Estou dando um select das minhas categorias e enviando para meu html
    Category.findAll().then(categories =>{
        res.render("admin/articles/new",{categories:categories});
    })
    
});

router.post("/articles/save",adminAuth, (req,res) =>{
    var title = req.body.title;
    var body =  req.body.body;
    var category = req.body.category;

    Article.create({
        title:title,
        slug:slugify(title),
        body: body,
        categoryId: category
    }).then(() =>{
        res.redirect("/admin/articles");
    })
});

router.post("/articles/delete",adminAuth,(req,res) =>{
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){//verifica se o id é numerico
            Article.destroy({
                where:{
                    id: id // id igual o id que passar na requisição
                }
            }).then(() =>{
                res.redirect("/admin/articles");
            });

        }else{
            res.redirect("/admin/articles");
        }
    }else{// se for null
        res.redirect("/admin/articles");
    }
})

router.get("/admin/articles/edit/:id",adminAuth, (req,res) =>{
    // uma forma rapida para buscar algo pelo id
    var id = req.params.id;

    //se não for um número redirecionar para pagina de categorias
    if(isNaN(id)){
        res.redirect("/admin/articles");
    }

    Article.findByPk(id).then( article =>{
        if(article != undefined){
            Category.findAll().then(categories=>{
              res.render("admin/articles/edit",{article:article,categories:categories})
            })
            
        }else{
            res.redirect("/admin/article");
        }
    })
});


router.post("/articles/update",adminAuth, (req,res) =>{
    var id = req.body.id;
    var title = req.body.title;
    var body =  req.body.body;
    var categoryId = req.body.category
    //para atualizar
    Article.update({title:title,
                    slug: slugify(title), 
                    body:body,
                    categoryId:categoryId},{
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/articles");
    })
})

router.get("/articles/page/:num",(req, res) => {
    var page = req.params.num;
    var offset = 0;

    if(isNaN(page) || page == 1){
        offset = 0;
    }else{
        offset = (parseInt(page) - 1) * 4;
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset,
    }).then(articles => {
        var next;
        if(offset + 4 >= articles.count){
            next = false;
        }else{
            next = true;
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles : articles
        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page",{result: result, categories: categories})
        });
    });
});

module.exports = router;