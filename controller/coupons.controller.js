import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/customError.js";
import Coupons from "../models/coupon.schema.js";

/************************************************************

@CFEATE_COUPONS
@route http://localhost:4000/api/coupon
@description Controller used for creating a new coupon
@description user and admin can create the coupon
@return coupon object with success message "Coupon Created successfully"

*************************************************************/
export const createCoupon = asyncHandler(async(req,res)=>{
    const {code, discount} = req.body;
    if(!code || !discount){
        throw new CustomError("Provide all the details",400);
    }

    const coupon = await Coupons.create({code,discount});

    if (!coupon) {
        throw new CustomError("coupon is not created",400)
    }

    res.status(200).json({
        success : true,
        coupon,
        message :"Coupon Created successfully"
    })
})

/************************************************************

@DEACTIVATE_COUPONS
@route http://localhost:4000/api/coupon/deactive/:couponId
@description Controller used for deactiving the coupon
@description user and admin can update the coupon
@return coupon object with success message "Coupon Deactivated successfully"

*************************************************************/

export const deactiveCoupons = asyncHandler(async(req,res)=>{
    const couponId = req.params.id;

    if (!couponId) {
        throw new CustomError("Coupon id is missing", 400);
    }

    const coupon = await Coupons.findOneAndUpdate(couponId ,{active :false})

    if (!coupon) {
        throw new CustomError("Something went wrong",400)
    }

    res.status(200).json({
        success: true,
        coupon,
        message :"Coupon Deactivated successfully"

    })
})

/************************************************************

@DEACTIVATE_COUPONS
@route http://localhost:4000/api/coupon/deactive/:couponId
@description Controller used for deactiving the coupon
@description user and admin can update the coupon
@return coupon object with success message "Coupon Deactivated successfully"

*************************************************************/


/************************************************************

@DELETE_COUPON
@route http://localhost:4000/api/coupon/deactive/:couponId
@description Controller used for deleting the coupon
@description only admin and moderator can delete the coupon 
@return coupon object with success message "Coupon Deleted successfully"

*************************************************************/

export const deleteCoupons = asyncHandler(async(req,res)=>{
    const couponId = req.params.id;

    if (!couponId) {
        throw new CustomError("Coupon id is missing", 400);
    }

    const coupon = await Coupons.findOneAndDelete(couponId)

    if (!coupon) {
        throw new CustomError("Something went wrong",400)
    }

    res.status(200).json({
        success: true,
        coupon,
        message :"Coupon Deleted successfully"

    })
})

/************************************************************

@GET_ALL_COUPONS
@route http://localhost:4000/api/coupon
@description Controller used for getting all coupons details
@description only admin and moderator can get aall the coupon details
@return all the coupons Object

*************************************************************/

export const getAllCoupons = asyncHandler(async(_req,res)=>{

    const coupons = await Coupons.find();

    if (!coupons) {
        throw new CustomError("coupon not found",400);
      }
    
      res.status(200).json({
        success: true,
        coupons,
        message: "All the coupons",
      });
})