const express=require("express");
const bodyparser=require("body-parser");
const session=require("express-session");
const ejs=require("ejs");
const mongoose=require("mongoose");
const nodemailer=require("nodemailer");
const Insta = require('instamojo-nodejs');
const instamojowebhook = require('instamojo-webhook');
var ebill=require('./routes/ebilling');
//var dirwork=require('./routes/directorwork');

const app=express();
app.set('view engine','ejs');


app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(session({secret: 'sssaaa',saveUninitialized: true,resave: true}));
var instamojoMiddleWare=instamojowebhook({ secretKey: '8441d623797b4db9ba9b88b0ff8c4d67'});

app.use('/',ebill);
//app.use('/',dirwork);

app.use(function(req, res, next)
  { res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'); 
    next(); 
  });


var models = require('./routes/model/db');
mongoose.connect("mongodb://localhost:27017/hotel_tour",{useNewUrlParser:true});




var customer=require('./routes/customer/customer');
var admin=require('./routes/admin/admin');
var adminstrator=require('./routes/admin/adminstrator');
var superadmin=require('./routes/superadmin/superadmin');
var manager=require('./routes/admin/manager');
var hallbook=require('./routes/hallstatus/hallbook');
app.use('/',customer);
app.use('/',admin);
app.use('/',adminstrator);
app.use('/',superadmin);
app.use('/',manager);
app.use('/',hallbook);


var sess,name;
var rand,host,link,mailOptions;


app.get("/logout",function(req,res){
  console.log("ok destroy");
  req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });
})

app.post("/web",instamojoMiddleWare,function(req,res){
  console.log(req.instamojo);
  res.send("hello");
})



app.get('/itemspage',function(req,res){
  sess=req.session;
  if(sess.email)
  {
     res.render("itemspage",{name:sess.name,ses:"todays"}); 
  }
  else
  {
    res.render("itemspage",{ses:"today"});  
  }
 // res.render("itemspage");
})




app.get('/success',function(req,res){
  res.render("success");
})


app.get('/error',function(req,res){
  res.render("error");
})







app.get('/hallbook',function(req,res) {
  sess=req.session;
  if(sess.email)
  {

   res.render('hallbook',{ses: "today",nam:sess.name});
  }
  else
  {
     res.render('hallbook',{ses: "todays"});
  }
  // body...
})





















app.get("/",function(req,res)
{
  sess=req.session;
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
                                               res.render("home",{ses: "today",foundlist}); 
                                            }
                                         })
                                      }
                                      else
                                      {
                                        res.render("home",{ses: "today",foundlist});
                                      }
                                    })
                                }
                                else
                                {
                                  res.render("home",{ses: "today",foundlist});
                                }
                             })
                        }
                        else
                        {
                          res.render("home",{ses: "today",foundlist});
                        }
                     })
                 }
                 else
                 {
                  res.render("home",{ses: "today",foundlist});
                 }

              })
         }
         else
         {
          res.render("home",{ses: "today",foundlist});
         }

      })
     
  }
  else
  {
    console.log('you are not in session');
       res.render("home",{ses: "todays"});
  }
	//res.render("home");
})





















app.get('/firstverify',function(req,res)
{
   res.render("firstverify");
})


















app.post("/employeelogin",function(req,res)
{
  const email=req.body.email;
  const password=req.body.password;
  console.log(email);
  sess=req.session;
  //sess.email=req.body.email;
  models.Employee.findOne({email:email},function(err,foundlist){
    if(err)
    {
      console.log("some error");
    }
    else if(!foundlist)
    {
      console.log("user doesnt exist");
      res.end('oops');
    }

    else if(foundlist.rand==0)
    {
      if(foundlist.password===password)
            { sess.email=req.body.email;
              sess.name=foundlist.fullname;
              res.end('done');}
          else
          {
            console.log("wrong password");
         res.end("wrong");
          }
    }
    else
    {
      console.log("first verify acount");
      res.end("verify");
    }
  })
})









































































app.get('/directorwork',function(req,res)
{
  sess=req.session;
  if(sess.email)
  {
    models.HDirector.findOne({email:sess.email},function(err,foundlist)
    {
       if(err){console.log('error in get director');}
       else if(!foundlist)
       {
           res.write('<h1>Hey You are not Authorisesd to get this.</h1>');
           res.end('<a href='+'/admin'+'>Login</a>');
       }
       else
       {
        models.BookedRoomOfCity.find({},function(err2,foundlist1)
        {
           if(err2){console.log('error in bookedroomofcity');}
           else
           {
              res.render("directorwork",{ses:"todays",foundlist,foundlist1});
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






















app.get('/bookingpage',function(req,res){
   sess=req.session;
   console.log(sess.email);
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
                                               res.render("bookingpage",{ses: "today",foundlist}); 
                                            }
                                         })
                                          //res.end('oops');
                                      }
                                      else
                                      {
                                        res.render("bookingpage",{ses: "today",foundlist});
                                      }
                                    })
                                }
                                else
                                {
                                  res.render("bookingpage",{ses: "today",foundlist});
                                }
                             })
                        }
                        else
                        {
                          res.render("bookingpage",{ses: "today",foundlist});
                        }
                     })
                 }
                 else
                 {
                  res.render("bookingpage",{ses: "today",foundlist});
                 }

              })
         }
         else
         {
          res.render("bookingpage",{ses: "today",foundlist});
         }

      })
     
   }
   else 
    {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href='+'/'+'>Login</a>');
    }

   
})








