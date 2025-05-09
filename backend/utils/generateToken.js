import jwt from 'jsonwebtoken'

const generateToken = (id, res) => {
    // GENERATE JWT TOKEN
    const token = jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "15d"
    });

    //STORE IN COOKIE
    res.cookie("token", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
    })
}

export default generateToken;