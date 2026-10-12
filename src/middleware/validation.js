const { AppError } = require("../utils/errors")

const  validation = (schema,property = "body") => (req,res,next) => {

     const {error,value} = schema.validate(req[property] , {abortEarly:false,stripUnknown:true})

     if(error){
        const message = error.details.map((m) => m.message).join(",")
        throw new AppError(400,message)  
     }   



     req[property] = value
next()

}


module.exports = validation