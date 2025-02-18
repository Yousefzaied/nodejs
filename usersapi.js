

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(express.json());
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const url = process.env.MONGO_URL;

mongoose.connect(url);
app.use(cors());
const Users = require("./users")

// all users
app.get("/users", async (req, res) => {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("token =>", token)

  try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log("decodedToken => ", decodedToken);

      const allUsers = await Users.find();
      res.json({ status: "success", data: { users: allUsers } });

  } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
  }
});


// regiter users
app.post("/users/register", async (req, res) => {
        const {firstName, lastName, email, password} = req.body;

        // check error
        const oldUser = await Users.findOne({email: email});
        if(oldUser) {
              return res.status(400).json({status: "fail", message: "email alredy exists",data: "null"})
        }

        // password hashing
        const hashedPassword  = await bcrypt.hash(password, 10)
        
        const newUsers = new Users({
          firstName, 
          lastName, 
          email, 
          password: hashedPassword,
          role
        });

        // generate token
        const token = await jwt.sign({email: newUsers.email, id: newUsers._id}, process.env.JWT_SECRET_KEY, {expiresIn: "10m"});
        console.log("token =>", token);
        newUsers.token = token

        await newUsers.save();

        res.status(200).json({status: "success" , data: {users :newUsers}});
})

//8374848
// login user 
app.post("/users/login", async (req, res) => {
  const{email, password} = req.body;

  if(!email && !password) {
      return res.json({message: "email and password is required"});
  }

  const user = await Users.findOne({email: email}); // => object depend on email
  const matchPassword = await bcrypt.compare(password, user.password);

  if(user && matchPassword) {
    const token = await jwt.sign({email: user.email, id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "10m"});
      return res.json({status:"success", data:{token:token}})
  }  else {
      return res.json({statues: "error", message: "somehting wrong "})
  }
})


app.listen(3001, () => {
  console.log("Server Is On Port 3001");
})