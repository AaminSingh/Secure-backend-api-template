class ApiError extends Error{         //ApiError gets all the features of Error and can also add its own.
    constructor( statusCode,message = 'Something went wrong',  errors = [],
    stack = ""
){
    super(message)
    this.statusCode = statusCode
    this.data = null
    this.message = message
    this.success = false
    this.errors = errors
    //Calls the parent (Error) constructor and initializes the standard error message.
    //Without super(), you cannot use this in a subclass constructor, and JavaScript will throw an error.

    if(stack){
        this.stack = stack
    }else{
        Error.captureStackTrace(this, this.constructor)
        //The stack trace records how the program reached the error.
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