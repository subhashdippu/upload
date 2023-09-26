const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authenticate = require('../middleware/ authenticate')
const cookieParser = require("cookie-parser")
router.use(cookieParser())


require('../db/conn');
const User = require("../model/userSchema");
router.get('/', (req, res) => {
    res.send('Hello world form the server router.js')
});


router.post('/register', async (req, res) => {
    const { name, email, phone, work, password, cpassword } = req.body
    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "Error please the all detail" })
    }
    try {
        const userExist = await User.findOne({ email: email })
        if (userExist) {
            return res.status(422).json({ error: "Email already Exist" })
        }
        else if (password != cpassword) {
            return res.status(422).json({ error: "Password is not maching" })
        }
        else {
            const user = new User({ name, email, phone, work, password, cpassword })
            await user.save();
            res.status(201).json({ message: "registrer successful" })
        }
    } catch (err) {
        console.log(err);
    }
})



router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Please fill the data" })
        }
        const userLogin = await User.findOne({ email: email })

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password)
            token = await userLogin.generateAuthToken();
            console.log(token)

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 258920000000),
                HttpOnly: true
            });

            if (!isMatch) {
                res.status(400).json({ error: "user password wrong" })
            }
            else {

                res.json({ message: "User Signin Succesful" })
            }
        } else {
            res.status(400).json({ error: "Invalid Credientials" })
        }
    } catch (err) {
        console.log(err)
    }
})


router.get('/about', authenticate, (req, res) => {
    res.send(req.rootUser)
})


router.get('/getdata', authenticate, (req, res) => {
    console.log('This is getdata')
    res.send(req.rootUser)
})


router.get('/logout', (req, res) => {
    console.log(`Hello my logout page`)
    res.clearCookie('jwtoken', { path: '/' })
    res.status(200).send('User logout')
})


router.post('/contact', authenticate, async (req, res) => {
    try {
        const { name, phone, Area, flat, LandMark, Town, State } = req.body
        if (!name || !Area || !phone, !flat, !LandMark, !Town, !State) {
            console.log("error in form")
            return res.json({ error: "please filled the form" })
        }
        const userContact = await User.findOne({ _id: req.userID })
        if (userContact) {
            const userMessage = await userContact.addMessage(name, phone, Area, flat, LandMark, Town, State)
            await userContact.save()
            res.status(201).json({ message: "userContact succsessfully" })
        }
    } catch (error) {
        console.log(error)
    }
})
module.exports = router