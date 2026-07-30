export const register = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Register endpoint"
    });
};

export const login = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Login endpoint"
    });
};