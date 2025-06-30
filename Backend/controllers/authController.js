const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const otpStorage = {}; 

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        console.log("Generated OTP:", otp); // Debugging to verify numeric OTP

        // ✅ Store OTP (Modify storage as per your choice: In-Memory, Redis, or MongoDB)
        otpStorage[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };

        // ✅ Send OTP via email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "OTP sent to your email." });
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // ✅ Check OTP in memory
        if (!otpStorage[email] || otpStorage[email].otp !== otp || Date.now() > otpStorage[email].expiresAt) {
            return res.status(400).json({ message: "Invalid or expired OTP!" });
        }

        // ✅ Remove OTP from memory after verification
        delete otpStorage[email];

        // ✅ Update only the password (role remains unchanged)
        user.password = newPassword;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({ message: "Password reset successful!" });
    } catch (error) {
        console.error("Error in verifyOtp:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.librarianLogin = [
    // Validate email and password
    body("email").isEmail().withMessage("Please provide a valid email address."),
    body("password").notEmpty().withMessage("Password is required."),

    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { email, password } = req.body;
            if (!process.env.JWT_SECRET) return res.status(500).json({ message: "Server configuration error!" });

            const user = await User.findOne({ email, role: "librarian" });
            if (!user) return res.status(400).json({ message: "Librarian not found!" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

            generateToken(res, user);

            res.json({ message: "Librarian logged in successfully!", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
        } catch (error) {
            res.status(500).json({ message: "Server Error" });
        }
    }
];

exports.studentLogin = [
    // Validate email and password
    body("email").isEmail().withMessage("Please provide a valid email address."),
    body("password").notEmpty().withMessage("Password is required."),

    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { email, password } = req.body;
            if (!process.env.JWT_SECRET) return res.status(500).json({ message: "Server configuration error!" });

            const user = await User.findOne({ email, role: "student" });
            if (!user) return res.status(400).json({ message: "Student not found!" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

            generateToken(res, user);

            res.json({ message: "Student logged in successfully!", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
        } catch (error) {
            res.status(500).json({ message: "Server Error" });
        }
    }
];

exports.changePassword = [
  // Validation middleware
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Check if new password is different
      const isSame = await bcrypt.compare(req.body.newPassword, user.password);
      if (isSame) {
        return res.status(400).json({ error: 'New password must be different from current' });
      }

      // Update password
      user.password = req.body.newPassword;
      await user.save();

      res.json({ 
        success: true, 
        message: 'Password updated successfully. Please login again.' 
      });
    } catch (error) {
      console.error('Password change error:', error);
      res.status(500).json({ error: 'Server error during password change' });
    }
  }
];


const generateToken = (res, user) => {
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const cookieOptions = {
        httpOnly: true,
        secure: true, // Must be true for Render's HTTPS
        sameSite: 'none', // Required for cross-origin
        maxAge: 3600000, // 1 hour
        path: '/'
    };

    // Only set domain in production, and let it default to the request domain
    if (process.env.NODE_ENV === 'production') {
        cookieOptions.domain = 'hnb-library-system.onrender.com';
    }

    res.cookie("token", token, cookieOptions);
};

exports.logout = (req, res) => {
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) }); // ✅ Explicit Expiry
    res.json({ message: "Logged out successfully!" });
};



exports.checkSession = async (req, res) => {
    // Check both cookies and Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ 
            success: false,
            message: "Authentication required",
            code: "NO_TOKEN"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verify user exists in database
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
                code: "USER_NOT_FOUND"
            });
        }
        
        res.json({ 
            success: true,
            user: {
                id: user._id,
                role: user.role,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Token verification failed:', error.message);
        res.status(401).json({ 
            success: false,
            message: "Invalid session",
            code: "INVALID_TOKEN",
            expiredAt: error.expiredAt // If token expired
        });
    }
};

