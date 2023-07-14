import dotenv from 'dotenv'
import joi from 'joi'
import Product from '../model/Product'
import { ProductSchema } from '../schemas/Product'
dotenv.config
 

const getall = async (req,res)=>{
    try {
        const product = await Product.find()
        if(product.length == 0){
            return res.status(400).json({
                message : "Không có sản phẩm nào "
            })
        }
        res.status(200).json({
            message : "Lấy thành công ",
            product
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}
const getOne = async ( req,res ) =>{
    try {
        const product = await Product.findById(req.params.id)
        if(!product || product.length==0){
            return res.status(400).json({
                message : "Không có Sản phẩm nào "
            })
        }
        res.status(200).json({
            message: "lấy sẩn phẩm thành công",
            product,
        })
    } catch (error) {
        res.status(400).json({
            message: error.message,

        })
    }
}
const deleteProduct = async ( req,res ) =>{
    try {
        const product = await product.findByIdAndDelete(req.params.id)
        if(!product){
            return res.json({
                message : "Xóa thất bại"
            })
        }
        res.json({
            message: "Xóa thành công ",
            product,
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}
const createProduct = async(req, res) =>{
   const {product_name} = req.body;
    try {
        const {error} = ProductSchema.validate(req.body);
        if(error){
            return res.status(400).json({
                message :error.details[0].message
            })
        }
        const data = await Product.findOne({product_name})
        if(data ){
            return res.status(400).json({
                message : "Sản phẩm đã tồn tại"
            })
        }

        const product  = await Product.create(req.body);
        if(!product){
            return res.json({
                message : "Thêm thất bại"
            })
        }
        return res.status(400).json({
            message : "thêm thành công ",
            product
        })

    } catch (error) {
          res.status(400).json({
            message : error.message,
          })
    }
}
 const updateProduct = async (req,res)=>{
    
    try {
        const data = await Product.findOne({product_name})
        if(data ){
            return res.status(400).json({
                message : "Sản phẩm đã tồn tại"
            })
        }

        const {error} = ProductSchema.validate(req.body);
        if(error){
            return res.status(400).json({
                message :error.details[0].message
            })
        }

        const product = await Product.findByIdAndUpdate(req.params.id,req.body,{new : true})
        if(!product){
            return res.status(400).json({
                message: 'không có sản phẩm nào'
            })
        }
        res.json({
            message:"Cập nhật thành công"
        })
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
 }
export {getOne,getall,createProduct,deleteProduct,updateProduct}