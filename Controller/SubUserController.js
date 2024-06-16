const SubUserModal = require("../Model/SubUserModal");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
// const bcrypt = require("bcryptjs");

exports.subUserSignIn = async (req, res) => {
    SubUserModal.findOne({ email: req.body.email }).exec((error, subUser) => {
        if (error) return res.status(400).json({
            status: 'error',
            error: error,
            message: "No sub-user found"
        })

        if (subUser) {
            if (subUser.password === req.body.password) {
                const token = jwt.sign(
                    { _id: subUser._id, type: 'subUser' },
                    process.env.JET_SECREAT
                )
                res.cookie('token', token, 
                    { expire: new Date() + 9999 },
                    { httpOnly: true }
                );
                res.status(200).json({
                    token,
                    message: "Login successfully",
                });

            } else {
                res.status(404).json({
                    message: "Invalid password",
                });
            }
        }
        else {
            res.status(404).json({
                message: "Something went wrong",
            });
        }
    })
};

exports.subUserSignOut = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
};


exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;
  
    try {
        const subUser = await SubUserModal.findOne({ email });
        if (!subUser) {
        return res.status(404).json({ message: 'Sub-user not found' });
        }

        const resetToken = jwt.sign({ id: subUser._id }, process.env.JET_SECREAT, { expiresIn: '1h' });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const resetLink = `${process.env.FRONTEND_URL}resetPassword/${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset Request',
            text: `Click the following link to reset your password: ${resetLink}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ message: 'Failed to send reset email', error });
        }
        res.status(200).json({ message: 'Password reset email sent successfully' });
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

exports.resetPassword = async (req, res) => {
    const token = req.params.token;

    try {
        const decoded = jwt.verify(token, process.env.JET_SECREAT);
        const subUser = await SubUserModal.findById(decoded.id);
        if (!subUser) {
            return res.status(404).json({ message: 'Sub-user not found' });
        }

        // const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
        subUser.password = req.body.newPassword;
        await subUser.save();
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    const userId = req.userId;
    const { oldPassword, newPassword } = req.body;

    try {
        const subUser = await SubUserModal.findById(userId);
        if (!subUser) {
        return res.status(404).json({ message: 'Sub-user not found' });
        }

        // const isMatch = await bcrypt.compare(oldPassword, user.password);
        const isMatch = oldPassword === subUser.password;
        if (!isMatch) {
        return res.status(400).json({ message: 'Old password is incorrect' });
        }

        // user.password = await bcrypt.hash(newPassword, 10);
        subUser.password = newPassword;
        await subUser.save();
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

exports.getSubUserById = async (req, res) => {
    try {
        const subUser = await SubUserModal.findById(req.body._id);
        if (!subUser) {
            return res.status(404).json({ message: 'Sub-user not found' });
        }

        res.status(200).json(subUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}
