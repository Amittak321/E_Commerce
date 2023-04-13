import Product from "../models/product.schema.js";
import formidable from "formidable";
import fs from "fs";
import { s3DeleteFile, s3FileUpload } from "../services/imageUpload.js";
import Mongoose from "mongoose"; //capital one only

import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/customError.js";
import config from "../config/index.js";
import { resolveSoa } from "dns";
import { findSourceMap } from "module";

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
});



/************************************************************

@GET_PRODUCT
@route http://localhost:4000/api/product
@description Controller used for getting all the products details
@description user and admin can get single products details 
@parameters 
@return product object

*************************************************************/

export const getAllProducts = asyncHandler(async(_req,res)=>{
    const products = await Product.find();

    if (!products)  {
        throw new CustomError("No products found", 404);
    }

    res.status(200).json({
        success:true,
        products
    })
});

/************************************************************

@GET_PRODUCT_BY_ID
@route http://localhost:4000/api/product
@description Controller used for getting single products details
@description user and admin can get single products details 
@return product object

*************************************************************/

export const getProductById = asyncHandler(async(req,res)=>{
   const id =  req.params.id

   if (!id) {
    throw new CustomError("id is missing", 400);
   }
    const product = await Product.findById(id);

    if (!product)  {
        throw new CustomError("No product found", 404);
    }

    res.status(200).json({
        success:true,
        product
    })
});

/*

TODO: assignment to read

model.aggregate([{},{},{},])

$group
$push
$ROOT
$lookup
$project

*/