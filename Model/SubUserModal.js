const mongoose = require("mongoose");
const SubUserModal = new mongoose.Schema(
    {
        email: {
            type: String,
            require: true,
        },
        password: {
            type: String,
            require: true,
        },

        isActive: {
            type: Boolean,
            require: true,
            default: true
        },
        parentUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("subusers", SubUserModal);