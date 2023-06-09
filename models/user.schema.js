import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import config from "../config/index";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxLength: [50, "Name must be less than 50"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "password must be at least 8 char"],
      select: flase, // when we query to DB this won't send password with user object
    },
    role: {
      type: String,
      enum: Object.values(AuthRoles),
      default: AuthRoles.USER,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  {
    timestamps: true, // Mongoose will add two properties of type Date to your schema: 1-createdAt , 2-updatedAt
  }
);

// Challenge -1 encrpt the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// add more featuers directly to your schema

userSchema.methods = {
  //compare password
  comparePassword: async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  },

  //generate jwt token
  getJwtToken: function () {
    return jwt.sign(
      {
        _id: this._id,
        role: this.role,
      },
      config.JWT_SCRET,
      {
        expiresIn: config.JWT_EXPIRY,
      }
    );
  },

  //forgot password
  generateForgotPasswordToken: function () {
    const forgotToken = crypto.randomBytes(20).toString("hex");

    //step -1 save to db
    this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(forgotToken)
      .digest("hex");

    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

    //step-2 return values to user
    return forgotToken;
  },
};

export default mongoose.model("User", userSchema);
