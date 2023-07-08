const { default: mongoose } = require('mongoose');
const Item= require('../models/item')

const createItem= async(req,res)=>{
    try {
        let body= req.body;
        let imageUrls = [];
        const files = req.files.map((file) => ({
          filename: file.originalname,
        }));
        console.log("files", files);
        for (let file of files) {
          console.log(file, "filename");
          imageUrls.push(file.filename);
        }
        console.log("images", imageUrls);
        const obj = {
          name: body.name,
          description: body.description,
          price: body.price,
          images: imageUrls,
          collectionType: body.collectionType,
        };
        const savedFiles = await Item.create(obj);
        res.status(201).send({
          message: "Images uploaded and saved successfully.",
          data: savedFiles,
        });
    } catch (error) {
        console.log(error);
    }
}
const getAllItems=async(req,res)=>{
    try {
        const allItem=await Item.find({})
        if(!allItem){
            return res.status(404).json({status:false, message:"Item not found"})
        }
        return res.status(200).json({status:true, message:"Get All Items", data:allItem})
    } catch (error) {
        console.log(error);
    }
}
const getItemById = async(req,res)=>{
    try {
        const itemId= req.params.itemId;
        if(!mongoose.isValidObjectId(itemId)){
            return res.status(400).json({status:false, message:"Invalid item id"})
        }
        const findItemId= await Item.findById({_id:itemId})
        if(!findItemId){
            return res.status(404).json({status:false, message:"Item not found"})
        }
        return res.status(200).json({status:true, message:"Item found by id", data:findItemId})
    } catch (error) {
        console.log(error);
    }
}

const deleteItem= async(req,res)=>{
    try {
        const itemId= req.params.itemId;
        if(!mongoose.isValidObjectId(itemId)){
            return res.status(400).json({status:false, message:`Invalid item id ${itemId}`});
        }
        const item= await Item.findByIdAndDelete({_id:itemId})
        if(!item){
            return res.status(404).json({status:false, message:"item not found or already deleted"})
        }
        return res.status(200).json({status:true, message:"Item deleted successfully", data:item})
    } catch (error) {
        console.log(error);
    }
}

module.exports={createItem, getAllItems,getItemById, deleteItem}