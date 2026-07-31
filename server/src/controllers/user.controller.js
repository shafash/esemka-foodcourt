export const getProfile = async (
    req, 
    res,
    next 
) => {
    return res.status(200).json({
        success: true,
        message: "Endpoint belum diimplementasikan",
        user: req.user
    })
};

export const updateProfile = async (
    req, 
    res,
    next 
) => {
    return res.status(200).json({
        success: true,
        message: "Endpoint belum diimplementasikan",
        user: req.user
    })
};

export const changePassword = async (
    req, 
    res, 
    next 
) => {
    return res.status(200).json({
        success: true,
        message: "Endpoint belum diimplementasikan",
        user: req.user
    })
};