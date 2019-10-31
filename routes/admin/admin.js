const express = require('express')
const nodemailer=require('nodemailer');
const router = express.Router()

var models = require('/HT-TR/routes/model/db');
router.get('/admin',function(req,res)
{
  sess=req.session;
  console.log('admin');
     if(sess.email)
   {
      models.Customer.findOne({email:sess.email},function(err,foundlist)
      {
         if(err){console.log('some error cust');}
         else if(!foundlist)
         {
             //check for emp
              models.Employee.findOne({email:sess.email},function(err,foundlist)
              {
                 if(err){console.log('some error emp');}
                 else if(!foundlist)
                 {
                     models.HManager.findOne({email:sess.email},function(err,foundlist)
                     {
                        if(err){console.log('some error manag');}
                        else if(!foundlist)
                        {
                             models.HDirector.findOne({email:sess.email},function(err,foundlist)
                             {
                                if(err){console.log('some error direct');}
                                else if(!foundlist)
                                {
                                    models.HAdminstrator.findOne({email:sess.email},function(err,foundlist)
                                    {
                                      if(err){console.log('some error adminst');}
                                      else if(!foundlist)
                                      {
                                          models.Superadmin.findOne({email:sess.email},function(err,foundlist){
                                            if(err){console.log('some error');}
                                            else if(!foundlist)
                                            {
                                              console.log('no user exist');

                                            }
                                            else
                                            {
                                               res.render("admin",{ses: "today",foundlist}); 
                                            }
                                         })
                                      }
                                      else
                                      {
                                        res.render("admin",{ses: "today",foundlist});
                                      }
                                    })
                                }
                                else
                                {
                                  res.render("admin",{ses: "today",foundlist});
                                }
                             })
                        }
                        else
                        {
                          res.render("admin",{ses: "today",foundlist});
                        }
                     })
                 }
                 else
                 {
                  res.render("admin",{ses: "today",foundlist});
                 }

              })
         }
         else
         {
          res.render("admin",{ses: "today",foundlist});
         }

      })
     
   }
   else 
   {
       console.log('you are not in session');
       res.render('admin',{ses: "todays"});
    }

})


module.exports=router;