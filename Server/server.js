var express=require("express");
var fileupload=require("express-fileupload");
var mysql2=require("mysql2");
var app=express();

const path=require("path");

                //call back function
app.listen(8081,function(){
    console.log("Server Started at port 8081");
})


app.use(express.static("public"));//static:it will work for .css and .js files
 
app.use(express.urlencoded(true));//to concert post data to JSON object
app.use(fileupload());

//URL handlers
//req,res are objects and formal arguments sent by node js server
app.get("/",function(req,res){
    //res.send("Its index page.");
    // process.cwd();  //__dirname 
                        //(cwd(): inbuilt application programming interface of the process module which is used to get the current working directory of the node.js process)
                        //__dirname is a string and displays the directory name of the current folder
    var filePath=__dirname+"/public/index.html";
    res.sendFile(filePath);
});

app.get("/signup",function(req,res){
      //res.send("Its signup page.");
    // res.send(process.cwd());
    // res.send(__filename);
 
   /* res.contentType("text/html");
    res.write("<br>"+__dirname+"<br>");
    res.write(__filename);
    res.end();*/
     
    res.sendFile(__dirname+"/public/signup.html");

});
app.get("/profile",function(req,res){

   
  res.sendFile(__dirname+"/public/profile.html");

});

app.get("/login",function(req,res){
    res.send("Its login page.");
})


//browser will send data to server through query string(present in url) (2048 character limit)
//JSON:Java Script Object Notation
//data sent by browser will be recevied by node js and will be converted into json object
//through get only text data is allowed to send
app.get("/signup-pro",function(req,res){

        // res.send(req.query);//query is an inner object of request object
       
         res.send(req.query) ;  
         var qua="";
        if(req.query.bt!=undefined)
        {
          qua=qua+req.query.bt+",";
        }
        
        if(req.query.mb!=undefined)
        {
            qua=qua+req.query.mb+",";
        }
        if(qua=="")
        {
            console.log("no");   
        }
        else
        {
         console.log(qua.substring(0,qua.length-1));              
        }
});
//post send data to server in binary form
app.post("/signup-pro-safe",function(req,res){
    // console.log(req.body);
    res.send(req.body);
    // file uploading
    //when method is post in case of files a new files object will be created for files being uploaded by user
    var filename=req.body.txtEmail+"-"+req.files.ppic.name;
    console.log(filename);

        var filepath=path.join(__dirname,"public","uploads",filename);//".."-> come out of directory
        console.log(filepath);
        req.files.ppic.mv(filepath);

});

// *********************************Database connectivity********************************

const config={
    host:"localhost",
    user:"root",
    password:"123Sarpanch@#$",
    database:"webdev"
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



app.post("/signing",function(req,res){
    
    var filename=req.body.txtEmail+"-"+req.files.ppic.name;
    var filepath=path.join(__dirname,"public","uploads",filename);//".."-> come out of directory
    // console.log(filepath);
    req.files.ppic.mv(filepath);

    var Email=req.body.txtEmail;
    var Name=req.body.txtName;
    var birth=req.body.dob;

    mysqldb.query("insert into profil values(?,?,?,?,current_date())",[Email,Name,filename,birth],function(err){
        if(err==null)
        {
            res.send("Profile Saved Succesfully");
        }
        else
        {
            res.send(err.message );
        }
    });

})

app.post("/do-delete",function(req,res){
    var Email=req.body.txtEmail;
    mysqldb.query("delete from profil where emailid=?",[Email],function(err,result){
        if(err==null )
        {
            if(result.affectedRows==1)
            {
                res.send(Email+" Record deleted successfully");
            }
            else{
                res.send("Invalid id");
            }
        }
        else{
            res.send(err);
        }

    })
});

app.post("/do-update",function(req,res){
    
    var filename=req.body.txtEmail+"-"+req.files.ppic.name;
    var filepath=path.join(__dirname,"public","uploads",filename);//".."-> come out of directory
    // console.log(filepath);
    req.files.ppic.mv(filepath);

    var Email=req.body.txtEmail;
    var Name=req.body.txtName;
    var birth=req.body.dob;
    //                               table column names
    mysqldb.query("update profil set namee=?,picname=?,dob=? where emailid=?",[Name,filename,birth,Email],function(err,result){
        if(err==null)
        {
            if(result.affectedRows==1)
            {
                res.send(" Record updated successfully");
            }
            else{
                res.send("Invalid id");
            }
        }
        else
        {
            res.send(err.message );
        }
    });

});


app.post("/do-show",function(req,res){
    // var Email=req.body.txtEmail;
    mysqldb.query("select * from profil",function(err,result){
        if(err==null )
        {
            res.send(result);
        }
        else{
            res.send(err);
        }

    })
});
