// var a=10, b=20

// console.log(`${a}+${b} = ${a+b}`);

// console.log('Nodejs is here!');

// To load an ES module, set "type": "module" in the package.json

// import express, { request, response } from "express";
// import { data } from "./data.js";
// import chalk from "chalk";
// import mongoose from "mongoose";

// const app = express();
// const PORT = 5500
// // These are Middle wares used to read Body data from server.
// app.use(express.json())
// app.use(express.urlencoded({extended: true}))

// // const DBURI = "mongodb+srv://mdjawwad:mdjawwad123@cluster0.c5lq7.mongodb.net/"

// // mongoose.connect(DBURI)

// // mongoose.connection.on("connected", (res)=> console.log("MongoDB Connected", res))

// // mongoose.connection.on("connected", (err)=> console.log("MongoDB error", err))

// app.get("/",(req,res)=>{
//   res.send("Hello")
// })
// app.get("/products", (request, response) => {
//   response.send(data);
// });

// app.get("/users", (request, response) => {
//   response.send('users here!');
// });

// // app.get("/", (request, response) => {
// //   response.send("Jawad");

// app.get("/fruits", (request, response) => {
//   response.send("Jawad eats fruits!");
// });

// app.get("/obj", (request, response) => {
//   response.send({
//     name: 'apple',
//     age: 20,
//     class: 'pak'
//   });
// });

// app.get('/arr', (request, response)=>
// {
//     response.send(['Jawad', 'Saad', 'Kashif', 'Anees', 10, 20, 30,])
// })

// // CLASS # 02

// // app.get("/products/:id", (request, response) => {
// //   const id = request.params.id
// //   const filterData = data.filter(product => product.id == id)
// //   response.send(filterData[0].title)
// //   });

// // app.get("/products/:id", (request, response)=> {
// //   // console.log(request.params.id)
// //   const dt = request.params.id
// //   const filterData = data.filter((e, i)=>
// //   {
// //    return e.id == dt
// //   })
// //   response.send(filterData[0].title)
// // })

// // app.get("/products/abc", (request, response)=>{
// // console.log(request.body)
// // response.send('Get done')
// // })

// app.post("/products/abc", (request ,response)=>{
//   console.log(request.body);
//   // console.log(chalk.bgYellow.black(request.body));
//   response.send('Post done')
// })

// app.put("/products/abc", (request ,response)=>{
//   // console.log(request.body);
//   response.send('Update done')
// })

// app.delete("/products/abc", (request ,response)=>{
//   // console.log(request.body);
//   response.send('Delete done')
// })

// app.listen(PORT, () => {
//   console.log(chalk.bgGreen.black(`Server created of Port number ${PORT}!`));
// });

// app.listen(3000, ()=>{
//   console.log(chalk.red.bgCyan.underline('Hello moto!'))
// })

// CLASS # 03

import express from "express";
// import postModel from "./models/postSchema.js";
import mongoose from "mongoose";
// import chalk from "chalk";
import bcrypt from "bcryptjs";
import cors from "cors";
import userModel from "./models/userSchema.js";
import env from "dotenv";
import jwt from "jsonwebtoken";
import userVerifyMiddle from "./middleware/userVerify.js";
env.config();

const app = express();

// const PORT = 4200;
const PORT = process.env.PORT;
const DBURI = process.env.MONGODB_URI;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// const DBURI = "mongodb+srv://mdjawwad:mdjawwad123@clusterjawad01.c5lq7.mongodb.net/";

mongoose.connect(DBURI);

mongoose.connection.on("connected", (res) =>
  console.log("MongoDB Connected", res)
);

mongoose.connection.on("error", (err) => console.log("MongoDB error", err));

// // app.get("/creates", (request, response) => {
// //   response.json({
// //     message: "server up....",
// //     status: true,
// //   });
// // });

// // // // To add data and save to MongoDB

// // app.post("/creates", async (request, response) => {
// //   // response.send('Post done')
// //   // console.log(request.body)
// //   const { title, desc, postId } = request.body;
// //   // console.log(title, desc, postId)
// //   if (!title || !desc || !postId) {
// //     response.json({
// //       message: "required fields are missing..",
// //     });
// //     return;
// //   }

