class AppError extends Error {

        constructor(statusCode, message){
            super(message);
            this.statusCode = statusCode;
            this.message = message;
            this.stack = (new Error()).stack;

        }

}


function asyncHandler(fn){
return function(req,res,next){
    fn(req,res,next).catch((err)=> next(err))
    }
}



module.exports = {AppError,asyncHandler} 