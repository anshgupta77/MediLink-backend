import jwt from 'jsonwebtoken';

// user authentication middleware
const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;
        console.log(token);
        if (!token) {
            return res.status(400).json({ success: false, message: "Not Authorized Login Again" });
        }
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET );
        req.userId = token_decoded.id;
        console.log(token_decoded);
        next();

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export default authUser;