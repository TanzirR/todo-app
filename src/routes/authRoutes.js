import express from "express"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import db from "../db.js"

const router = express.Router()


//Register a new user endpoint: /auth/register 
router.post("/register", (req, res) =>{
    //Get the username and password 
    const {username, password} = req.body
    
    //encrypt the password 
    const hasedPassword = bcrypt.hashSync(password, 8)

    //should be in a separate server entity 
    //save the new user and hased password "users" table, specifically the "username" and "password"
    //column with default VALUES as ?. The username and hashedPassword from 
    // result is passed as the VALUES
    try{
        const insertUser = db.prepare(`INSERT INTO users(username, password) VALUES (?,?)`)
        const result = insertUser.run(username, hasedPassword)
        //After having a user, create a default todo for them 
        const defaultTodo = "Your first TODO!"
        //Insert the todo into db
        const insertTodo = db.prepare(`INSERT INTO todos(user_id, task) VALUES (?, ?)`)
        //in .run() the user_id is needed which can be retrived from the result
        //.lastInsertRowid -> get the id from the last entry of the user table 
        insertTodo.run(result.lastInsertRowid, defaultTodo)

        //create a token
        const token = jwt.sign({id: result.lastInsertRowid},process.env.JWT_SECRET, {expiresIn: '24h'})

        //converts the js object into JSON and sends it to the client  
        res.json({token})
         
    } catch(err){
        console.log(err.message)
        res.sendStatus(503)
    }
    res.sendStatus(201) 
})

router.post('/login', (req, res)=>{})

export default router 
