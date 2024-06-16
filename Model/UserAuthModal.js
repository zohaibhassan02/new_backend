const mongoose = require("mongoose");
const UserAuthModal = new mongoose.Schema(
    {
        fullName: {
            type: String,
            require: true,
            trim: true,
            min: 10,
            max: 20,
        },

        email: {
            type: String,
            require: true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            require: true,
        },
        // role: {
        //     type: String,
        //     enum: ["superAdmin", "admin", "user"],
        //     default: "user",
        // },
        companyName: {
            type: String,
            require: true,
            min: 10,
            max: 20,
        },
        hearFrom: {
            type: String,
            require: true,
            trim: true,
            min: 10,
            max: 20,
        },
        subusers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "subusers",
        }],
        firstName: {
            type: String,
            require: false,
            trim: true,
            // min: 10,
            // max: 20,
        },
        lastName: {
            type: String,
            require: false,
            trim: true,
            // min: 10,
            // max: 20,
        },
        gender: {
            type: String,
            require: false,
            trim: true,
            // min: 10,
            // max: 20,
        },
        birthday: {
            type: String,
            require: false,
            trim: true,
            // min: 10,
            // max: 20,
        },
        address: {
            type: String,
            require: false,
            trim: true,
            // min: 10,
            // max: 20,
        },
        location: {
            type: String,
            require: false,
            trim: true,
            // min: 10,
            // max: 20,
        },
        state: {
            type: String,
            require: false,
            trim: true,
            // min: 10,
            // max: 20,
        },
        phone: {
            type: String,
            require: false,
            trim: true,
            // min: 10,
            // max: 20,
        },
        language: {
            type: String,
            require: false,
            trim: true,
            // min: 10,
            // max: 20,
        },

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("users", UserAuthModal);
