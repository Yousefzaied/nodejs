const mongoose = require("mongoose");
const validtor = require("validator");

const userSchema = new mongoose.Schema({
        firstName:{
            type: String,
            required: true
        },
        lastName:{
            type: String,
            required: true
        },
        email:{
            type: String,
            unique: true,
            required: true,
            validate: [validtor.isEmail, "field must be a valid"]
        },
        password:{
            type: String,
            required: true
        },
        token:{
            type: String
        },
        role: {
            type: String,
            enum: ["USERS", "ADMIN", "MANGER"],
            default: "USERS"
        }
})

const User= mongoose.model("User", userSchema);
module.exports = User;
