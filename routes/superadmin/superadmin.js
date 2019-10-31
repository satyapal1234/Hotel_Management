const express = require('express')
const nodemailer=require('nodemailer');
const router = express.Router();
var models = require('/HT-TR/routes/model/db');

router.post('/addadmin',function(req,res){
  	const fullname=req.body.fullname;
  	const email=req.body.email;
  	const contact=req.body.contact;
  	const type=req.body.type;
  	const password=req.body.password;
    const address=req.body.address;
  	console.log(fullname+" "+ email +" "+ address +" "+ contact + " "+ type + " "+ password);

	  if(type==='H_ADMINSTRATOR')
	  {
          models.HAdminstrator.findOne({email:email},function(err,foundlist){
          if(err){console.log("error is there");}
          else if(!foundlist)
          {

          	  var rand1=Math.floor((Math.random() * 100) + 54);
              var rand2=Math.floor((Math.random() * 1000) + 540);
              var rand3=Math.floor((Math.random() * 10) + 543);
              var rand4=Math.floor((Math.random() * 10000) + 54.3);
              rand=(rand1*rand2*rand3)/rand4;
              host=req.get('host');
             link="http://"+req.get('host')+"/verifyadminstrator?id="+rand;

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
                     html : "Hello,<br> your temporary password is "+password+" </br> you can also change your password.</br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
                };

                transporter.sendMail(mailOptions, function(error, info)
                {
                   if (error)
                   {
                     console.log(error);
                    // res.end('error');
                    } 
                    else 
                    {
                      console.log("show");
                      console.log('Email sent: ' + info.response);
                        var hadminstrator=new models.HAdminstrator(
                          {
                              fullname:fullname,
                              address:address,
                              contact:contact,
                              email:email,
                               password:password,
                              type:type,
                              rand:rand
                         })
                         hadminstrator.save();
                         
                        // res.end('save');
                    }
                 });
                   	
            res.end("save");
          }

          else
          {
          	     console.log("no man");
                 res.end("no");
          }
      });
	  }












	  if(type==='H_MANAGER')
	  {
            models.HManager.findOne({email:email},function(err,foundlist){
              if(err){console.log("error is there");}
              else if(!foundlist)
              {
                   
                  var rand1=Math.floor((Math.random() * 100) + 54);
                  var rand2=Math.floor((Math.random() * 1000) + 540);
                  var rand3=Math.floor((Math.random() * 10) + 543);
                  var rand4=Math.floor((Math.random() * 10000) + 54.3);
                  rand=(rand1*rand2*rand3)/rand4;
                  host=req.get('host');
                  link="http://"+req.get('host')+"/verifymanager?id="+rand;

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
                     to:email,
                     subject: "verify",
                     html :"Hello,<br> your temporary password is "+password+" </br> you can also change your password.</br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
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
                            var hmanager=new models.HManager(
                               {
                                 fullname:fullname,
                                 address:address,
                                 contact:contact,
                                 email:email,
                                 password:password,
                                 type:type,
                                 rand:rand
                               })
                              hmanager.save();
                            
                          }
                     });


                        	 
                res.end("save");
              }


              else
              {
                      console.log("no man");
                    res.end("no");
              }
          });
	  }















	  if(type==='H_DIRECTOR')
	  {
          models.HDirector.findOne({email:email},function(err,foundlist){
              if(err){console.log("error is there");}
              else if(!foundlist)
              {


              	  var rand1=Math.floor((Math.random() * 100) + 54);
                  var rand2=Math.floor((Math.random() * 1000) + 540);
                  var rand3=Math.floor((Math.random() * 10) + 543);
                  var rand4=Math.floor((Math.random() * 10000) + 54.3);
                  rand=(rand1*rand2*rand3)/rand4;
                   host=req.get('host');
                   link="http://"+req.get('host')+"/verifydirector?id="+rand;

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
                         html : "Hello,<br> your temporary password is "+password+" </br> you can also change your password.</br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
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
                          var hdirector=new models.HDirector(
                            {
                               fullname:fullname,
                               address:address,
                               contact:contact,
                               email:email,
                               password:password,
                               type:type,
                               rand:rand
                            })
                          hdirector.save();
                           
                          }
                     });
              	            
               res.end("save");
              }
              else
              {
                console.log("no man");
                res.end("no");
              }
          });
	  }

	  //res.render("superadmin");
})













router.post('/removeadmin',function(req,res){
  const id=req.body.personid;
  const type=req.body.menu_files;
  console.log(id + " " + type);
})










router.get('/superadmin',function(req,res)
{
  console.log('sdfs');
  sess=req.session;
  if(sess.email)
  {
    models.Customer.find({},function(err,foundlist1)
    {
      if(err){console.log("custm finding error");}
        else
        {
           models.Employee.find({},function(err2,foundlist2)
             {
                if(err2){console.log("custm finding error");}
                 else
                 {
                    models.HDirector.find({},function(err3,foundlist3)
                         {
                           if(err3){console.log("custm finding error");}
                             else
                              {
                                  models.HAdminstrator.find({},function(err4,foundlist4)
                                  {
                                   if(err4){console.log("custm finding error");}
                                   else
                                     {
                                          models.HManager.find({},function(err5,foundlist5)
                                            {
                                              if(err5){console.log("custm finding error");}
                                                else
                                                   {
                                                      res.render("superadmin",{foundlist1,foundlist2,foundlist3,foundlist4,foundlist5});
                                                   }
                                            })
  
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
        res.end('<a href='+'/superadminloginpanel'+'>Login</a>');
    }
})





router.get('/superadminloginpanel',function(req,res)
{

  res.render('superadminloginpanel');
})



router.post('/superadminregist',function(req,res)
{
   const fullname=req.body.fullname;
   const  address=req.body.address;
   const email=req.body.email;
   const contact=req.body.contact;
   const password=req.body.password;
   
    var newsuper=models.Superadmin({
      fullname:fullname,
      address:address,
      email:email,
      contact:contact,
      password:password
    })
    newsuper.save();
    res.render('superadminloginpanel');
    
});










router.post('/superadminlog',function(req,res){
   const email=req.body.email;
  const password=req.body.password;
  sess=req.session;
  
  console.log(email+" " + password);
  models.Superadmin.findOne({email:email},function(err,foundlist){
    if(err){console.log("some error is there");}
    else if(!foundlist){console.log("no such user is there");res.end('oops')}
      else
      {
        
            if(foundlist.password===password)
            {sess.email=req.body.email;
              console.log("matched ");
              res.end("done");
            }
            else
            {
              console.log("wrong")
              res.end("wrong");
            }
        
      }
      res.end("wrong");
  })
})

module.exports=router;