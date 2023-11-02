var express=require("express");
var app=express();


                //call back function
app.listen(8081,function(){
    console.log("Server Started");
})


app.use(express.static("public"));//static:it will work for .css and .js files
 
app.use(express.urlencoded(true));//to concert post data to JSON object


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
    console.log(req.body);
    res.send(req.body);
});