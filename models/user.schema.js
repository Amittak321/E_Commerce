import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema(
    {
        name : {
            type : String,
            required : [true , "Name is required"],
            maxLength : [50,"Name must be less than 50"],
        },
        email : {
            type : String,
            required : [true , "Email is required"],
            unique : true
        },
        password : {
            type : String,
            required : [true , "Password is required"],
            minLength : [8,"password must be at least 8 char"],
            select : flase   // when we query to DB this won't send password with user object
        },
        role : {
            type :String,
            enum : Object.values(AuthRoles),
            default : AuthRoles.USER
        },
        forgotPasswordToken : String,
        forgotPasswordExpiry : Date
    },
    {
        timestamps : true // Mongoose will add two properties of type Date to your schema: 1-createdAt , 2-updatedAt
    }
);

// Challenge -1 encrpt the password 
userSchema.pre("save", async function(next){
    if(!this.modified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export default mongoose.model("User", userSchema);