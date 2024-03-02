const { response } = require("express")
const jwt = require("jsonwebtoken")
require("dotenv").config()


exports.auth = ( request , response , next ) => {

    try{

        const token = request.body.token;
        if( !token ){
            return response.status(401).json(
                {
                    success : false,
                    message : "token not found"
                }
            )
        }

        // verify the token
        try{
             const decode = jwt.verify( token , process.env.JWT_SECRET )
             // add the payload in the request , to be used by the next middleware ( check bhi to krna hai ki student hai ya nahi )
             request.user = decode
        } catch ( error ){
            return response.status(401).json(
                {
                    success : false,
                    message : "invalid token"
                }
            )
        }

        next();

    } catch ( error ){

        return response.status(401).json(
            {
                success : false,
                message : " could not be authnticated"
            }
        )
    }
}

exports.isStudent = ( request , response , next ) => {
    try{

        if( request.user.role != "Student" ){
            return response.status(401).json(
                {
                    success : false,
                    message : "access denied : only for students"
                }
            )
        }

        next();

    } catch ( error ){
        return response.status(401).json(
            {
                success : false,
                message : "couldn't verify if student or not"
            }
        )
    }
}

exports.isAdmin = ( request , response , next ) => {
    try{

        if( request.user.role != "Admin" ){
            return response.status(401).json(
                {
                    success : false,
                    message : "access denied : only for admins"
                }
            )
        }

    } catch ( error ){
        return response.status(401).json(
            {
                success : false,
                message : "couldn't verify if admin or not"
            }
        )
    }
}