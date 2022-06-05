// A function to wrap around the routes
exports.asyncHandler = (callBack) => {
    return async(req, res, next) => {
        try{
            await callBack(req, res, next);
        }catch (err) {
            // Forward error to global error handler
            next(err)
        }
    }
}