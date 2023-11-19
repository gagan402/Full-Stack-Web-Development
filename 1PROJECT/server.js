var express=require("express");
var app=express();
var mysql2=require("mysql2");
var fileupload=require("express-fileupload");
var path=require("path");

app.use(express.static("public"));
 
app.use(express.urlencoded(true));
app.use(fileupload());


app.get("/",function(req,res){
    var filePath=__dirname+"/public/index.html";
    res.sendFile(filePath);
});





// *********************************Database connectivity********************************

const config={
    host:"localhost",
    user:"root",
    password:"123Sarpanch@#$",
    database:"shark",
    dateStrings:true
}

var mysqldb=mysql2.createConnection(config);
mysqldb.connect(function(err){
    if(err==null)
    {
        console.log("Connected to database succesfully");
    }
    else{
        console.log(err.message);
    }
});



app.get("/signup-data",function(req,res){
    var  em=req.query.email;
    var  pw=req.query.pwd;
    var  ty=req.query.type;
    mysqldb.query("insert into users values(?,?,?,current_date(),1)",[em,pw,ty],function(err){
        if(err==null )
        {
            res.send("Data saved by email "+em);

        }
        else{
            // console.log(err);
            res.send(err);
        }

        });
});


app.get("/login-data",function(req,res){
    var  em=req.query.email;
    var  pw=req.query.pwd;
    
    mysqldb.query("select utype from users where emailid=? and pwd=?",[em,pw],function(err,result){
        if(err==null )
        {
            if(result.length==1)
            {
                var t=result[0].utype;
                // console.log(result+" "+t);
                 res.send(t);
            }
            else
            {
                res.send("Not found");
            }

        }
        else{
            
            res.send(err);
        }
    });

})



app.post("/save-data",function(req,res){
    var email=req.body.txtEmail;
    var name=req.body.txtname;
    var contact=req.body.txtcontact;
    var add=req.body.txtAddress;
    var city=req.body.txtCity;
    var state=req.body.txtState;
    var idproof=req.body.idproof;

    var firm=req.body.txtfirm;
    var linked=req.body.linkedIn;

    var filename="nopic.jpg";
    if(req.files!=null)
    {
    filename=req.body.txtEmail+"-"+req.files.idprooffile.name;
    var filepath=path.join(__dirname,"public","uploads",filename);
    req.files.idprooffile.mv(filepath);
    }
    mysqldb.query("insert into pprofiles values(?,?,?,?,?,?,?,?,?,?)",[email,name,contact,add,city,state,idproof,filename,firm,linked],function(err,result){
        if(err==null)
        {
            console.log(result);
            res.send("Profile Saved Succesfully");
        }
        else
        {
            res.send(err.message );
        }
    });

});

app.get("/search-json",function(req,res){
    var e=req.query.em;
    mysqldb.query("select * from pprofiles where email=?",[e],function(err,result){
        if(err==null)
        {
            if(result.length==1)
            {
            res.send(result);
            }
            else{
                res.send("No user found");
            }
        }
        else{
            res.send(err);
        }

    })

})


app.post("/update-data",function(req,res){
    var email=req.body.txtEmail;
    var name=req.body.txtname;
    var contact=req.body.txtcontact;
    var add=req.body.txtAddress;
    var city=req.body.txtCity;
    var state=req.body.txtState;
    var idproof=req.body.idproof;

    var firm=req.body.txtfirm;
    var linked=req.body.linkedIn;

    var filename="nopic.jpg";
    if(req.files!=null)
    {
    filename=req.body.txtEmail+"-"+req.files.idprooffile.name;
    var filepath=path.join(__dirname,"public","uploads",filename);
    req.files.idprooffile.mv(filepath);
    }
    else
    {
        filename=req.body.hdn;
    }
    mysqldb.query("update pprofiles set  namee=?,contact=?,address=?,city=?,state=?,idproof=?,proofpic=?,firm=?,linkedin=? where email=?",[name,contact,add,city,state,idproof,filename,firm,linked,email],function(err,result){
        if(err==null)
        {
            console.log(result);
            res.send("Profile Updated Succesfully");
        }

        else
        {
            res.send(err.message );
        }
    });


})










app.listen(8000,function(){
    console.log("Server Started at port 8000");
})