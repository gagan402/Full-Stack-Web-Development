use shark;
create table users(emailid varchar(300) primary key,pwd  varchar(100),utype varchar(100),dos date,statuss int);
select * from users;
create table pprofiles(email varchar(100) primary key,namee varchar(100) ,contact varchar(50),address varchar(500),city varchar(100),state varchar(100),idproof varchar(100),proofpic varchar(200),firm varchar(500),linkedin varchar(500));
select * from pprofiles; 
create table ideas(emailid varchar(200),category varchar(300),idea varchar(1000),fmin varchar(100),fmax varchar(100),info varchar(1000));
select * from ideas;
create table sharks(email varchar(300) primary key,namee varchar(100) ,contact varchar(50),company  varchar(199),website varchar(1999),worth varchar(210),funded varchar(10),info varchar(1000));
select * from sharks;
