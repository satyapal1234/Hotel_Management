const express = require('express')
const nodemailer=require('nodemailer');
const router = express.Router()

var models = require('/HT-TR/routes/model/db');

router.get('/managerwork',function(req,res)
{
   sess=req.session;
   if(sess.email)
   {
     models.HManager.findOne({email:sess.email},function(err,foundlist)
     {
        if(err){console.log('some error');}
        else if(!foundlist){
          res.send('sorry you are not auhorised to get it');
          console.log('no such user exist');}
        else
        {  
             models.Customer.find({},function(err,foundlist1){
                if(err){console.log('something error is there')}
                  else
                  {
                    models.Employee.find({},function(err2,foundlist2){
                      if(err2){console.log('something error');}
                      else
                      {
                          res.render("managerwork",{ses:"todays",foundlist,foundlist1,foundlist2});
                      }
                    })
                  }
             })
           //res.render("managerwork",{ses: "todays",foundlist}); 
        }
     })
   }
    else 
    {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href='+'/admin'+'>Login</a>');
    }
  //res.render("managerwork");
})












router.post('/managerlogin',function(req,res)
{
    const email=req.body.email;
  const password=req.body.password;
  sess=req.session;
  console.log('sjfdjls');
  //sess.email=req.body.email;
  console.log(email+" " + password);
  models.HManager.findOne({email:email},function(err,foundlist){
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
              sess.name=foundlist.fullname;
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






router.post('/removecustomer',function(req,res)
{
    const id=req.body.id;
  //console.log(id);
  if (id.match(/^[0-9a-fA-F]{24}$/))
  {

    models.Customer.findOneAndRemove({_id:id},function(err,foundlist)
     {
      if(err){console.log(err);}
      else if(!foundlist)
      {
         console.log('soryy');
        res.end('sorry');
      }
      else
      {
        console.log(foundlist.fullname);
        res.end('done');
      }
    })

  }
  else
  {
    res.end('sorry');
  }
})







router.get('/successfullyremoved',function(req,res)
{
  res.render("successfullyremoved");
})















router.post('/addemployee',function(req,res)
{
  console.log("whta");
  const fullname=req.body.fullname;
  const email=req.body.email;
  const contact=req.body.contact;
  const password=req.body.password;
  const address=req.body.address;
  console.log(fullname+" "+ email +" "+ address +" "+ contact + "  "+ password);
  if(email===""||fullname===""||password===""||address===""||password==="")
     {
       console.log("empty");
       res.end("empty");
     }
  else
  {
    models.Employee.findOne({email:email},function(err,foundlist)
    {
      if(err){console.log("some error")}
        else if(!foundlist)
        {         var rand1=Math.floor((Math.random() * 100) + 54);
                  var rand2=Math.floor((Math.random() * 1000) + 540);
                  var rand3=Math.floor((Math.random() * 10) + 543);
                  var rand4=Math.floor((Math.random() * 10000) + 54.3);
                    rand=(rand1*rand2*rand3)/rand4;
                 host=req.get('host');
                 link="http://"+req.get('host')+"/verifyemployee?id="+rand;

                 var transporter = nodemailer.createTransport(
                 {
                       service: 'gmail',
                       auth: {
                               user: 'jeesatyapal@gmail.com',
                               pass: 77060544195
                              }
                    });

                     mailOptions = 
                    {
                         from: 'jeesatyapal@gmail.com',
                         to: email,
                         subject: "verify",
                         html : "Hello,<br> Your temporary password is "+ password +" Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
                    };

                    transporter.sendMail(mailOptions, function(error, info)
                    {
                       if (error)
                       {
                         console.log(error);
                        } 
                        else 
                        {
                          console.log("show");
                          console.log('Email sent: ' + info.response);
                            var newemployee=models.Employee(
                              {
                                fullname:fullname,
                                  address:address,
                                  contact:contact,
                                  email:email,
                                password:password,
                                 rand:rand
                               })
                               newemployee.save();
                         
                          }
                     });

                         
                 res.end('save');
        }

        else
        {
          res.end("no");
        }
    })
  }
})












router.post('/removeemployee',function(req,res){
  const id=req.body.id;
  //console.log(id);
  if (id.match(/^[0-9a-fA-F]{24}$/))
  {

    models.Employee.findOneAndRemove({_id:id},function(err,foundlist)
     {
      if(err){console.log(err);}
      else if(!foundlist)
      {
         console.log('soryy');
        res.end('sorry');
      }
      else
      {
        console.log(foundlist.fullname);
        res.end('done');
      }
    })

  }
  else
  {
    res.end('sorry');
  }
  
})












router.get('/verifymanager',function(req,res){
console.log(req.protocol+":/"+req.get('host'));
if((req.protocol+"://"+req.get('host'))==("http://"+host))
{
    console.log("Domain is matched. Information is from Authentic email");
      var verifyid;
   
   
       // console.log("email is verified");
        models.HManager.findOneAndUpdate({rand:req.query.id},{ rand:0},function(err,foundlist)
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
   console.log(req.protocol+"://"+req.get('host'));
   console.log("http://"+host);
    res.end("<h1>Request is from unknown source");
}
});



module.exports=router;