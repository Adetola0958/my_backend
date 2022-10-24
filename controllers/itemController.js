import asyncHandler from "express-async-handler";
import Item from "../models/item.js";
import User from "../models/user.js";

export const create_item = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user.id)
    const {itemName, price, size, typeOfItem, qty, description} = req.body

    if(user){
        const item = await Item.create({
            created_by: req.user.id,
            itemName, 
            price,
            size,
            typeOfItem,
            qty,
            availability: true,
            description
        })

        if(item){
            res.json({
                status: "ok",
                message: "Item created successfully",
                data: item
            })
        }else{
            res.json({
                error: "Invalid data inputed"
            })
        }
    }else{
        res.status(400).json({
            error: "User does not exist"
        })
    }

})

export const get_paginated_items = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user.id)

    const pageSize = 10
    const page = Number(req.query.pageNumber) || 1
    const count = await Item.countDocuments({created_by: user._id})
    const items = await Item.find({created_by: user._id})
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1))
    if(user && items){
        res.json({
            status: "ok",
            message: "Paginated Items retrieved",
            data: { 
                items,
                meta: {
                    page,
                    pages: Math.ceil(count / pageSize),
                    total: count,
                }
            }
        })
    }else{
        res.json({
            error: "User does not exist or does not have items" 
        })
    }

})

export const get_items = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user.id)
    const items = await Item.find({created_by: user._id, _id: req.params.id})

    if(user & items){
        res.json({
            status: "ok",
            message: "All items retrieved",
            data: items
        })
    }else{
        res.json({
            error: "User does not existor no items for user"
        })
    }
})

export const get_single_item = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
	const menu = await Item.findOne({ created_by: req.user.id,   _id: req.params.id })
	if (user && menu) {
		res.status(201).json({
			message: 'Item  details',
			status: 'ok',
			data: menu,
		})
	} else {
		throw new Error('Item does not exist')
	}
})