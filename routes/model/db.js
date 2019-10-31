var mongoose = require('mongoose');

const CustomerSchema=new mongoose.Schema({
	fullname:String,
	address:String,
	contact:Number,
	email:String,
	password:String,
	rand:Number
});


const EmployeeSchema=new mongoose.Schema({
	fullname:String,
	address:String,
	contact:Number,
	email:String,
	password:String,
	rand:Number
});

const HDirectorSchema=new mongoose.Schema({
	fullname:String,
	address:String,
	contact:Number,
	email:String,
	password:String,
	type:String,
	rand:Number
});

const HAdminstratorSchema=new mongoose.Schema({
	fullname:String,
	address:String,
	contact:Number,
	email:String,
	password:String,
	type:String,
	rand:Number
});

const HManagerSchema=new mongoose.Schema({
	fullname:String,
	address:String,
	contact:Number,
	email:String,
	password:String,
	type:String,
	rand:Number
});


const SuperadminSchema=new mongoose.Schema({
  fullname:String,
  address:String,
  contact:Number,
  email:String,
  password:String
  
});


const TableSchema=new mongoose.Schema({
  nooftwosittertableac:Number,
  nooffoursittertableac:Number,
  noofeightsittertableac:Number,
  
   index: { type: Number, default: 0 }

})

const BedSchema=new mongoose.Schema({
  noofsinglebedac:Number,
  noofdoublebedac:Number,
  nooffourbedac:Number,
  noofsinglebednonac:Number,
  noofdoublebednonac:Number,
  nooffourbednonac:Number
})
 
 const RoyalbedSchema=new mongoose.Schema({
  noofroyalroom1:Number,
  noofroyalroom2:Number
 })


const TablebookSchema=new mongoose.Schema({
   fullname:String,
   contact:Number,
   arrivaldate:Date,
   arrivaltime:String,
   typeoftable:String,
   mode:String,
   payment_id:String,
   payment_status:String

})

const BedbookSchema=new mongoose.Schema({
  fullname:String,
  contact:Number,
  arrivaldate:Date,
  departuredate:Date,
  typeofbed:String,
  mode:String,
  payment_id:String,
  payment_status:String
})

const HotelvaranasioneRoombookSchema=new mongoose.Schema({
  fullname:String,
  contact:Number,
  email:String,
  arrivaldate:Date,
  departuredate:Date,
  typeofroom:String,
  mode:String,
  payment_id:String,
  payment_status:String,
  location:String,
  hotelname:String
})

const HotelvaranasitwoRoombookSchema=new mongoose.Schema({
  fullname:String,
  contact:Number,
  email:String,
  arrivaldate:Date,
  departuredate:Date,
  typeofroom:String,
  mode:String,
  payment_id:String,
  payment_status:String,
  location:String,
  hotelname:String
})


const HotelvaranasithreeRoombookSchema=new mongoose.Schema({
  fullname:String,
  contact:Number,
  email:String,
  arrivaldate:Date,
  departuredate:Date,
  typeofroom:String,
  mode:String,
  payment_id:String,
  payment_status:String,
  location:String,
  hotelname:String
})


const HotelvaranasifourRoombookSchema=new mongoose.Schema({
  fullname:String,
  contact:Number,
  email:String,
  arrivaldate:Date,
  departuredate:Date,
  typeofroom:String,
  mode:String,
  payment_id:String,
  payment_status:String,
  location:String,
  hotelname:String
})


const HotelpatnaoneRoombookSchema=new mongoose.Schema({
  fullname:String,
  contact:Number,
  email:String,
  arrivaldate:Date,
  departuredate:Date,
  typeofroom:String,
  mode:String,
  payment_id:String,
  payment_status:String,
  location:String,
  hotelname:String
})



const HotelpatnatwoRoombookSchema=new mongoose.Schema({
  fullname:String,
  contact:Number,
  email:String,
  arrivaldate:Date,
  departuredate:Date,
  typeofroom:String,
  mode:String,
  payment_id:String,
  payment_status:String,
  location:String,
  hotelname:String
})



const HotelpatnathreeRoombookSchema=new mongoose.Schema({
  fullname:String,
  contact:Number,
  email:String,
  arrivaldate:Date,
  departuredate:Date,
  typeofroom:String,
  mode:String,
  payment_id:String,
  payment_status:String,
  location:String,
  hotelname:String
})





