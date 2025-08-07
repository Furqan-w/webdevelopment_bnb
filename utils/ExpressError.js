class ExpressError extends Error {
    constructor(statusC,message) {
        super();
        this.message = message;
        this.status = statusC; // Default status code
    }
}

module.exports = ExpressError;