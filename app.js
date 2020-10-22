const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const e = require("express");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// DB NAME
const DBNAME = "WikiDB";

// DB URL
const dbConnectionUrl = "mongodb://localhost:27017/"+DBNAME;

// Connect to DB
mongoose.connect(dbConnectionUrl, { useNewUrlParser:true, useFindAndModify:false, useUnifiedTopology:true })

// schema
const articleSchema = {
    title:{type:String, required:true},
    content:{type:String}
} 
// collection
const Article = mongoose.model("Article",articleSchema);

///////////////////////////// chained route handling for All articles /////////////////////////
app.route("/articles")
    // get method for /articles
    .get((req,res)=>{
            Article.find((err,resultDocs)=>{
                if(!err){
                    res.json(resultDocs);
                }   
                else{
                    res.send(err);
                }
            });
        })
    // post method for /articles
    .post((req,res)=>{
            const newArticle = new Article({
                title: req.body.title,
                content: req.body.content
            });
            newArticle.save((err)=>{
                if(!err){
                    res.send("Article Post Sucessfull");
                }
                else{
                    res.send(err);
                }
            });
        })
    // delete method for /articles    
    .delete((req,res)=>{
            Article.deleteMany({},(err)=>{
                if(!err)
                    res.send("Deleted Successfully.");
                else
                    res.send(err);
            });
        });

///////////////////////////// chained route handling for specific article /////////////////////////
 
app.route("/articles/:articleTitle")
    // get method for specific article.
    .get((req,res)=>{
        const reqTitle = req.params.articleTitle;
        Article.findOne({title:reqTitle},(err,resultDoc)=>{
            if(!err){
                if(resultDoc)
                    res.json(resultDoc);
                else
                    res.json("No Article resource found");
            }   
            else{
                res.send(err);
            }
        });
    });
 

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is Up and Running");
});