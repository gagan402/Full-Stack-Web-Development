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


app.listen(8000,function(){
    console.log("Server Started at port 8000");
})
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'gagandeep0481.be21@chitkara.edu.in',
      pass: '123Sarpanch@#$j'
    }
  });

const sendemail = (userEmail) => {
    let mailOptions = {
      from: 'gagandeep0481.be21@chitkara.edu.in',
      to: userEmail,
      subject: 'Welcome to Our Website!',
      text: 'Thank you for signing up. We are excited to have you on board!',
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  };


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
            sendemail(em);

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




app.get("/change-pwd",function(req,res){
    var cp=req.query.cp;
    var np=req.query.np;
     var em="ggn3";
   
    mysqldb.query("select pwd from users where emailid=?",[em],function(err,result){
        if(err==null)
        {
        if(cp==result[0].pwd)
        {
            mysqldb.query("update users set pwd=? where emailid=?",[np,em],function(err){
                    if(err==null)
                    {
                            res.send("password updated successfully");
                    }
                    else{
                        res.send(err);
                    }
            })

        }
        else{
            res.send("current password is wrong");
        }
    }
    else{
        res.send(err);
    }

    })

});

app.get("/fetch-users",function(req,res){
    mysqldb.query("select * from users",[],function(err,result){
        if(err==null)
        {
            res.send(result);
        }
        else{
            res.send(err);
        }

    })

})



app.get("/fetch-pitchers",function(req,res){
    mysqldb.query("select * from pprofiles",[],function(err,result){
        if(err==null)
        {
            res.send(result);
        }
        else{
            res.send(err);
        }

    })

})


app.all("/fetch-City",function(req,res){
    // var Email=req.body.txtEmail;
    mysqldb.query("select distinct city from pprofiles",function(err,result){
        if(err==null )
        {
            res.send(result);
            console.log(result);
        }
        else{
            res.send(err);
        }

    })
});




app.get("/fetching-selected-city",function(req,res){
    var  c=req.query.City;
    mysqldb.query("select * from pprofiles where city=?",[c],function(err,result){
        if(err==null )
        {
            // console.log(res);
            res.send(result);

        }
        else{
            res.send(err);
        }

    })
});
app.get("/block-user",function(req,res){
    var em=req.query.em;
    var s=0;
    mysqldb.query("update users set statuss=? where emailid=?",[s,em],function(err,result){
        if(err==null)
        {
            res.send("blocked user");
        }
        else{
            res.send(err);
        }

    })


})


app.get("/resume-user",function(req,res){
    var em=req.query.em;
    var s=1;
    mysqldb.query("update users set statuss=? where emailid=?",[s,em],function(err,result){
        if(err==null)
        {
            res.send("resume user");
        }
        else{
            res.send(err);
        }

    })


})





app.post("/post-idea",function(req,res){
    var email=req.body.Nemail;
    var cat=req.body.Ncategory;
    var idea=req.body.Nidea;
    var fmax=req.body.Nfundmax;
    var fmin=req.body.Nfundmin;
    var info=req.body.Ninfo;
    mysqldb.query("insert into ideas values(?,?,?,?,?,?)",[email,cat,idea,fmin,fmax,info],function(err,result){
        if(err==null)
        {
            res.send("idea posted succesfully");
        }
        else{
            res.send(err);
        }
    })

});





app.get("/do-delete-pitcher",function(req,res){
    var e=req.query.em;
    mysqldb.query("delete from pprofiles where email=?",[e],function(err,result){
        if(err==null )
        {
            if(result.affectedRows==1)
            {
                res.send(result);
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


app.get("/fetch-all-categories",function(req,res){
    mysqldb.query("select distinct category from ideas",function(err,result){
        if(err==null )
        {
            
            res.send(result);
        }
        else{
            res.send(err);
        }
    })
});


app.get("/get-pitcher-data",function(req,res){
    var c=req.query.cat;
    // var mi=req.query.fundmin;
    var ma=parseFloat(req.query.fundmax);
    mysqldb.query("select * from ideas where category=?  and fmax<=?",[c,ma],function(err,result){
        if(err==null )
        {
            // console.log(result);
            res.send(result);
        }
        else{
            res.send(err);
        }

    })
});

app.get("/selected-pitcher-data",function(req,res){
    var e=req.query.eml;
    mysqldb.query("select * from pprofiles where email=?",[e],function(err,result){
        if(err==null )
        {
            // console.log(result);
            res.send(result);
        }
        else{
            res.send(err);
        }

    })
});