/**
 * @class ApiError
 * @extends Error
 * @description Custom error class
 * @returns {Object}
 */
class ApiError extends Error
{
    constructor(statusCode, message){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.success = false
        Error.captureStackTrace(this, this.constructor)
    }
}

export default ApiError