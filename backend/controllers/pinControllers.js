import { Pin } from "../models/pinModel.js";
import TryCatch from "../utils/TryCatch.js";
import getDataUrl from '../utils/urlGenerator.js'
import cloudinary from 'cloudinary'


// CREATE A PIN (Upload image using cloudinary)
export const createPin = TryCatch(async (req, res) => {
    const { title, pin } = req.body;

    const file = req.file;
    const fileUrl = getDataUrl(file)

    //SEND IMAGE TO CLODINARY
    const cloud = await cloudinary.v2.uploader.upload(fileUrl.content)
    await Pin.create({
        title,
        pin,
        image: {
            id: cloud.public_id,
            url: cloud.secure_url
        },
        owner: req.user._id,
    })
    res.json({ message: "Pin created" })
})


// Retrieve ALL PINS
export const getAllPins = TryCatch(async (req, res) => {
    const pins = await Pin.find().sort({ createdAt: -1 });
    res.json(pins);
});


// Retrieve SINGLE PIN using PARAM ID
export const getSinglePin = TryCatch(async (req, res) => {
    //Recieve PIN using params ID and populate its owners data without password
    const pin = await Pin.findById(req.params.id).populate("owner", "-password");

    res.json(pin);
});


// COMMENT ON PIN
// OPEN USING PARAM ID
export const commentOnPin = TryCatch(async (req, res) => {
    const pin = await Pin.findById(req.params.id);
    if (!pin)
        return res.status(400).json({
            message: "No Pin exists with this id",
        });

    pin.comments.push({
        //LOGGED USER
        user: req.user._id,
        // LOGGED USER NAME
        name: req.user.name,
        comment: req.body.comment,
    });

    await pin.save();
    res.json({
        message: "Comment Added",
    });
});


// DELETE COMMENT
// SELECT COMMENT BY ID AND DELETE
export const deleteComment = TryCatch(async (req, res) => {
    const pin = await Pin.findById(req.params.id);
    if (!pin)
        return res.status(400).json({
            message: "No Pin exists with this id",
        });
    // we use ? for query so, http.something.com/api/pin/comment/:id?commentId=
    if (!req.query.commentId)
        return res.status(404).json({
            message: "Please give comment id",
        });

    const commentIndex = pin.comments.findIndex(
        (item) => item._id.toString() === req.query.commentId.toString()
    );

    if (commentIndex === -1) {
        return res.status(404).json({
            message: "Comment not found",
        });
    }

    const comment = pin.comments[commentIndex];
    // Comment Owner and Logged user matches then delete comment
    if (comment.user.toString() === req.user._id.toString()) {
        pin.comments.splice(commentIndex, 1);
        await pin.save();
        return res.json({
            message: "Comment Deleted",
        });
    } else {
        return res.status(403).json({
            message: "You are not owner of this comment",
        });
    }
});


// DELETE PIN
// FIND PIN BY PARAM ID
export const deletePin = TryCatch(async (req, res) => {
    const pin = await Pin.findById(req.params.id);

    if (!pin)
        return res.status(400).json({
            message: "No Pin with this id",
        });

    // Check if PIN owner is LoggedUSer
    // If not
    if (pin.owner.toString() !== req.user._id.toString())
        return res.status(403).json({
            message: "Unauthorized",
        });
    //Else Remove cloudinary ID
    await cloudinary.v2.uploader.destroy(pin.image.id);
    //Delete PIN ID from MongoDB
    await pin.deleteOne();

    res.json({
        message: "Pin Deleted",
    });
});


// UPDATE PIN
export const updatePin = TryCatch(async (req, res) => {
    const pin = await Pin.findById(req.params.id);

    if (!pin)
        return res.status(400).json({
            message: "No Pin with this id",
        });

    if (pin.owner.toString() !== req.user._id.toString())
        return res.status(403).json({
            message: "Unauthorized",
        });
    //UPDATE PIN TITLE AND PIN
    pin.title = req.body.title;
    pin.pin = req.body.pin;

    await pin.save();

    res.json({
        message: "Pin updated",
    });
});