/**
 * @class ApiResponse
 * @description Custom response class
 * @returns {Object}
 */
class ApiResponse {
  constructor(statusCode, message, data) {
    this.statusCode = statusCode
    this.message = message
    this.data = data
  }
}

export default ApiResponse
