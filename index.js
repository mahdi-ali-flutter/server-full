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

//get
app.get('/',(req,res)=>{
   res.send(req.body.email);
});

app.get('/data',async(req,res,next)=>{
fetchid=req.params.id  ;
await mongomodel.find(({id:fetchid}),(err,val)=>{
if(err) throw err;
res.send(val);
}) 
});

//post
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
//delete
app.delete('/delete/:id',async(req,res)=>{
  
  const ID=req.params.id;
  const result=await mongomodel.deleteOne({_id:ID});
  res.json({deletedCount:result.deletedCount})

});

//update
app.put('/update/:id',async(req,res,next)=>{
const ID=req.params.id;
const newData={
  name:req.body.name,
    email:req.body.email,
    password:req.body.password
}
const result=await mongomodel.findOneAndReplace({_id:ID},newData);
console.log(result);
res.json({updatedCount : result.modifiedCount});

});


app.listen(3000,()=>{
    console.log(" conected on port 3000... http://localhost:3000");
})
