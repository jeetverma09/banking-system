const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const { authMiddleware } = require('../middleware/middleware');
const { Account } = require('../schema/accountSchema');
const { User } = require('../schema/userSchema');
const { signupBody, updateBody } = require('../validation');

dotenv.config();

router.post("/signin",async(req,res)=>{
    const{username,password}=req.body
    const user=await User.findOne({username})
    if(!user || user.password !==password){
        return res.status(401).json({message:"Invalid username or password"})
    }
    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET)
    res.json({message:"Signin Successfully",token});

})

router.post("/signup", async (req, res) => {
    const body = req.body;
    const result = signupBody.safeParse(req.body)
    if (!result.success) {
        return res.json({
            message: "Email already taken or Incorrect inputs"
        })
    }
    const existingUser = await User.findOne({
        username: body.username
    })

    if (existingUser) {
        return res.json({
            message: "Email already taken or Incorrect inputs"
        })
    }
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    const userId = user._id;
    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })
    const jwtSecret = process.env.JWT_SECRET
    const token = jwt.sign({
        userId
    }, jwtSecret)
    res.json({
        message: "User Created Successfully",
        token: token
    })
})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne({ _id: req.userId }, req.body);

    res.json({
        message: "Updated successfully"
    })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})


module.exports = router;