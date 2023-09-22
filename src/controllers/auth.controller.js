import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { createAccessToken } from '../libs/jwt.js'
export const register = async (req, res) => {


    const { email, password, username } = req.body
    try {

        const passwordHash = await bcrypt.hash(password, 10)//




        const newUser = new User({
            username,
            email,
            password: passwordHash,

        })

        const userSaved = await newUser.save()
        const token = await createAccessToken({ id: userSaved._id })

        res.cookie('token', token)

        res.json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            createdAt: userSaved.createdAt,
            updateAt: userSaved.updatedAt,

        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

};
export const login = async (req, res) => {
    const { email, password, } = req.body
    try {
        const userfound = await User.findOne({ email })
        if (!userfound) return res.status(400).json({ message: "user not found" })
        const isMatch = await bcrypt.compare(password, userfound.password)//
        if (!isMatch) return res.status(400).json({message:"incorrect password"})

        const token = await createAccessToken({ id: userfound._id })

        res.cookie('token', token)

        res.json({
            id: userfound._id,
            username: userfound.username,
            email: userfound.email,
            createdAt: userfound.createdAt,
            updateAt: userfound.updatedAt,

        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

};

export const logout = (req,res)=>{
   res.cookie('token', "",{
    expires: new Date(0)
   }) 
   return res.sendStatus(200)
};
export const profile = async (req, res)=>{
   const userfound = await User.findById(req.user.id)
   if(!userfound) return res.status(400).json({message:"user not found"})
   return res.json({
   id:userfound._id,
   username:userfound.username,
   createdAt:userfound.createdAt,
   updatedAt:userfound.updatedAt,
})
    
}