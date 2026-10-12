const {AppError} = require("../utils/errors")


function notFound(err,req,res,next){
    const error = new AppError(404,`Not Found - ${req.originalUrl}`)
    next(error)

}


function errorHandler(err,req,res,next){
    const {statusCode = 500 , message = "Internal Server Error"} = err


    if(err.name == "CastError"){
        err = new AppError(400,`Invalid ${err.path}: ${err.value}`)
    }

    if(err.name === "ValidationError"){
        err = new AppError(400,`Validation Error - ${Object.values(err.errors).map(el => el.message).join(", ")}`)
    }

    if(err.name === "MongoDuplicateError"){
        err = new AppError(400,`Duplicate Field Value: ${Object.keys(err.keyValue)}. Please use another value!`)
    }


    res.status(statusCode).json({
        success: true,
        statusCode,
        message,
        ...(process.env.NODE_ENV !== "production" && {stack: err.stack})
    })


}



module.exports = {errorHandler, notFound}