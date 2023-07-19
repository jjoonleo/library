exports.tryCatch = (controller) => async (req, res, next) => {
    try {
        //console.log("tryCatch");
        await controller(req, res);
    } catch (error) {
        console.log("error catched");
        return next(error);
    }
};