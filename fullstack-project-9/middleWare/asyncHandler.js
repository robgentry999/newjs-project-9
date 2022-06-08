exports.asyncHandler = (callBack) => {
    return async(req, res, next) => {
        try{
            await callBack(req, res, next);
        }catch (err) {
            next(err)
        }
    }
}