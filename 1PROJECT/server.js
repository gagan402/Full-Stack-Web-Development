var express=require("express");
var app=express();
var mysql2=require("mysql2");





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











app.listen(8000,function(){
    console.log("Server Started at port 8000");
})