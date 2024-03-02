const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const userModel = require("../models/UserModel")

exports.loginHandler = async ( request , response ) => {

    try{

        // fetch user details
        const { email , password } = request.body;

        // check if user is registered or not
        let existingUser = await userModel.findOne({email})
        if( !existingUser ){
            return response.status(400).json(
                {
                    success : false,
                    message : "User does not exist"
                }
            )
        }

        // compare passwords
        if( await bcrypt.compare(password , existingUser.password) ){

            // password correct, now make jwt token
            const jwtPayload = {
                id : existingUser._id,
                email : existingUser.email,
                role : existingUser.role
            }
            const token = jwt.sign( jwtPayload, process.env.JWT_SECRET , { expiresIn : "2d" } )

            existingUser = existingUser.toObject()
            existingUser.token = token
            existingUser.password = undefined

            const cookieOptions = {
                // expire in 3 days
                expires : new Date( Date.now() + 3*24*60*60*1000),
                // cannot be changed by client
                httpOnly : true
            }

            return response.cookie("mycookie", token , cookieOptions).status(200).json(
                {
                    success : true,
                    message : "successful",
                    token,
                    existingUser
                }
            )

        }else{
            return response.status(400).json(
                {
                    success : false,
                    message : "incorrect password"
                }
            )
        }

    } catch ( error ){

            console.error( error);
        return response.status(500).json(
            {
                success : false,
                message : "Login failed , fuck you"
            }
        )
    }
}

exports.signupHandler = async ( request , response ) => {

    try{
        // get the user info
        const { name , email , password , role } = request.body;

        // check for existing user
        const existingUser = await userModel.findOne({email})
        if( existingUser ){
            return response.status(400).json(
                {
                    success : false,
                    message : "User already exists"
                }
            )
        }

        // hash password
        let hashedPass;
        try{
            hashedPass = await bcrypt.hash( password , 10)
        }catch( error ){
            return response.status(500).json(
                {
                    success : false,
                    message : "Error in hashing password"
                }
            )
        }

        const user = await userModel.create(
            {
                name ,
                email ,
                password : hashedPass,
                role
            }
        )

        return response.status(200).json(
            {
                success : true,
                message : "User created successfully"
            }
        )

    }catch( error ){

        return response.status(500).json(
            {
                success : false,
                message : "Error in creating user"
            }
        )

    }
}