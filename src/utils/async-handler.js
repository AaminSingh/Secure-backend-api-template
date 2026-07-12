const asyncHandler = (requestHandler)=>{
    return (req,res,next) => {
        Promise
        .resolve(requestHandler(req,res,next))       //It returns a new middleware function.
                                                     //Promise.resolve() simply makes sure we're working with a Promise.
        .catch((err) => next(err))
    }
};

export {asyncHandler}