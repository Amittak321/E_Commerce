import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/customError.js";
import Collection from "../models/collection.schema.js";

/************************************************************

@CREATE_COLLECTION
@route http://localhost:4000/api/collection
@description collection controller for creting a new collection 
@parameters name
@return collection Object

*************************************************************/

export const createCollection = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new CustomError("Collection name is requried", 400);
  }

  const collection = await Collection.create({ name });

  res.status(200).json({
    success: true,
    collection,
    message: "Collection created",
  });
});

/************************************************************

@UPDATE_COLLECTION
@route http://localhost:4000/api/collection
@description collection controller for creting a new collection 
@parameters name
@return collection Object

*************************************************************/

export const updateCollection = asyncHandler(async (req, res) => {
  const collectionID = req.params.id;
  if (!collectionID) {
    throw new CustomError("collection id is missing");
  }

  const { name } = req.body;
  if (!name) {
    throw new CustomError("Please enter collection name", 400);
  }

  const collection = await Collection.findByIdAndUpdate(
    collectionID,
    { name },
    { new: true, runValidators: true }
  );

  if (!collection) {
    throw new CustomError("Collection not found",400);
  }

  res.status(200).json({
    success: true,
    collection,
    message: "Collection updated",
  });
});

export const deleteCollection = asyncHandler(async (req, res) => {
  const collectionID = req.params.id;
  if (!collectionID) {
    throw new CustomError("collection id is missing");
  }

  const collection = await Collection.findByIdAndDelete(collectionID);

  if (!collection) {
    throw new CustomError("Collection not found",400);
  }

  collection.remove();

  res.status(200).json({
    success: true,
    message: "Collection deleted"
  });
});

export const getAllCollections = asyncHandler(async (_req, res) => {
  const collections = await Collection.find();

  if (!collections) {
    throw new CustomError("Collection not found",400);
  }

  res.status(200).json({
    success: true,
    collections,
    message: "All the collections",
  });
});
