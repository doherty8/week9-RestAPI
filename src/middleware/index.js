const User = require("../users/model") 

const bcrypt = require("bcrypt")

const saltRounds = process.env.SALT_ROUNDS

const hashPass = async (req, res, next) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, parseInt(saltRounds))
        next()
    } catch (error) {
        res.status(501).json({errorMessage: error.message, error: error})
    }
}

const comparePass = async (req, res, next) => {
    try {
        req.user = await User.findOne({where: {username: req.body.username}})      

        if (req.user === null) {
            throw new Error ("password or username doesn't match")
        }
        const comparePassword = await bcrypt.compare(req.body.password, req.user.password)

        if(!comparePassword){
            throw new Error ("password or username doesn't match")
        } 
        
        next()
    } catch (error) {
        res.status(501).json({errorMessage: error.message, error: error})
    }
}

module.exports = {
    hashPass,
    comparePass
}