const express = require("express")
const router = express.Router();

// import the controllers

const { signupHandler , loginHandler} = require("../controllers/auth")
const { auth , isStudent , isAdmin } = require("../middlewares/auth")

router.post("/signup", signupHandler)
router.post("/login", loginHandler)

// protected routes
                // both these will make use of the token we've sent to the client in response
                // first auth will check authenticity , then isStudent will check role
router.get("/student", auth , isStudent , ( request , response )=>{
    response.json({
        success : true,
        message : "you are on the protected route for students"
    })
})
                // first auth will check authenticity , then isAdmin will check role
router.get("/admin", auth , isAdmin , ( request , response ) => {
    response.json({
        success : true,
        message : "you are on the protected route for admin"
    })
})

router.get("/test", auth , ( req , res ) => {
    return res.status(200).json(
        {
            success : true,
            message : "auth mw is 'ok' "
        }
    )
})

module.exports = router
