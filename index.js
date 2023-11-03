//

const express=require('express');
const mongo=require("mongoose");
const app=express();
const params=require("params");
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.json({limit:1024*1024*20}));
app.use(bodyParser.urlencoded({extended:true,limit:1024*1024*20 }));
var url = "mongodb://127.0.0.1:27017/notes";
var url1="mongodb+srv://mahdi:mahdi@cluster0.3lvnvig.mongodb.net/mahdi?retryWrites=true&w=majority";
var databsae;

mongo.connect(url1,{useNewUrlParser:true,useUnifiedTopology:true},
     function(err, db) {
    if (err) throw err;   
      console.log(" conected database successfuly ...");
    

   
  });
  var sch={
    title_pro: String,
    imag_pro:{ type: String },
    price_cash_pro:Number,
    price_installments_pro:Number
}
  const mongomodel = new mongo.model('product',sch);
  ///

  var users={
    thing_name:String ,
    username:String,
    phone_number:Number,
    address:String,
    price:Number,
    payment:Number,
    remain:Number

  }
  const mongoUser=new mongo.model("users",users);


app.get('/',(req,res)=>{
   res.send(req.body.email);
});
//get 
app.get('/data',(req,res,next)=>{
fetchid=req.params.id  ;
mongomodel.find(({id:fetchid}),(err,val)=>{
if(err) throw err;
res.send(val);
})
  
});

////////////////get item one from page view 
app.get('/data/:id',(req,res,next)=>{

  mongomodel.findById(req.params.id)
  .then(
    (mongomodel)=>{
      if(!mongomodel){return res.status(404).send();}
      res.send(mongomodel);
    }
  )
  .catch((err)=>{res.status(500).send(err);});
});


//post
app.post('/post',async(req,res)=>{
  console.log("inside post function ");

  const data=new mongomodel({
    title_pro:req.body.title_pro,
    imag_pro:req.body.imag_pro,
    price_cash_pro:req.body.price_cash_pro,
    price_installments_pro:req.body.price_installments_pro
  });
  const value =await data.save();
  res.json(value);
  console.log(req.body);
});

///////////////another get from users
app.get('/data_users',(req,res,next)=>{
  fetchid=req.params.id  ;
  mongoUser.find(({id:fetchid}),(err,val)=>{
  if(err) throw err;
  res.send(val);
  })
    
  });

////////////////get one user after press at name user

app.get('/information_user/:id',(req,res,next)=>{

  mongoUser.findById(req.params.id)
  .then(
    (mongoUser)=>{
      if(!mongoUser){return res.status(404).send();}
      res.send(mongoUser);
    }
  )
  .catch((err)=>{res.status(500).send(err);});
});
/////////search user by name
app.get('/info_user/:username',(req,res,next)=>{

  mongoUser.find({username:req.params.username})
  .then(
    (mongoUser)=>{
      if(!mongoUser){return res.status(404).send();}
      res.send(mongoUser);
    }
  )
  .catch((err)=>{res.status(500).send(err);});
});
///////////////////////add images by multer


const multer=require('multer');
app.use(express.static(path.join(__dirname,"image")))

const Storage =multer.diskStorage({
  destination:function (req, file,cb){
      cb(null,path.join(__dirname,'image'));
  },
  filename:function(req,file,cb){
    image_url=new Date().toISOString().replace(/:/g,"-")+file.originalname;
      cb(null,image_url);
  }
});

const upload=multer({storage:Storage});

////////////another post to users


app.post('/post',upload.single("imag_pro"),async(req,res)=>{
  console.log("inside post function ");
   
                const data=new mongomodel({
                  title_pro:req.body.title_pro,
                  imag_pro:"https://server-full-5.onrender.com/"+image_url,
                  price_cash_pro:req.body.price_cash_pro,
                  price_installments_pro:req.body.price_installments_pro
                });
                const value =await data.save();
                res.json(value);
                console.log(req.body);
                console.log(image_url);
                
});
//////update price for user 
app.put('/update_price_user/:id',async(req,res,next)=>{
  const ID=req.params.id;
  const newData={
    thing_name:req.body.thing_name,
    username:req.body.username,
    phone_number:req.body.phone_number,
    address:req.body.address,
    price:req.body.price,
    payment:req.body.payment,
    remain:req.body.remain
}
const result=await mongoUser.findOneAndReplace({_id:ID}
  ,newData);
console.log(result);
res.json({updatedCount : result.modifiedCount});
//res.send(req.body);

}
);

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
    title_pro:req.body.title_pro,
    imag_pro:req.body.imag_pro,
    price_cash_pro:req.body.price_cash_pro,
    price_installments_pro:req.body.price_installments_pro
}
const result=await mongomodel.findOneAndReplace({_id:ID},newData);
console.log(result);
res.json({updatedCount : result.modifiedCount});

});


app.listen(3000,()=>{
    console.log(" conected on port 3000... http://localhost:3000");
})
