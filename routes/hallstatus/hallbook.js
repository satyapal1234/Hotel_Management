const express = require('express')
const nodemailer=require('nodemailer');
const router = express.Router();
var models = require('/HT-TR/routes/model/db');


router.post('/searchHallAvailabilityBook',function(req,res)
{
   const indate=req.body.indate;
   const button=req.body.button;
   console.log(indate+" "+button);
   sess=req.session;
    models.Hallbook.find({dateofbook:indate,hallname:button},function(err,foundlist)
    {
        if(err){
          console.log('error is');
        }
        else if(foundlist.length!=0)
        {
          res.render("notavailable");
        }
        else
        {
          res.render("bookhall",{email:sess.email,indate,button});
        }
    })
})








router.get('/hallbooksuccess',function(req,res){
    res.render("hallbooksuccess");
})











 var hallfullname=null;
 var hallcontact=null;
 var halladdress=null;
 var hallemail=null;
 var hallindate=null;
 var hallhallname=null;

router.post('/hallbook',function(req,res) {
   const fullname=req.body.fullname;
   const contact=req.body.contact;
   const address=req.body.address;
   const email=req.body.email;
   const indate=req.body.indate;
   const hallname=req.body.hallname;
   const btntyped=req.body.btn;
if(btntyped==='offline')
{
   sess=req.session;
   if(sess.email)
   {
      var newhallbook=models.Hallbook({
        fullname:fullname,
        contact:contact,
        address:address,
        email:email,
        dateofbook:indate,
        hallname:hallname
         })
        newhallbook.save();
        res.render("demo2",{value:1});
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
                         subject: "confirmation",
                         html : "your booking has been successfully placed"
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
                          
                         
                          }
                     });
   }

   else
   {
       res.write('<h1>Please login first.</h1>');
        res.end('<a href='+'/'+'>Login</a>');
   }


}

  if(btntyped==='online')
  {

        hallfullname=fullname;
        hallcontact=contact;
        halladdress=address;
        hallemail=email;
        hallindate=indate;
        hallhallname=hallname;
      Insta.setKeys("e94079733b1bc454c6f80b9fe49892a7","febbce517aadfe67fb04dee8706228ae");
     var data = new Insta.PaymentData();
         data.purpose ="hall booking";
          data.amount=9;
     data.currency                = 'INR';
     data.buyer_name              = fullname
     data.email                   = email;
     data.phone                   = contact;
     data.send_sms                = true
     data.send_email              = true
     data.allow_repeated_payments = false
     //data.webhook                 ="http://localhost:5000/success"
     data.redirect_url            = "http://localhost:3000/successfulpaymentofhall";   
      

    Insta.createPayment(data, function(error, response) {
     if (error) 
       {
         // some error
       } 
       else 
       {
  
       var obj = JSON.parse(response);
       res.redirect(obj.payment_request.longurl);
      console.log(obj.payment_request.longurl);
       }
    });
  }
    
})










router.get('/successfulpaymentofhall',function(req,res){
   if(hallfullname && hallemail && halladdress && hallcontact && hallhallname)
   {
        var newhallbook=models.Hallbook({
        fullname:hallfullname,
        contact:hallcontact,
        address:halladdress,
        email:hallemail,
        dateofbook:hallindate,
        hallname:hallhallname,
        payment_id:req.query.payment_id,
        payment_status:req.query.payment_status
         })
        newhallbook.save();
        hallfullname=null;
        hallemail=null;
        res.render("successfulpaymentofhall"); 
   }
   else
   {
        console.log(req.query.payment_id);
        res.write('<h1>You are not Authorisesd to acceess this page</h1>');
        res.end('<a href='+'/'+'>Go back to Main Page</a>');
   }
})



module.exports=router;