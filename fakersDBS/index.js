const express = require("express");
const app = express();
const port = 8080;
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({extended:true}))

let methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.listen(port, () => {
  console.log(`app is listening on the port ${port}`);
});

const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "delta_app2",
  password: "Mahi@7781",
});

const { faker } = require("@faker-js/faker");
let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};
// let data=[];

// // generating the 100 peoples of data using for loop

// for(i=0;i<100;i++){
//     data.push(getRandomUser());
// }

// let query="INSERT INTO user  (id,username,email,password) VALUES ?";

// try {
//     connection.query(query,[data],(err,result)=>{
//         if(err) throw err;
//         console.log(result);
//     })

// } catch (error) {
//     console.log(error);
//     console.log("some error in database");
// }

//home page route

app.get("/", (req, res) => {
  let q = `select count(*) FROM user`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"];
      console.log(count);
      res.render("home.ejs", { count });
    });
  } catch (error) {
    console.log(error);
  }
});

//userdata route
app.get("/user", (req, res) => {
  let q = `SELECT * FROM user`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      res.render("show.ejs",{result})
    });
  } catch (error) {
    console.log(error);
  }
});

//edit username

app.get("/user/:id/edit",(req,res)=>{
    let {id}=req.params;
    let q=`SELECT * FROM user WHERE id='${id}'`;
    try {
        connection.query(q,(err,result)=>{
            if(err) throw err;
            res.render("edit.ejs",{result})
        })
    } catch (err) {
        console.log(err);
    }
});

//UPDATE USERNAME
app.patch("/user/:id",(req,res)=>{
    let {id}=req.params;
    let password=req.body.password;
    let newUsername=req.body.username;
    let q=`SELECT * FROM user WHERE id ='${id}'`;
    try {
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let data=result[0];
            if(password==data.password){
                let q2=`UPDATE user SET username = '${newUsername}'
                WHERE id = '${id}'`
               try {
                connection.query(q2,(err,result)=>{
                    if(err) throw err;
                    console.log(result);
                    res.redirect("/user");
                })
               } catch (err) {
                
               }
            }
            else{
                res.send("password is incorrect")
            }
        })
    } catch (err) {
        console.log(err);
    }
})