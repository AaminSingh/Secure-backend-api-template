class ApiError extends Error{
    constructor(
        statusCode,
        message = 'Something went wrong',
        errors = [],
        stack = ""
){
    super(message)
    this.statusCode = statusCode
    this.data = null
    this.message = message
    this.success = false
    this.errors = errors

    if(stack){
        this.stack = stack
    }else{
        Error.captureStackTrace(this, this.constructor)
    }
}
}
export{ApiError}

//Normally, JavaScript already has a built-in Error class.
//throw new Error("Something went wrong");
//But this doesn't tell us:

// HTTP Status Code?
// Success?
// Validation Errors?
// Extra Data?

// So we create our own Error class.