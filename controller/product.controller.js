import Product from "../models/product.schema.js";
import formidable from "formidable";
import fs from "fs";
import { s3DeleteFile, s3FileUpload } from "../services/imageUpload.js";
import Mongoose from "mongoose"; //capital one only

import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/customError.js";
import config from "../config/index.js";
import { resolveSoa } from "dns";

/************************************************************

@ADD_PRODUCT
@route http://localhost:4000/api/product
@description Controller used for creating a new product
@description only admin can create a coupon
@description Uses AWS s3 Bucket for image upload
@parameters 
@return product object

*************************************************************/

export const addPorduct = asyncHandler(async (req, res) => {
  const form = formidable({ multiples: true, keepExtensions: true });

  form.parse(req, async function(err,fields,files){
    try {
        if (err) {
            throw new CustomError(err.message || "Something went wrong",500);
        }

        let productId = new Mongoose.Types.ObjectId().toHexString(); // generate a custom ID
        // console.log(files, fields)

        if(!fields.name||fields.price||fields.description||fields.collectionId){
            throw new CustomError("Please fill all the details",400);
        }

        //handling images 
        let imgArrayResp = Promise.all(
            Object.keys(files).map(async(filekey,index)=>{
                const element = files[filekey];

                const data = fs.readFileSync(element.filepath);

                const upload = await s3FileUpload({
                    bucketName:config.S3_BUCKET_NAME,
                    key :`products/${productId}/photo_${index+1}.png`,
                    body : data,
                    contentType : element.mimetype
                })
                return {
                    secue_url :upload.Location
                }

            })
        )

        let imgArray = await imgArrayResp;

        const product = await Product.create({
            _id : productId,
            photos :imgArray,
            ...fields
        });

        if (!product) {
            throw new CustomError("product is not created",400)
            //if something failed. we need to remove images as well
        }

        res.status(200).json({
            success: true,
            product
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message : err.message || "Something went wrong"
        })
    }
  })
})