// //   const postObj = {
// //     title,
// //     desc,
// //     postId,
// //   };

// //   const responsed = await postModel.create(postObj)
// //   console.log(responsed)
// //   response.send(responsed)
// // });

// app.put("/updatePost", async (req, res) => {
//    const {title , desc , postId } = req.body
//    console.log(title ,desc, postId);

//    const updated = postModel.findByIdAndUpdate(postId, { title , desc })
//     res.json(
//       {
//         message: "Post Updated",
//         data: updated
//       }
//     )
// })

// app.delete("/deletePost/:id", async (req, res) => {
//   const params = req.params.id
//   await postModel.findByIdAndDelete(params)
//   res.json(
//     {
//       message: "Post Deleted"
//     }
//   )
// })
app.get("/", (request, response) => {
  response.send("Jawad");
});
// SIGNUP

app.post("/api/userSign", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName | !email || !password) {
    res.json({
      message: "All fields must be not be empty!",
    });
    return;
  }

  const emailExist = await userModel.findOne({ email });

  // console.log("emailExist", emailExist) Here: if email not exist it show "null" in console

  if (emailExist !== null) {
    res.json({
      message: "User already registered!",
    });
    return;
  }

  const encrptPassword = await bcrypt.hash(password, 10);

  const userObj = {
    firstName,
    lastName,
    email,
    password: encrptPassword,
  };

  const userCreated = await userModel.create(userObj);

  res.statusCode(200).json({
    message: "User created successfully!",
    data: userCreated,
  });
});

// LOGIN

app.post("/api/userLogin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.json({
      message: "Both fields must be filled!",
    });
    return;
  }
  const emailExist = await userModel.findOne({ email });
  // console.log("emailExist" ,emailExist) Here: if email not exist it show "false" in console
  if (!emailExist) {
    res.json({
      message: "Invalid email or password!",
      status: false,
    });
    return;
  }
  const comparePassword = await bcrypt.compare(password, emailExist.password);

  if (!comparePassword) {
    res.json({
      message: "Invalid email & password",
      status: false,
    });
    return;
  }
  
  var token = jwt.sign(
    {
      email: emailExist.email
    },
    process.env.JWT_SECRET_KEY
  );
  res.json({
    message: "Login Successfull",
    status: true,
    token,
    email,
  });
});
app.get("/api/getUsers", userVerifyMiddle, async (req, res) => {
  try {
    const response = await userModel.find({});
    res.json({
      message: "all users got successfully",
      status: true,
      data: response,
    });
  } catch (error) {
    res.json({
      message: "Error here",
      status: false,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server created Successfully ${PORT}`);
});
// LAST CLASS ON BACKEND: TOPIC: JSON WEB TOKEN

// var token = jwt.sign(
//   {
//     firstName: emailExist.firstName,
//     lastName: emailExist.lastName,
//     email: emailExist.email,
//     password: emailExist.password,
//   },
//   process.env.JWT_SECRET_KEY
// );

// });

// CREATE an API to GET ALL USERS DATA from DB

// app.get("/api/getUsers", userVerifyMiddle , async (req, res) => {
//   try {
//     const res = await userModel.find({})
//     res.json(
//       {
//         message: "all users gotten successfully",
//         status: true,
//         data: res
//       }
//     )
//   }
//   catch (error) {
//     res.json(
//       {
//         message: "Error here",
//         status: false
//       }
//     )
//   }
// })

// // List of Methods to get, update or delete Data on DB:

// //1.  find({})
// //2.  findOne({})
// //3.  findByIdAndUpdate()
// //4.  findByIdAndDelete({})

// Hash method: password , here each password's character is converted into given number of characters.
// For Login Sign Up : password hashing
// For password encription : A library called as bcryptjs
// For dencription :
// We can use encription such as when we need to match sign up and login password
// Hacker: email passwords invalid must sow to avoid hackers to attack
// For Backend Deploy: cyclic (Its now Shutdown)
// For Backend Deploy: Railway (Its available but paid)
// For Backend Deploy: Vercel (Its available and free)
// cors: A 3rd part apps used to interact with Frontend and connect with DB
