//

const express=require('express');
const mongo=require("mongoose");
const app=express();
const params=require("params");
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, useNewUrlParser : true }));
app.use(express.json());

var url = "mongodb://127.0.0.1:27017/notes";
var url1="mongodb+srv://mahdi:mahdi@cluster0.3lvnvig.mongodb.net/mahdi?retryWrites=true&w=majority";
 var databsae;

mongo.connect(url1,{useNewUrlParser:true,useUnifiedTopology:true},
     function(err, db) {
    if (err) throw err;
      console.log(" conected database successfuly ...");
    
   
  });
  var sch={
    name: String,
    email:String,
    password:Number
}
  const mongomodel = new mongo.model('newcols',sch);


app.get('/',(req,res)=>{
   res.send(req.body.email);
});
app.get('/data',(req,res,next)=>{
fetchid=req.params.id  ;
mongomodel.find(({id:fetchid}),(err,val)=>{
if(err) throw err;
res.send(val);
})
  
});

//
app.post('/post',async(req,res)=>{
  console.log("inside post function ");

  const data=new mongomodel({
    name:req.body.name,
    email:req.body.email,
    password:req.body.password
  });
  const value =await data.save();
  res.json(value);
  console.log(req.body);
});

app.delete('/del/:id',(req,res)=>{

  let delid=req.params._id;
  mongomodel.findOneAndDelete(({id:parseInt(delid)}),(err,docs)=>{
    //findOneAndDelete
      if(err){res.send("errorrrrrrrrrrr");
    }else{
      if(docs==null){
        res.send("error docs not found !");
      }else{
        res.send(docs);
      }
    }
  })

});

app.listen(3000,()=>{
    console.log(" conected on port 3000... http://localhost:3000");
})
