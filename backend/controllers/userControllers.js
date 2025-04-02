import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt';
import TryCatch from "../utils/TryCatch.js";
import generateToken from "../utils/generateToken.js";


// REGISTER USER
export const registerUser = TryCatch(async (req, res) => {
    //UserInput
    const { name, email, password } = req.body;
    let user = await User.findOne({ email })
    // CHECK IF USER EXISTS
    if (user) return res.status(400).json({ message: "An account already exists with this email." })

    // HASHED PASSWROD USING Bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    //Create new USER
    user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    // JWT TOKEN
    generateToken(user._id, res);
    res.status(201).json({
        user,
        message: 'User created successfully'
    })
})


// LOGIN USER
export const loginUser = TryCatch(async (req, res) => {
    const { email, password } = req.body
    //CHECK IF USER IS REGISTERED using Email
    const user = await User.findOne({ email })
    // IF NOT
    if (!user) return res.status(400).json({
        message: "No user found with this email"
    })
    // COMPARE IF USER EXISTS, EnteredPassword from PassInDb
    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) return res.status(400).json({
        message: "Wrong Password"
    })

    // JWT TOKEN
    generateToken(user._id, res);
    res.json({
        user,
        message: "Logged In Succesfully"
    })
})


// FETCH MY PROFILE
export const myProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id)
    res.json(user)
})


// FETCH OTHER ACCOUNT USERS
export const userProfile = TryCatch(async (req, res) => {
    // FIND USer by ID in params, dont select the password from db
    const user = await User.findById(req.params.id).select("-password")
    res.json(user)
})


// FOLLOW UNFOLLOW CONTROLLER
// Check EDGE CASE if ALREADY FOLLOWED -> UNFOLLOW
export const followAndUnfollowUser = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user._id)

    // IF NO USER EXISTS WITH ID IN PARAMS
    if (!user) return res.status(400).json({ message: "No user exists with this id." })

    //CHECK IF USER IS LOGGEDIN and TRYING TO FOLLOW SAME ID
    if (user._id.toString() === loggedInUser._id.toString()) {
        return res.status(400).json({ message: "Cannot follow self account." })
    }

    // CHECK IF ALREADY FOLLOWED, -> UNFOLLOW
    if (user.followers.includes(loggedInUser._id)) {
        const indexFollowing = loggedInUser.following.indexOf(user._id)
        const indexFollowers = user.followers.indexOf(loggedInUser._id);
        //REMOVE self FROM FOLLOWING user -> params.id
        loggedInUser.following.splice(indexFollowing, 1);
        //REMOVE self from user FOLLOWERS
        user.followers.splice(indexFollowers, 1);
        //SAVE
        await loggedInUser.save();
        await user.save();
        res.json({
            message: "User Unfollowed",
        });

    } else {
        //FOLLOW -> PUSH user Id in YOUR FOLLOWING ARR
        loggedInUser.following.push(user._id);
        //FOLLOW -> PUSH self ID INTO user FOLLOWERS ARR
        user.followers.push(loggedInUser._id);

        await loggedInUser.save();
        await user.save();
        res.json({
            message: "User followed",
        });
    }
})


// LOGOUT
export const logOutUser = TryCatch(async (req, res) => {
    // CHECK TOKEN AND EMPTY IT, EXPIRE TOKEN USING maxAge
    res.cookie("token", "", { maxAge: 0 });
    res.json({
        message: "Logged Out Successfully",
    });
});