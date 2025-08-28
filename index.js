const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'ashish_app',
  password: "password"
}); 


let getRandomUser = () => {
  return [  faker.string.uuid(),       
        faker.internet.username(),  
        faker.internet.email(),
        faker.internet.password()  
    ];
};

//* home route
app.get("/", (req, res)=>{
    let q = "select count(*) from user";
    try{
        connection.query(q, (err, result)=>{
            // console.log(result);
            let count = result[0]["count(*)"];
            res.render("home.ejs", {count}  );

        })
    }catch(err){
        res.send("some error in DB");
        throw err;    
    }
    
})

//*show route
app.get('/user', (req, res)=>{
    let q = "select * from user";
    try{
        connection.query(q, (err, users)=>{
            // console.log(users);
            res.render("showusers.ejs", {users});

        })
    }catch(err){
        res.send("some error in DB");
        throw err;    
    }

})

//* edit route
app.get("/user/:id/edit", (req, res)=>{
    let {id} = req.params;
    let q = `select * from user where id='${id}'`;
    try{
        connection.query(q, (err, result)=>{
            let user= result[0];
            res.render("edit.ejs", {user});

        })
    }catch(err){
        res.send("some error in DB");
        throw err;    
    }

})
//*update route( in DB)
app.patch("/user/:id", (req, res)=>{
    let {id} = req.params;
    let {username: newUsername, password: formPass} = req.body;
    let q = `select * from user where id='${id}'`;
    try{
        connection.query(q, (err, result)=>{
            let user= result[0];
            console.log(user);
            if(formPass != user.password){
                res.send("Wrong Password");
            }
            else{
                let q2 = `update user set username='${newUsername}' where id='${id}'`;
                connection.query(q2, (err, result)=>{
                    
                    res.redirect("/user");
                })
            }

        })
    }catch(err){
        res.send("some error in DB");
        throw err;    
    }
    
    
    
})

app.post("/user", (req, res)=>{
    let q = "INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?)";
    let id  = faker.string.uuid();
    
    let {username, email, password} = req.body;
    // console.log(fields);
    let data = [id, username, email, password];


    try{
        connection.query(q, data, (err, result)=>{
            res.redirect("/user");
        })
    }
    catch{
        res.send("error in DB ");
        throw err;
    }


} )

app.get("/user/:id/delete", (req, res)=>{
    let {id} = req.params;
    let q = `select * from user where id='${id}'`;
    try{
        connection.query(q,  (err, result)=>{
            console.log(result);
            let user = result[0]
            res.render("delete.ejs", {user});
        })
        
    }
    catch{
        res.send("error in DB ");
        throw err;
    }
    

})

app.delete("/user/:id", (req, res)=>{
    let {id} = req.params;
    let {email, password} = req.body;
    let q = `select * from user where id='${id}'`;
    try{
        connection.query(q, (err, result)=>{
            let user= result[0];
            
            if(email != user.email || password != user.password ){
                res.send("Wrong Password or Email");
            }
            else{
                let q2 = `delete from user where id='${id}'`;
                connection.query(q2, (err, result)=>{
                    
                    res.redirect("/user");
                })
            }

        })
    }catch{
        res.send("some error in DB");
        throw err;    
    }

})


app.listen("8080", ()=>{
    console.log("listening at 8080");
}  )




// let q = "insert into user values ?";

// let data =[];
// for(let i=1; i<=100; i++){
//     data.push(getRandomUser());
// }

    // try{
    //     connection.query(q, [data], (err, result)=>{
    //         console.log(result);

    //     })
    // }catch(err){
    //     console.log(err);
    // }
    // connection.end();