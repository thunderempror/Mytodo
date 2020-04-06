const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const app = express();

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: false }));
mongoose.connect("mongodb://localhost:27017/mytodoDB",{ useNewUrlParser: true,useUnifiedTopology: true });

const todoSchema = new mongoose.Schema({
    title:String,
    description:String
});

const Item = mongoose.model("Item",todoSchema);

app.get('/',(req,res)=>{
    
    Item.find({},function(err,list){
         if(err){console.log( "error is " +err);
         }else{        
        res.render('home',{list:list});
         }
    });
});

app.post("/",(req,res)=>{
      
    const item = new Item ({

        title:req.body.title,
        description:req.body.description
    });

    item.save();
    res.redirect("/");

});

app.get('/edit/:id',(req,res)=>{
    Item.findById(req.params.id,(err,item)=>{
        if(err){ return console.log(err);
        }        
        res.render("edit",{item:item});
    })

});
app.post('/edit/:id',(req,res)=>{
    Item.findByIdAndUpdate(req.params.id,{title:req.body.title,description:req.body.description},(err,item)=>{
        if(err){return console.log(err);
        }        
        res.redirect('/');
    }) 
     

})

app.get("/delete/:id",(req,res)=>{
  
    Item.findByIdAndRemove(req.params.id,(err,item)=>{
         if(err){console.log(err);
         }else{
             console.log("Deleted successfully");
             res.redirect("/");
             
         }
    })

})


app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})
