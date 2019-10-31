const express=require("express");
const app1=express.Router();










app1.post('/ebilling',function(req,res){
	console.log(req.body);
  const items=req.body.Name_1;
  const quantity=req.body.Name_2;
 //console.log(items.length);
 //console.log(items[2]);
 // console.log(req.body);
 var price=[];
 var rate=[];
 var subtotal=0;

   for(var i=0;i<items.length;i++)
   {
      if(items[i]==="pizza")
      {
        price[i]=quantity[i]*50;
        subtotal=subtotal+price[i];
        rate[i]=50;
      }
      if(items[i]==="margherita")
      {
        price[i]=quantity[i]*100;
        subtotal=subtotal+price[i];
        rate[i]=100;
      }

      if(items[i]==="buona")
      {
        price[i]=quantity[i]*75;
        subtotal=subtotal+price[i];
        rate[i]=75;
      }

      if(items[i]==="chicken_balty")
      {
        price[i]=quantity[i]*55;
        subtotal=subtotal+price[i];
        rate[i]=55;
      }

       if(items[i]==="chicken_krahi")
      {
        price[i]=quantity[i]*85;
        subtotal=subtotal+price[i];
        rate[i]=85;
      }

      if(items[i]==="pulaw")
      {
        price[i]=quantity[i]*35;
        subtotal=subtotal+price[i];
        rate[i]=35;
      }
      if(items[i]==="dal")
      {
        price[i]=quantity[i]*35;
        subtotal=subtotal+price[i];
        rate[i]=35;
      }

      if(items[i]==="softdrink")
      {
        price[i]=quantity[i]*35;
        subtotal=subtotal+price[i];
        rate[i]=35;
      }

   }
   var tax=(subtotal*18)/100;
   var discount=(subtotal*10)/100;
   var totalamount=subtotal+tax-discount;;
   res.render("pricecalculation",{items,quantity,price,rate,subtotal,tax,totalamount,discount});
})



module.exports=app1;