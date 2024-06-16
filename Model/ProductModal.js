const mongoose = require("mongoose");
const ProductModal = new mongoose.Schema(
    {
        userId: {
            type: String,
            require: true,
        },
        productName: {
            type: String,
            require: true,
        },
        abv: {
            type: String,
            require: true,

        },
        category: {
            type: String,
            require: true,
        },
        description: {
            type: String,
            require: true,
        },

        type: {
            type: String,
            require: true,
        },
        style: {
            type: String,
            require: true,

        },
        producer: {
            type: String,
            require: true,
        },
        quantity: {
            type: Number,
            require: true,
        },
        pricintList: {
            type: Array,
            default: []
        },
        imageUrl: {
            type: String,
            require: true,
        },
        active: {
            type: Boolean,
            require: true,
            default: true
        },
        position: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Products", ProductModal);