const HotelranchioneRoombookSchema=new mongoose.Schema({
  fullname:String,
  contact:Number,
  email:String,
  arrivaldate:Date,
  departuredate:Date,
  typeofroom:String,
  mode:String,
  payment_id:String,
  payment_status:String,
  location:String,
  hotelname:String
})


const HotelranchitwoRoombookSchema=new mongoose.Schema({
  fullname:String,
  contact:Number,
  email:String,
  arrivaldate:Date,
  departuredate:Date,
  typeofroom:String,
  mode:String,
  payment_id:String,
  payment_status:String,
  location:String,
  hotelname:String
})


const BookedRoomOfCitySchema=new mongoose.Schema({
  fullname:String,
  contact:Number,
  email:String,
  arrivaldate:Date,
  departuredate:Date,
  typeofroom:String,
  mode:String,
  payment_id:String,
  payment_status:String,
  location:String,
  hotelname:String
})

 const RoyalbedbookSchema=new mongoose.Schema({
  fullname:String,
  contact:Number,
  arrivaldate:Date,
  departuredate:Date,
  type:String,
  arrivaltime:String
 })


 const hallbookSchema=new mongoose.Schema({
  fullname:String,
  contact:Number,
  address:String,
  email:String,
  dateofbook:String,
  hallname:String,
  payment_id:String,
  payment_status:String
 })

const Hallbook=new mongoose.model("Hallbook",hallbookSchema);
const Hotelvaranasione=new mongoose.model("Hotelvaranasione",HotelvaranasioneRoombookSchema);
const Hotelvaranasitwo=new mongoose.model("Hotelvaranasitwo",HotelvaranasitwoRoombookSchema);
const Hotelvaranasithree=new mongoose.model("Hotelvaranasithree",HotelvaranasithreeRoombookSchema);
const Hotelvaranasifour=new mongoose.model("Hotelvaranasifour",HotelvaranasifourRoombookSchema);

const Hotelpatnaone=new mongoose.model("Hotelpatnaone",HotelpatnaoneRoombookSchema);
const Hotelpatnatwo=new mongoose.model("Hotelpatnatwo",HotelpatnatwoRoombookSchema);
const Hotelpatnathree=new mongoose.model("Hotelpatnathree",HotelpatnathreeRoombookSchema);

const Hotelranchione=new mongoose.model("Hotelranchione",HotelranchioneRoombookSchema);
const Hotelranchitwo=new mongoose.model("Hotelranchitwo",HotelranchitwoRoombookSchema);

const BookedRoomOfCity=new mongoose.model("BookedRoomOfCity",BookedRoomOfCitySchema);

const Bedbook=new mongoose.model("Bedbook",BedbookSchema);
const Tablebook=new mongoose.model("Tablebook",TablebookSchema); 
const Royalbed=new mongoose.model("Royalbed",RoyalbedSchema); 
const Bed=new mongoose.model("Bed",BedSchema); 
const Table=new mongoose.model("Table",TableSchema);
const Superadmin=new mongoose.model("Superadmin",SuperadminSchema);
const Customer=new mongoose.model("Customer",CustomerSchema);
const Employee=new mongoose.model("Employee",EmployeeSchema);
const HDirector=new mongoose.model("HDirector",HDirectorSchema);
const HAdminstrator=new mongoose.model("HAdminstrator",HAdminstratorSchema);
const HManager=new mongoose.model("HManager",HManagerSchema);

module.exports = {
    Customer: Customer,
    Hallbook: Hallbook,
    Hotelvaranasitwo: Hotelvaranasitwo,
    Hotelvaranasione: Hotelvaranasione,
    Hotelvaranasithree: Hotelvaranasithree,
    Hotelvaranasifour:Hotelvaranasifour,
    Hotelpatnaone:Hotelpatnaone,
    Hotelpatnatwo:Hotelpatnatwo,
    Hotelpatnathree:Hotelpatnathree,
    Hotelranchione:Hotelranchione,
    Hotelranchitwo:Hotelranchitwo,
    BookedRoomOfCity:BookedRoomOfCity,
    Bedbook:Bedbook,
    Tablebook:Tablebook,
    Royalbed:Royalbed,
    Bed:Bed,
    Table:Table,
    Superadmin:Superadmin,
    Employee:Employee,
    HDirector:HDirector,
    HAdminstrator:HAdminstrator,
    HManager:HManager




};