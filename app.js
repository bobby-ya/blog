var express         = require("express");
    bodyParser      = require("body-parser");
    expressSanitizer = require("express-sanitizer");
    mongoose        = require("mongoose");
    methodOverride  = require("method-override")
    app             = express();

mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost:/blog_app", { useNewUrlParser: true });
mongoose.createConnection("mongodb://localhost/blog_app", { useNewUrlParser: true });
    
    
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title   : String,
    image   : String,
    body    : String,
    created : {type:Date,default:Date.now} 
});

var Blog = mongoose.model("Blog", blogSchema);

// RESTFUL ROUTE
app.get("/",(req,res)=>{
    res.redirect("/blogs");
});

// INDEX ROUTES
app.get("/blogs",(req,res)=>{
    Blog.find({},(error,blogs)=>{
        if(error){
            console.log(error)
        }
        else{
            res.render("index",{blogs:blogs})
        }
    });
});

// NEW ROUTE
app.get("/blogs/new",(req,res)=>{
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs",(req,res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog,(err, newBlog)=>{
        if(err){
            res.render("new")
        }else{
            res.redirect("/blogs")
        }
    })
})

// SHOW ROUTE
app.get("/blogs/:id",(req,res)=>{
    Blog.findById(req.params.id,(err, foundBlog)=>{
        if(err){
            res.redirect('/blogs');
        }else{
            res.render("show",{blog: foundBlog})
        }
    })
});

// EDIT ROUTE
app.get("/blogs/:id/edit", (req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog: foundBlog});
        }
    })
});

// UPDATE ROUTE
app.put("/blogs/:id",(req,res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err, updatedBlog)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    })
})

// DELETE ROUTE
app.delete("/blogs/:id",(req,res)=>{
    Blog.findByIdAndRemove(req.params.id,(err)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    })
});


app.get("*",(req,res)=>{
    res.send("Error 404 NOT Found!!!")
})

app.listen(5000,()=>{
    console.log("SERVER IS STARTED");
})
