
const express = require('express')
const nodemailer=require('nodemailer');
const router = express.Router()

var models = require('/HT-TR/routes/model/db');


router.get('/adminstratorwork',function(req,res)
{
    sess=req.session;
    if(sess.email)
    {
      models.HAdminstrator.findOne({email:sess.email},function(err,foundlist)
      {
        if(err){console.log('there is some error');}
         else if(!foundlist)
         {
            res.write('<h1>Hey You are not Authorisesd to get this.</h1>');
           res.end('<a href='+'/admin'+'>Login</a>');
         }
         else
         {

            models.Tablebook.find().sort('-arrivaldate').exec(function(err, foundlist1) { 
               if(err){console.log('eror');}
               else
               {
                //console.log(foundlist1);
                 models.Bedbook.find({},function(err,foundlist2)
                 {
                  if(err){console.log('there is error');}
                   else
                   {
                      models.Hallbook.find({},function(err,foundlist3) {
                         if(err){console.log('error');}
                         else
                         {
                             res.render("adminstratorwork",{ses:"todays",foundlist,foundlist1,foundlist2,foundlist3});
                         }
                      })
                     
                   }
                 })
               }
            })
           
         }
      })
    }

    else 
    {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href='+'/admin'+'>Login</a>');
    }
})

















router.post('/adminstratorlogin',function(req,res)
{
  const email=req.body.email;
  const password=req.body.password;
  sess=req.session;
  //sess.email=req.body.email;
  console.log(email+" " + password);
  models.HAdminstrator.findOne({email:email},function(err,foundlist){
    if(err){console.log("some error is there");}
    else if(!foundlist){console.log("no such user is there");res.end('oops');}
      else
      {
        if(foundlist.rand==0)
        {
          //verified
            if(foundlist.password===password)
            {
              console.log("matched ");
              sess.email=req.body.email;
              sess.name=foundlist.name;
              res.end("done");
            }
            else
            {
              console.log("wrong")
              res.end("wrong");
            }
        }
        else
        {
         res.end('verify');
          console.log("first verify it");
        }
      }
      res.end("wrong");
  })
	
})












router.post('/royalbedroom',function(req,res){
    const noofroyalroom1=req.body.noofroyalroom1;
    const noofroyalroom2=req.body.noofroyalroom2;
    var newroyalbeddata= Royalbed({
        noofroyalroom1:noofroyalroom1,
        noofroyalroom2:noofroyalroom2
    })

    models.Royalbed.find({},function(err,foundlist){
        if(err){
          console.log('there is error');
          res.end('error');
        }
        else if(!foundlist){
          newroyalbeddata.save();
          res.end('done');
        }
        else
        {
          models.Royalbed.deleteOne({},function(err,foundlist)
          {
             if(err){console.log(err);
               res.end('error');}
              else
              {
               newroyalbeddata.save();
               res.end('done');
              }
          })
        }
    })
})











router.post('/addbed',function(req,res){
  const noofsinglebedac=req.body.noofsinglebedac;
  const noofdoublebedac=req.body.noofdoublebedac;
  const nooffourbedac=req.body.nooffourbedac;
  const noofsinglebednonac=req.body.noofsinglebednonac;
  const noofdoublebednonac=req.body.noofdoublebednonac;
  const nooffourbednonac=req.body.nooffourbednonac;
  console.log(nooffourbednonac+" "+ nooffourbedac);


   var newbeddata=new models.Bed({
      noofsinglebedac:noofsinglebedac,
      noofdoublebedac:noofdoublebedac,
      nooffourbedac:nooffourbedac,
      noofsinglebednonac:noofsinglebednonac,
      noofdoublebednonac:noofdoublebednonac,
      nooffourbednonac:nooffourbednonac
   })

   models.Bed.find({},function(err,foundlist){
       if(err){
        console.log('there is error')
        res.end('error');
       }
       else if(!foundlist)
       {
        newbeddata.save();
        res.end('done');
       }
       else
       {
           models.Bed.deleteOne({},function(err,foundlist)
          {
             if(err){console.log(err);
               res.end('error');}
             else
            {
               newbeddata.save();
              res.end('done');
            }

           })
       }
   })
})



router.post('/addtable',function(req,res){
  const nooftwosittertableac=req.body.nooftwosittertableac;
  const nooffoursittertableac=req.body.nooffoursittertableac;
  const noofeightsittertableac=req.body.noofeightsittertableac;
  const nooftwosittertablenonac=req.body.nooftwosittertablenonac;
  const nooffoursittertablenonac=req.body.nooffoursittertablenonac;
  const noofeightsittertablenonac=req.body.noofeightsittertablenonac;

  var newtabledata=new models.Table({
          nooftwosittertableac:nooftwosittertableac,
         nooffoursittertableac:nooffoursittertableac,
         noofeightsittertableac:noofeightsittertableac,
        })

  models.Table.find({},function(err,foundlist)
   {
      if(err){
        console.log('there is error');
         res.end('error');}
      else if(!foundlist)
      {
        newtabledata.save();
        res.end('done');
      }

      else
      {
         models.Table.deleteOne({},function(err,foundlist)
         {
          if(err){console.log(err);
            res.end('error');}
          else
          {
            newtabledata.save();
            res.end('done');
          }

         })
      }
   })

      
})













router.get('/verifyadminstrator',function(req,res){
console.log(req.protocol+":/"+req.get('host'));
if((req.protocol+"://"+req.get('host'))==("http://"+host))
{
    console.log("Domain is matched. Information is from Authentic email");
      var verifyid;
   
   
       // console.log("email is verified");
        models.HAdminstrator.findOneAndUpdate({rand:req.query.id},{ rand:0},function(err,foundlist)
        {
          if(err)
         console.log("err");
          else if(!foundlist)
           {
             res.end("<h1>Email has been verified already");
             console.log("email is verified  already");
           }
          else
            {console.log("updated");
            console.log(foundlist.email);}
        });
        var link2=req.protocol+"://"+req.get('host');
        //console.log("heloo" +link2);
        res.end("<h1>Email  is been Successfully verified </br> click here to go to main page <a href="+link2+">click here</a>");
}
else
{
    res.end("<h1>Request is from unknown source");
}
});
module.exports=router;