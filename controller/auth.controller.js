import User from "../models/user.schema";
import asyncHandler from "../services/asyncHandler";
import CustomError from "../utils/customError";
import mailHelper from "../utils/mailHelper";

export const cookieOptions = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
  //could be in a separate file in util
};

/************************************************************

@SIGNUP 
@route http://localhost:4000/api/auth/signup
@description User signup controller for creting a new user 
@parameters name , email , password
@return User Object

*************************************************************/

export const signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new CustomError("Please fill all the fields", 400);
  }

  //check if user exists
  const exsitingUser = await User.findOne({ email });

  if (exsitingUser) {
    throw new CustomError("User already exists", 400);
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = user.getJwtToken();
  user.password = undefined; //select false won't work on creating a document

  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    token,
    user,
  });
});

/************************************************************

@LOGIN 
@route http://localhost:4000/api/auth/login
@description User login controller for user 
@parameters email, password
@return User Object

*************************************************************/

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError("Please fill all the fields", 400);
  }

  //check email exsist or not
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new CustomError(
      "login failed, Please enter correct email and password",
      400
    );
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new CustomError(
      "login failed, Please enter correct email and password",
      400
    );
  }

  const token = user.getJwtToken();
  user.password = undefined;
  res.cookie("token", token, cookieOptions);
  res.status(200).json({
    success: true,
    token,
    user,
  });
});

/************************************************************

@LOGOUT 
@route http://localhost:4000/api/auth/logout
@description User logout by clering the cookies
@parameters 
@return success message

*************************************************************/

export const logout = asyncHandler(async (_req, res) => {
  // res.clearCookie()
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "logout",
  });
});

/************************************************************

@FORGOT_PASSWORD
@route http://localhost:4000/api/auth/password/forgot
@description User will submit email and we will generate a token
@parameters email
@return success message - email send 

*************************************************************/

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new CustomError("Please enter a email", 400);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError("Invalid user", 404);
  }

  const resetToken = user.generateForgotPasswordToken();

  // await user.save() ; // it will create a problem, required all the feilds
  //solution
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/password/reset/${resetToken}`;

  const text = `Your passeord reset url us 
  \n\n ${resetUrl}\n\n`;

  try {
    await mailHelper({
      email: user.email,
      subject: "Password Reset email",
      text: text,
    });

    res.status(200).json({
      success: true,
      message: `Email send to ${user.email}`,
    });
  } catch (err) {
    //rollback - clear fields and save
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    user.save({validateBeforeSave:false});

    throw new CustomError(err.message || 'Email sent failure', 500);
  }
});
