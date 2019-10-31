

var models = require('./routes/model/db');
var express=require('express');

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









app.post('/removeemployee',function(req,res){
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





app.post('/addemployee',function(req,res)
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
                               pass: 770605441956
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