//CUSTOMER LOGIN















//EMPLOYEE LOGIN



























//ADMIN PANEL




app.post('/directorlogin',function(req,res)
{
	 const email=req.body.email;
  const password=req.body.password;
  sess=req.session;
  //sess.email=req.body.email;
  console.log(email+" " + password);
  models.HDirector.findOne({email:email},function(err,foundlist){
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





























































//SUPERADMMIN PAGE








//CUSTOMER REGISTRATION PAGE





//TABLE AND ROOM


//CHECK AVAILABILABILTY $or:[ {arrivaldate: { $gt: arrivaldate2},arrivaldate:{$gte:departuredate}}, {departuredate:{$lte:arrivaldate2},departuredate:{$lt:departuredate2}},  ]

  app.post('/checkroom',function(req,res){
    const arrivaldate2=req.body.arrivaldate2;
    const departuredate2=req.body.departuredate2;
    const type=req.body.menu_options1;
    const shift=req.body.menu_options2;
    console.log(arrivaldate2+" "+departuredate2+" "+type+" "+shift);
    var t=new Date();
    var t1=new Date(t);
    
 //   console.log(new Date(t1));
   // console.log(new Date(arrivaldate2).toLocaleDateString() +" "+t1);
   //t1=new Date(t1).toLocaleDateString();
   var t2= new Date(arrivaldate2)
   var t3= new Date(departuredate2)
    // console.log(t2)
    // console.log(t3)
    console.log(t2.getTime()>t1.getTime());
    console.log(t3.getTime()>t1.getTime());
     if( arrivaldate2>departuredate2  ||t2.getTime()<t1.getTime() || t3.getTime()<t1.getTime())
     {
        res.write('<h1>Check the date.It is not Correct</h1>');
        res.end('<a href='+'/bookingpage'+'>Back</a>');
     }
     else{
     var count1=0;
     var count2=0;
     models.Bedbook.find({ $or:[{arrivaldate:{$gte:arrivaldate2,$lte:departuredate2}},{arrivaldate:{$lte:arrivaldate2},departuredate:{$gte:departuredate2}},{departuredate:{$gte:arrivaldate2,$lte:departuredate2}}],typeofbed:type},function(err,foundlist)
     {
       if(err){console.log(err);}
       else if(foundlist.length==0)//space is available
       {
           console.log('satyapal');
           models.Bed.findOne({},function(err,foundlist1){
             if(type==='double_bed_ac')
             {
                count2=foundlist1.noofdoublebedac;  
                res.render("showbeddata",{c:count2,t:0,type:"double_bed_ac"});
             }
             else if(type==='four_bed_ac')
             {
               count2=foundlist1.nooffourbedac;
                res.render("showbeddata",{c:count2,t:1,type:"four_bed_ac"});
             }
             else if(type==='single_bed_ac')
             {
                count2=foundlist1.noofsinglebedac;
                res.render("showbeddata",{c:count2,t:2,type:"single_bed_ac"});
             }
             else if(type==='double_bed_nonac')
             {
                 count2=foundlist1.noofdoublebednonac;
                 res.render("showbeddata",{c:count2,t:3,type:"double_bed_nonac"});
             }
             else if(type==='single_bed_nonac')
             {
                 count2=foundlist1.noofsinglebednonac;
                 res.render("showbeddata",{c:count2,t:4,type:"single_bed_nonac"});
             }
             else if(type==='four_bed_nonac')
             {
                count2=foundlist1.nooffourbednonac;
                res.render("showbeddata",{c:count2,t:5,type:"four_bed_nonac"});
             }
           })
       }
       else   //date falls in between booked date
       {
           count1=foundlist.length;
           console.log(count1);
            models.Bed.findOne({},function(err,foundlist2){
             if(err){console.log('errror');}
             else
             {
              if(type==='double_bed_ac')
             {
                count2=foundlist2.noofdoublebedac;  
                console.log(count2);
                console.log(count1);
                if(count2-count1>0)
                {res.render("showbeddata",{c:count2-count1,t:0,type:"double_bed_ac"});}
                else
                  res.send("no more available");
             }
             else if(type==='four_bed_ac')
             {
                 count2=foundlist2.nooffourbedac; 
                if(count2-count1>0)
                {res.render("showbeddata",{c:count2-count1,t:1,type:"four_bed_ac"});}
                else
                  res.send("no more available");
             }
             else if(type==='single_bed_ac')
             {
                 count2=foundlist2.noofsinglebedac; 
                if(count2-count1>0)
                {res.render("showbeddata",{c:count2-count1,t:2,type:"single_bed_ac"});}
                else
                  res.send("no more available");
             }
             else if(type==='double_bed_nonac')
             {
                  count2=foundlist2.noofdoublebednonac; 
                 if(count2-count1>0)
                {res.render("showbeddata",{c:count2-count1,t:3,type:"double_bed_nonac"});}
                else
                  res.send("no more available");
             }
             else if(type==='single_bed_nonac')
             {

                count2=foundlist2.noofsinglebednonac; 
                if(count2-count1>0)
                {res.render("showbeddata",{c:count2-count1,t:4,type:"single_bed_nonac"});}
                else
                  res.send("no more available");
             }
             else if(type==='four_bed_nonac')
             {   
                  count2=foundlist2.nooffourbednonac; 
                if(count2-count1>0)
                {res.render("showbeddata",{c:count2-count1,t:5,type:"four_bed_nonac"});}
                else
                  res.send("no more available");
             }
             }
           })

       }
     })

}
  })









  app.post('/checktable',function(req,res){
     const arrivaldate=req.body.arrivaldate;
     const arrivaltime=req.body.arrivaltime;
     const type=req.body.menu_options;
     var count=0;
     var count1=0;
     console.log(arrivaldate+" "+arrivaltime+ " "+type);
     models.Tablebook.find({arrivaldate:arrivaldate,arrivaltime:arrivaltime,typeoftable:type},function(err,foundlist1)
     {
      if(err){console.log('there is some error');}
       else 
       {
          count=foundlist1.length;
          console.log(count);
           models.Table.findOne({},function(err,foundlist){
          if(err){console.log('there might be some error');}
           else 
          {
            if(type==='Double_Sitter_Table')
            {
             count1=foundlist.nooftwosittertableac;
             console.log(count1);
             res.render("showtabledata",{c:count1-count,t:0,type:"Double_Sitter_Table"});
            } 
            else if(type==='Four_Sitter_Table')
            {
              count1=foundlist.nooffoursittertableac;
             console.log(count1);
             res.render("showtabledata",{c:count1-count,t:1,type:"Four_Sitter_Table"});

            } 
            else if(type==='Eight_Sitter_Table')
            {
              count1=foundlist.noofeightsittertableac;
             console.log(count1);
             res.render("showtabledata",{c:count1-count,t:2,type:"Eight_Sitter_Table"});
            }
       }
     })
       }
     })
     

     console.log(count+" "+count1);
    // res.render("error");
  })

  

//VERIFICATION OF EMAIL
















app.get('/verifyemployee',function(req,res){
console.log(req.protocol+":/"+req.get('host'));
if((req.protocol+"://"+req.get('host'))==("http://"+host))
{
     console.log("Domain is matched. Information is from Authentic email");
      var verifyid;
   
   
       // console.log("email is verified");
        models.Employee.findOneAndUpdate({rand:req.query.id},{ rand:0},function(err,foundlist)
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







app.get('/verifydirector',function(req,res){
console.log(req.protocol+":/"+req.get('host'));
if((req.protocol+"://"+req.get('host'))==("http://"+host))
{
    console.log("Domain is matched. Information is from Authentic email");
      var verifyid;
   
   
       // console.log("email is verified");
        models.HDirector.findOneAndUpdate({rand:req.query.id},{ rand:0},function(err,foundlist)
        {
          if(err)
         console.log("err");
          else if(!foundlist)
            {
             res.end("<h1>Email has been verified already");
             console.log("email is verified  already");
           }
          else
            console.log("updated");
            console.log(foundlist.email);
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







//payment system

app.get('/congrats_offline_book',function(req,res)
{
  res.render("congrats_offline_book")
})
var buyername;
var phoneno;
var arrivingdate;
var arrivingtime;
var mode;
var itemname;

app.get('/successfulpayment',function(req,res)
{

  if(buyername && phoneno && arrivingdate && arrivingtime && mode && itemname && req.query.payment_id && req.query.payment_request_id && req.query.payment_status)
    { var newtablebook=models.Tablebook({
         fullname:buyername,
         contact:phoneno,
         arrivaldate:arrivingdate,
         arrivaltime:arrivingtime,
         typeoftable:itemname,
         mode:mode,
         payment_id:req.query.payment_id,
         payment_status:req.query.payment_status,
       })
       newtablebook.save();

       console.log(req.query.payment_id);
       console.log(req.query.payment_request_id);
       console.log(req.query.payment_status);
  res.render("successfulpayment");
   }

   else
    { 
        console.log(req.query.payment_id);
        res.write('<h1>You are not Authorisesd to acceess this page</h1>');
        res.end('<a href='+'/'+'>Go back to Main Page</a>');
    }
})


app.post('/bookyourtable',function(req,res)
{
    const fullname=req.body.fullname;
    const contact=req.body.contact;
    const arrivaldate=req.body.arrivaldate;
    const arrivaltime=req.body.arrivaltime;
    const modeofpayment=req.body.radio;
    const type=req.body.hiddendata;

 
    console.log(fullname+" "+contact+" "+ arrivaldate +" "+ arrivaltime +" "+modeofpayment+" "+ type);
    if(modeofpayment==="cash_on_location")
    {
       var newtablebook=models.Tablebook({
         fullname:fullname,
         contact:contact,
         arrivaldate:arrivaldate,
         arrivaltime:arrivaltime,
         typeoftable:type,
         mode:modeofpayment
       })
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
                         to: sess.email,
                         subject: "booking in hotel",
                         html : "Hello,<br> Congrats your seat has been booked for the hotel xyz"
                    };
                     var t;
                    transporter.sendMail(mailOptions, function(error, info)
                    {
                       if (error)
                        {
                          console.log('kya kru');
                          //return res.status(500).send({ msg: err.message });
                           t=1; 
                          console.log(error);
                          res.end('error');
                        } 
                        else 
                        {  
                          t=0;
                          console.log('Email sent: ' + info.response);

                        }
                     });

       newtablebook.save();
       res.render('demo',{value:1});
    }


    app.post("/",instamojoMiddleWare,function(req,res){
 // console.log(req.instamojo);
  if(req.instamojo.webhookStatus === true)
  {
      console.log(req.instamojo);
      res.send("hello");
  }
  
})

    if(modeofpayment==="Online_payment")
    {
   buyername=fullname;
   phoneno=contact;
   arrivingdate=arrivaldate;
   arrivingtime=arrivaltime;
   mode=modeofpayment;
   itemname=type;
      Insta.setKeys("e94079733b1bc454c6f80b9fe49892a7","febbce517aadfe67fb04dee8706228ae");
     var data = new Insta.PaymentData();
    data.purpose = type  ;       // REQUIRED
     if(type==='Double_Sitter_Table')
        {data.amount = 9;}
      else if(type==='Eight_Sitter_Table')
      {
        data.amount=10;
      }
      else if(type==='Four_Sitter_Table')
        {data.amount=11;}
    data.currency                = 'INR';
    data.buyer_name              = fullname
    data.email                   = sess.email;
    data.phone                   = contact;
    data.send_sms                = true
    data.send_email              = true
    data.allow_repeated_payments = false
   // data.webhook ="http://localhost:3000"  

    data.redirect_url            = "http://localhost:3000/successfulpayment";  

     Insta.createPayment(data, function(error, response) {
    if (error) {
    // some error
     } else {
  
    var obj = JSON.parse(response);
    res.redirect(obj.payment_request.longurl);
    console.log(response);
     }
    });


     Insta.seeAllLinks(function(error, response) {
  if (error) {
    // Some error
  } else {
    console.log(response);
  }
});

     app.post('/rasta',function(req,res)
     {
       console.log(res);
     })
    }

})




app.post('/finaldetailofpaymentoftable',function(req,res)
{  
  sess=req.session;
  console.log(req.body.button);
  const type=req.body.button;
  if(sess.email)
  {
     res.render("finaldetailofpaymentoftable",{type:type});
  }
  else
  {
      res.write('<h1>Please login first.</h1>');
        res.end('<a href='+'/admin'+'>Login</a>');
  }

})






var buyername2;
var contact2;
var checkindate2;
var checkoutdate2;
var mode2;
var itemname2;


app.get('/successfulpaymentofbed',function(req,res){
  console.log(buyername2);
  if(buyername2 &&contact2 &&checkoutdate2  &&checkindate2 && req.query.payment_id &&req.query.payment_status && mode2&& itemname2)
  {
     var newbedbook=models.Bedbook({
          fullname:buyername2,
         contact:contact2,
         arrivaldate:checkindate2,
         departuredate:checkoutdate2,
         mode:mode2,
         typeofbed:itemname2,
         payment_id:req.query.payment_id,
         payment_status:req.query.payment_status   
     })
     newbedbook.save();
      res.render("successfulpaymentofbed");
   }

   else
    { 
        console.log(req.query.payment_id);
        res.write('<h1>You are not Authorisesd to acceess this page</h1>');
        res.end('<a href='+'/'+'>Go back to Main Page</a>');
    }
    
})





app.post('/finaldetailofpaymentofbed',function(req,res)
{
  sess=req.session;
  const type=req.body.button;
  if(sess.email)
  {
     res.render("finaldetailofpaymentofbed",{type:type});
  }
  else
  {
      res.write('<h1>Please login first.</h1>');
        res.end('<a href='+'/admin'+'>Login</a>');
  }

})








app.post('/bookyourbed',function(req,res)
{
  const fullname=req.body.fullname;
  const contact=req.body.contact;
  const checkindate=req.body.checkindate;
  const checkoutdate=req.body.checkoutdate;
  const modeofpayment=req.body.radio;
  const type=req.body.hiddendata;

  if(modeofpayment==='cash_on_location')
  {
       var newbedbook=models.Bedbook({
         fullname:fullname,
         contact:contact,
         arrivaldate:checkindate,
         departuredate:checkoutdate,
         mode:modeofpayment,
         typeofbed:type
         
       })

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
                         to: sess.email,
                         subject: "booking in hotel",
                         html : "Hello,<br> Congrats your seat has been booked for the hotel xyz"
                    };
                     var t;
                    transporter.sendMail(mailOptions, function(error, info)
                    {
                       if (error)
                        {
                          console.log('kya kru');
                          //return res.status(500).send({ msg: err.message });
                           t=1; 
                          console.log(error);
                          res.end('error');
                        } 
                        else 
                        {  
                          t=0;
                          console.log('Email sent: ' + info.response);

                        }
                     });
       newbedbook.save();
       res.render('demo',{value:1});
  }

  if(modeofpayment==='Online_payment')
  {

      
     buyername2=fullname;
     contact2=contact;
     checkindate2=checkindate;
     checkoutdate2=checkoutdate;
     mode2=modeofpayment;
     itemname2=type;


       Insta.setKeys("e94079733b1bc454c6f80b9fe49892a7","febbce517aadfe67fb04dee8706228ae");

     var data = new Insta.PaymentData();
     data.purpose = type;            // REQUIRED
      if(type==='single_bed_ac')
      {
        data.amount = 9;
      }

      else if(type==='double_bed_ac')
      {
        data.amount=10;
      }
      else if(type==='four_bed_ac')
      {
        data.amount=11;
      }
      else if(type==='single_bed_nonac')
      {
        data.amount=12;
      }
      else if(type==='double_bed_nonac')
      {
        data.amount=13;
      }
      else if(type==='four_bed_nonac')
      {
        data.amount=14;
      }
     
     data.currency                = 'INR';
     data.buyer_name              = fullname
     data.email                   = sess.email;
     data.phone                   = contact;
     data.send_sms                = true
     data.send_email              = true
     data.allow_repeated_payments = false
     //data.webhook                 ="http://localhost:5000/success"
     data.redirect_url            = "http://localhost:3000/successfulpaymentofbed";   


  Insta.createPayment(data, function(error, response) {
  if (error) {
    // some error
   } else {
  
    var obj = JSON.parse(response);
    res.redirect(obj.payment_request.longurl);
    console.log(obj.payment_request.longurl);
    }
});

  }



})

















//SEARCH BY PLACE

app.post('/searchbyplace',function(req,res)
{
  const checkindate=req.body.checkindate;
  const checkoutdate=req.body.checkoutdate;
  const location=req.body.select_menu;
  sess=req.session;

      var t=new Date();
    var t1=new Date(t);
   var t2= new Date(checkindate)
   var t3= new Date(checkoutdate)
    // console.log(t2.getTime());
    // console.log(t3)
    var checkin=new Date(checkindate).toLocaleDateString('en-US', {timeZone: 'UTC'});
    var checkout=new Date(checkoutdate).toLocaleDateString('en-US', {timeZone: 'UTC'});
     //var t1=today.toLocaleDateString()

    console.log(t2.getTime()>t1.getTime());
    console.log(t3.getTime()>t1.getTime());
     if( checkindate>checkoutdate  ||t2.getTime()<t1.getTime() || t3.getTime()<t1.getTime())
     {
        res.write('<h1>Check the date.It is not Correct</h1>');
        res.end('<a href='+'/'+'>Back</a>');
     } 

   else
    {  // var checkin=new Date(checkindate);
    	//var checkout=new Date(checkoutdate)
	  //checkindate=checkin.toLocaleDateString();
     // checkoutdate=checkout.toLocaleDateString();
     if(sess.email)
      {
       res.render("view_room_detail_by_place",{loc:location,ses:"today",name:sess.name,checkindate:checkin,checkoutdate:checkout,value:100});
      }
     else
      {
        res.render("view_room_detail_by_place",{loc:location,ses:"todays",checkoutdate:checkout,checkindate:checkin,value:100});
      }

   }

})





















app.post("/filterRoom",function(req,res){
 // console.log(req.body);
 const checkindate=req.body.checkindate;
 console.log(checkindate);
 const checkoutdate=req.body.checkoutdate;
 const location=req.body.location;
 const type=req.body.check;

     if(location==="varanasi")
     {
        models.Hotelvaranasione.find({ $or:[{arrivaldate:{$gte:checkindate,$lte:checkoutdate}},{arrivaldate:{$lte:checkindate},departuredate:{$gte:checkoutdate}},{departuredate:{$gte:checkindate,$lte:checkoutdate}}],typeofroom:type},function(err,foundlist1){
            if(err){console.log("there might be some error1");}
            else
            {
                 models.Hotelvaranasitwo.find({ $or:[{arrivaldate:{$gte:checkindate,$lte:checkoutdate}},{arrivaldate:{$lte:checkindate},departuredate:{$gte:checkoutdate}},{departuredate:{$gte:checkindate,$lte:checkoutdate}}],typeofroom:type},function(err2,foundlist2){
                    if(err2){console.log("there might bbe some error2");}
                      else
                      {
                          models.Hotelvaranasithree.find({ $or:[{arrivaldate:{$gte:checkindate,$lte:checkoutdate}},{arrivaldate:{$lte:checkindate},departuredate:{$gte:checkoutdate}},{departuredate:{$gte:checkindate,$lte:checkoutdate}}],typeofroom:type},function(err3,foundlist3){
                             if(err3){console.log('there might be some error3');}
                              else
                              {
                                  models.Hotelvaranasifour.find({ $or:[{arrivaldate:{$gte:checkindate,$lte:checkoutdate}},{arrivaldate:{$lte:checkindate},departuredate:{$gte:checkoutdate}},{departuredate:{$gte:checkindate,$lte:checkoutdate}}],typeofroom:type},function(err4,foundlist4){
                                     if(err4){console.log('there might be some error4');}
                                     else
                                     {
                                        res.render("view_room_detail_by_place",{foundlist1,foundlist2,foundlist3,foundlist4,value:99,loc:location,checkindate:checkindate,checkoutdate:checkoutdate,typeofroom:type})
                                     }

                                  })
                              }
                          })
                      }
                 })
            }

        })
     }




     if(location==="patna")
     {
        models.Hotelpatnaone.find({ $or:[{arrivaldate:{$gte:checkindate,$lte:checkoutdate}},{arrivaldate:{$lte:checkindate},departuredate:{$gte:checkoutdate}},{departuredate:{$gte:checkindate,$lte:checkoutdate}}],typeofroom:type},function(err,foundlist1){
            if(err){console.log("there might be some error1");}
            else
            {
                 models.Hotelpatnatwo.find({ $or:[{arrivaldate:{$gte:checkindate,$lte:checkoutdate}},{arrivaldate:{$lte:checkindate},departuredate:{$gte:checkoutdate}},{departuredate:{$gte:checkindate,$lte:checkoutdate}}],typeofroom:type},function(err2,foundlist2){
                    if(err2){console.log("there might bbe some error2");}
                      else
                      {
                          models.Hotelpatnathree.find({ $or:[{arrivaldate:{$gte:checkindate,$lte:checkoutdate}},{arrivaldate:{$lte:checkindate},departuredate:{$gte:checkoutdate}},{departuredate:{$gte:checkindate,$lte:checkoutdate}}],typeofroom:type},function(err3,foundlist3){
                             if(err3){console.log('there might be some error3');}
                              else
                              {
                                 
                                        res.render("view_room_detail_by_place",{foundlist1,foundlist2,foundlist3,value:99,loc:location,checkindate:checkindate,checkoutdate:checkoutdate,typeofroom:type})
                                  
                              }
                          })
                      }
                 })
            }

        })
     }




     if(location==="ranchi")
     {
        models.Hotelranchione.find({ $or:[{arrivaldate:{$gte:checkindate,$lte:checkoutdate}},{arrivaldate:{$lte:checkindate},departuredate:{$gte:checkoutdate}},{departuredate:{$gte:checkindate,$lte:checkoutdate}}],typeofroom:type},function(err,foundlist1){
            if(err){console.log("there might be some error1");}
            else
            {
                 models.Hotelranchitwo.find({ $or:[{arrivaldate:{$gte:checkindate,$lte:checkoutdate}},{arrivaldate:{$lte:checkindate},departuredate:{$gte:checkoutdate}},{departuredate:{$gte:checkindate,$lte:checkoutdate}}],typeofroom:type},function(err2,foundlist2){
                    if(err2){console.log("there might bbe some error2");}
                      else
                      {
                         res.render("view_room_detail_by_place",{foundlist1,foundlist2,value:99,loc:location,checkindate:checkindate,checkoutdate:checkoutdate,typeofroom:type})
                          
                      }
                 })
            }

        })
     }
})



















app.post("/booknow",function(req,res)
{
  const typeofroom=req.body.typeofroom;
  const checkindate=req.body.checkindate;
  const checkoutdate=req.body.checkoutdate;
  const location=req.body.location;
  const nameofhotel=req.body.nameofhotel;
  
   console.log(typeofroom+" "+ checkindate+" " + checkoutdate + " "+ location +" "+ nameofhotel);
  res.render("booknow",{typeofroom:typeofroom,checkindate:checkindate,checkoutdate:checkoutdate
    ,location:location,nameofhotel:nameofhotel});
})
















  var fullname1;
  var contact1;
  var email1;
  var typeofroom1;
  var checkindate1;
  var location1;
  var nameofhotel1;
  var modeofpayment1;

app.post("/finaldetail",function(req,res)
{

  const fullname=req.body.fullname;
  const contact=req.body.contact;
  const email=req.body.email;
  const typeofroom=req.body.typeofroom;
  const checkindate=req.body.checkindate;
  const checkoutdate=req.body.checkoutdate;
  const location=req.body.location;
  const nameofhotel=req.body.nameofhotel;
  const modeofpayment=req.body.radio;
  console.log(typeofroom+" "+ checkindate+" " + checkoutdate + " "+ location +" "+ nameofhotel);
   sess=req.session;
  if(sess.email)
  {

            if(modeofpayment==='cash_on_location')
            {
               var newdatas=models.BookedRoomOfCity({
                     fullname:fullname,
                     contact:contact,
                     email:email,
                     arrivaldate:checkindate,
                     departuredate:checkoutdate,
                     typeofroom:typeofroom,
                     mode:modeofpayment,
                     
                     location:location,
                     hotelname:nameofhotel
                 })

                 newdatas.save();

                 var transporter = nodemailer.createTransport(
                    {
                         service: 'gmail',
                         auth: {
                                 user: 'jeesatyapal@gmail.com',
                                 pass: 770605441956
                                }
                      });

                       mailOptions = 
                      {
                           from: 'jeesatyapal@gmail.com',
                           to: email,
                           subject: "booking in hotel",
                           html : "Hello,<br> Congrats your seat has been booked for the hotel "+nameofhotel+"."
                      };
                       var t;
                      transporter.sendMail(mailOptions, function(error, info)
                      {
                         if (error)
                          {
                            console.log('kya kru');
                            //return res.status(500).send({ msg: err.message });
                             t=1; 
                            console.log(error);
                            res.end('error');
                          } 
                          else 
                          {  
                            t=0;
                            console.log('Email sent: ' + info.response);

                          }
                       });

        if(location==='varanasi')
        {
             if(nameofhotel==='HotelVaranasiOne')
             {
                 var newdata=models.Hotelvaranasione({
                     fullname:fullname,
                     contact:contact,
                     email:email,
                     arrivaldate:checkindate,
                     departuredate:checkoutdate,
                     typeofroom:typeofroom,
                     mode:modeofpayment,
                     
                     location:location,
                     hotelname:nameofhotel
                 })

                 newdata.save()
             }

             if(nameofhotel==='HotelVaranasiTwo')
             {
                 var newdata=models.Hotelvaranasitwo({
                     fullname:fullname,
                     contact:contact,
                     email:email,
                     arrivaldate:checkindate,
                     departuredate:checkoutdate,
                     typeofroom:typeofroom,
                     mode:modeofpayment,
                     
                     location:location,
                     hotelname:nameofhotel
                 })

                 newdata.save()
             }

             if(nameofhotel==='HotelVaranasiThree')
             {
                var newdata=models.Hotelvaranasithree({
                     fullname:fullname,
                     contact:contact,
                     email:email,
                     arrivaldate:checkindate,
                     departuredate:checkoutdate,
                     typeofroom:typeofroom,
                     mode:modeofpayment,
                     
                     location:location,
                     hotelname:nameofhotel
                 })

                 newdata.save()
             }

             if(nameofhotel==='HotelVaranasiFour')
             {
                 var newdata=models.Hotelvaranasifour({
                     fullname:fullname,
                     contact:contact,
                     email:email,
                     arrivaldate:checkindate,
                     departuredate:checkoutdate,
                     typeofroom:typeofroom,
                     mode:modeofpayment,
                     
                     location:location,
                     hotelname:nameofhotel
                 })

                 newdata.save()
             }


             res.render('demo',{value:1});
        }





        if(location==='patna')
        {
            if(nameofhotel==='HotelPatnaOne')
            {
               var newdata=models.Hotelpatnaone({
                     fullname:fullname,
                     contact:contact,
                     email:email,
                     arrivaldate:checkindate,
                     departuredate:checkoutdate,
                     typeofroom:typeofroom,
                     mode:modeofpayment,
                     
                     location:location,
                     hotelname:nameofhotel
                 })

                 newdata.save()
            }

            if(nameofhotel==='HotelPatnaTwo')
            {
                 var newdata=models.Hotelpatnatwo({
                     fullname:fullname,
                     contact:contact,
                     email:email,
                     arrivaldate:checkindate,
                     departuredate:checkoutdate,
                     typeofroom:typeofroom,
                     mode:modeofpayment,
                     location:location,
                     hotelname:nameofhotel
                 })

                 newdata.save()
            }


            if(nameofhotel==='HotelPatnaThree')
            {
                 var newdata=models.Hotelpatnathree({
                     fullname:fullname,
                     contact:contact,
                     email:email,
                     arrivaldate:checkindate,
                     departuredate:checkoutdate,
                     typeofroom:typeofroom,
                     mode:modeofpayment, 
                     location:location,
                     hotelname:nameofhotel
                 })

                 newdata.save()
            }

            res.render('demo',{value:1});
        }

        if(location==='ranchi')
        {
           if(nameofhotel==='HotelRanchiOne')
           {console.log('sim');
                var newdata=models.Hotelranchione({
                     fullname:fullname,
                     contact:contact,
                     email:email,
                     arrivaldate:checkindate,
                     departuredate:checkoutdate,
                     typeofroom:typeofroom,
                     mode:modeofpayment, 
                     location:location,
                     hotelname:nameofhotel
                 })

                 newdata.save()
           }


           if(nameofhotel==='HotelRanchiTwo')
           {
               var newdata=models.Hotelranchitwo({
                     fullname:fullname,
                     contact:contact,
                     email:email,
                     arrivaldate:checkindate,
                     departuredate:checkoutdate,
                     typeofroom:typeofroom,
                     mode:modeofpayment, 
                     location:location,
                     hotelname:nameofhotel
                 })

                 newdata.save()
           }

           res.render('demo',{value:1});
        }
    }









            if(modeofpayment==='Online_payment')
            {

                fullname1=fullname;
                contact1=contact;
                email1=email;
                typeofroom1=typeofroom;
                checkindate1=checkindate;
                checkoutdate1=checkoutdate;
                location1=location;
                nameofhotel1=nameofhotel;
                modeofpayment1=modeofpayment;
                Insta.setKeys("e94079733b1bc454c6f80b9fe49892a7","febbce517aadfe67fb04dee8706228ae");
               var data = new Insta.PaymentData();
                   data.purpose = typeofroom;
               if(typeofroom==='Double bed AC Room')
               {
                 data.amount=9
               }

                if(typeofroom==='Single bed AC Room')
               {
                  data.amount=10;

               }

                if(typeofroom==='Four bed AC Room')
               {
                  data.amount=11;
               }

               data.currency                = 'INR';
               data.buyer_name              = fullname
               data.email                   = email;
               data.phone                   = contact;
               data.send_sms                = true
               data.send_email              = true
               data.allow_repeated_payments = false
               //data.webhook                 ="http://localhost:5000/success"
               data.redirect_url            = "http://localhost:3000/successfulpaymentofRoomInCity";   
                

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

    }
    else
    {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href='+'/'+'>Login</a>');
    }        
})
















app.get("/successfulpaymentofRoomInCity",function(req,res)
{
   if(fullname1 && contact1 && email1 && checkoutdate1 && checkoutdate1 && typeofroom1 && nameofhotel1 && modeofpayment1  
     && location1 && req.query.payment_id && req.query.payment_status)
   {


           var newdatas=models.BookedRoomOfCity({
                   fullname:fullname1,
                   contact:contact1,
                   email:email1,
                   arrivaldate:checkindate1,
                   departuredate:checkoutdate1,
                   typeofroom:typeofroom1,
                   mode:modeofpayment1,
                   
                   location:location1,
                   hotelname:nameofhotel1,
                   payment_id:req.query.payment_id,
                   payment_status:req.query.payment_status
               })

               newdatas.save()

        if(location1==='varanasi')
      {

             

           if(nameofhotel1==='HotelVaranasiOne')
           {
               var newdata=models.Hotelvaranasione({
                   fullname:fullname1,
                   contact:contact1,
                   arrivaldate:checkindate1,
                   departuredate:checkoutdate1,
                   typeofroom:typeofroom1,
                   mode:modeofpayment1,
                   
                   location:location1,
                   hotelname:nameofhotel1,
                   payment_id:req.query.payment_id,
                   payment_status:req.query.payment_status 
               })

               newdata.save()
           }

           if(nameofhotel1==='HotelVaranasiTwo')
           {
               var newdata=models.Hotelvaranasitwo({
                   fullname:fullname1,
                   contact:contact1,
                   arrivaldate:checkindate1,
                   departuredate:checkoutdate1,
                   typeofroom:typeofroom1,
                   mode:modeofpayment1,
                   
                   location:location1,
                   hotelname:nameofhotel1,
                   payment_id:req.query.payment_id,
                   payment_status:req.query.payment_status 
               })

               newdata.save()
           }

           if(nameofhotel1==='HotelVaranasiThree')
           {
              var newdata=models.Hotelvaranasithree({
                   fullname:fullname1,
                   contact:contact1,
                   arrivaldate:checkindate1,
                   departuredate:checkoutdate1,
                   typeofroom:typeofroom1,
                   mode:modeofpayment1,
                   
                   location:location1,
                   hotelname:nameofhotel1,
                   payment_id:req.query.payment_id,
                   payment_status:req.query.payment_status 
               })

               newdata.save()
           }

           if(nameofhotel1==='HotelVaranasiFour')
           {
               var newdata=models.Hotelvaranasifour({
                   fullname:fullname1,
                   contact:contact1,
                   arrivaldate:checkindate1,
                   departuredate:checkoutdate1,
                   typeofroom:typeofroom1,
                   mode:modeofpayment1,
                   
                   location:location1,
                   hotelname:nameofhotel1,
                   payment_id:req.query.payment_id,
                   payment_status:req.query.payment_status 
               })

               newdata.save()
           }


           res.render('successfulpaymentofRoomInCity');
      }





      if(location1==='patna')
      {
          if(nameofhotel1==='HotelPatnaOne')
          {
             var newdata=models.Hotelpatnaone({
                   fullname:fullname1,
                   contact:contact1,
                   arrivaldate:checkindate1,
                   departuredate:checkoutdate1,
                   typeofroom:typeofroom1,
                   mode:modeofpayment1,
                   
                   location:location1,
                   hotelname:nameofhotel1,
                   payment_id:req.query.payment_id,
                   payment_status:req.query.payment_status 
               })

               newdata.save()
          }

          if(nameofhotel1==='HotelPatnaTwo')
          {
               var newdata=models.Hotelpatnatwo({
                   fullname:fullname1,
                   contact:contact1,
                   arrivaldate:checkindate1,
                   departuredate:checkoutdate1,
                   typeofroom:typeofroom1,
                   mode:modeofpayment1,
                   
                   location:location1,
                   hotelname:nameofhotel1,
                   payment_id:req.query.payment_id,
                   payment_status:req.query.payment_status 
               })

               newdata.save()
          }


          if(nameofhotel1==='HotelPatnaThree')
          {
               var newdata=models.Hotelpatnathree({
                  fullname:fullname1,
                   contact:contact1,
                   arrivaldate:checkindate1,
                   departuredate:checkoutdate1,
                   typeofroom:typeofroom1,
                   mode:modeofpayment1,
                   
                   location:location1,
                   hotelname:nameofhotel1,
                   payment_id:req.query.payment_id,
                   payment_status:req.query.payment_status 
               })

               newdata.save()
          }

          res.render('successfulpaymentofRoomInCity');
      }

      if(location1==='ranchi')
      {
         if(nameofhotel1==='HotelRanchiOne')
         {console.log('sim');
              var newdata=models.Hotelranchione({
                   fullname:fullname1,
                   contact:contact1,
                   arrivaldate:checkindate1,
                   departuredate:checkoutdate1,
                   typeofroom:typeofroom1,
                   mode:modeofpayment1,
                   
                   location:location1,
                   hotelname:nameofhotel1,
                   payment_id:req.query.payment_id,
                   payment_status:req.query.payment_status 
               })

               newdata.save()
         }


         if(nameofhotel1==='HotelRanchiTwo')
         {
             var newdata=models.Hotelranchitwo({
                   fullname:fullname1,
                   contact:contact1,
                   arrivaldate:checkindate1,
                   departuredate:checkoutdate1,
                   typeofroom:typeofroom1,
                   mode:modeofpayment1,
                   
                   location:location1,
                   hotelname:nameofhotel1,
                   payment_id:req.query.payment_id,
                   payment_status:req.query.payment_status 
               })

               newdata.save()
         }

        res.render('successfulpaymentofRoomInCity');
      }
   }



    else
    { 
        console.log(req.query.payment_id);
        res.write('<h1>You are not Authorisesd to acceess this page</h1>');
        res.end('<a href='+'/'+'>Go back to Main Page</a>');
    }

})

































app.listen("3000",function(req,res)
{
	console.log("runninng on port 3000");
})