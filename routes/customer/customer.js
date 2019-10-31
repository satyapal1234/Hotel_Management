const express = require('express')
const nodemailer=require('nodemailer');
const router = express.Router()


var models = require('/HT-TR/routes/model/db');


router.post("/customerlogin",function(req,res)
{
	const email=req.body.email;
	const password=req.body.password;
	console.log(password);
    sess=req.session;
	models.Customer.findOne({email:email},function(err,foundlist){
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
		     {
            sess.email=req.body.email;
            sess.name=foundlist.fullname;
			     res.end("done");
		     }
		     else
		     {
			    console.log("wrong password");
			   res.end("wrong");
		     }
        }
        else
        { console.log("verify acnt");
        	res.end("verify");
        }
		
	})
})












router.post("/customerregister",function(req,res){
	const name=req.body.fullname;
	console.log("slfjsjfljslfjlsflslflsjfljsf");
	const password=req.body.password;
	console.log(password);
	const address=req.body.address;
	//console.log(address);
	const contact=req.body.contact;
	//console.log(contact);
	const email=req.body.email;
	console.log(email);

      if(email===""||name===""||password===""||address===""||password==="")
     {
       console.log("empty");
       res.end('empty');
     }
     else
     {
            console.log("not empty");
         models.Customer.findOne({email:email},function(err,foundlist)
          {
            
             if(err){console.log("there is first error in user_register");}
              else if(!foundlist)
             {   
             	  var rand1=Math.floor((Math.random() * 100) + 54);
                  var rand2=Math.floor((Math.random() * 1000) + 540);
                  var rand3=Math.floor((Math.random() * 10) + 543);
                  var rand4=Math.floor((Math.random() * 10000) + 54.3);
	              rand=(rand1*rand2*rand3)/rand4;
	              host=req.get('host');
                 link="http://"+req.get('host')+"/verify?id="+rand;

                  var transporter = nodemailer.createTransport(
                  {
                       service: 'gmail',
                        auth: {
                               user: 'jeesatyapal@gmail.com',
                               pass: 70041576543
                              }
                    });

                     mailOptions = 
                    {
                         from: 'jeesatyapal@gmail.com',
                         to: email,
                         subject: "verify",
                         html : "Hello,<br> your temporary password is "+password+" </br> you can also change your password.</br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
                    };
                    
                    var t;
                    transporter.sendMail(mailOptions, function(error, info)
                    {
                       if (error)
                        {                          
                          console.log(error);
                          //return res.status(500).send({ msg: err.message });
                           t=1; 
                          console.log('error in sending mail');
                          res.end('error');
                        } 
                        else 
                        {  
                        	t=0;
                          console.log('Email sent: ' + info.response);
                            var newcustomer=models.Customer(
                               {
	                               fullname:name,
	                               address:address,
	                               contact:contact,
	                               email:email,
	                               password:password,
	                               rand:rand
                              })
                              newcustomer.save();
                              console.log("saved");
                              console.log("show");
                              res.end('save');
 
                        }
                     });
                    res.end('save');         
                           
             }
            else
            {
              console.log("sorry");
              res.end("no");
            }
        });	
     }
	

})









router.get('/verify',function(req,res){
console.log(req.protocol+":/"+req.get('host'));
if((req.protocol+"://"+req.get('host'))==("http://"+host))
{
     console.log("Domain is matched. Information is from Authentic email");
      var verifyid;
   
         
       // console.log("email is verified");
        models.Customer.findOneAndUpdate({rand:req.query.id},{ rand:0},function(err,foundlist)
        {
           if(err)
              console.log("err");
           else if(!foundlist)
           {
             res.end("<h1>Email has been verified already");
             console.log("email is verified  already");
           }
          else
            {
              console.log("updated");
            console.log(foundlist.email);
            }
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