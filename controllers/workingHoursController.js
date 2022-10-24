import asyncHandler from "express-async-handler";
import WorkDays from "../models/working-hours.js";
import User from "../models/user.js";
//import e from "express";

export const create_workday = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user.id)
    const workingDays = await WorkDays.findOne({created_by: req.user.id})
    const {day, openingHour, closingHour} = req.body

    const workExists = await WorkDays.findOne({created_by: req.user.id, "workDays.day": day})
    console.log(workExists)
    if(workExists){
        res.json({
            message : "Work day already exists with time"
        })
    }else {
        if(user && workingDays){
            if(workingDays.workDays.length <= 7){
                res.json({
                    error: "Workdays cannot exceed seven days"
                })
            }
    
            const updateWork = await WorkDays.findByIdAndUpdate(workingDays._id, {
                $addToSet : {
                    workDays: [
                        {
                            day,
                            openingHour,
                            closingHour
                        }
                    ]
                }
            }, ({new: true, useAndModify: false}))
    
            if(updateWork){
                res.json({
                    status: "ok",
                    message: "Workdays have been updated",
                    data: workingDays
                })
            }
        }else{
            const newWork = await WorkDays.create({
                created_by: req.user.id,
                workDays: [
                    {
                        day,
                        openingHour,
                        closingHour 
                    }
                ]
            })
            if(newWork){
                res.json({
                    status: "ok",
                    message: "Work day has been created successully",
                    data: newWork
                })
            }else{
                res.json({error: "Invalid data provided"})
            }
        }
    }
})

export const get_single_working_hour = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user.id)
    const workingDays = await WorkDays.findOne({created_by: req.user.id})
    console.log(workingDays.workDays.length)

    if(user && workingDays){
        let singleWorkDay = workingDays.workDays.find( elem => elem._id == req.params.id)

        if(singleWorkDay){
            res.json({
                status: "ok",
                message: "Work day and time retrieved",
                data: singleWorkDay
            })
        }else{
            res.json({
                message: "Work day and time does not exist"
            })
        }
    }else{
        res.json({
            message: "This user has not created a work days and time"
        })
    }
})

export const update_single_working_hour = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user.id)
    const workingDays = await WorkDays.findOne({created_by: req.user.id})
    const {day, openingHour, closingHour} = req.body
    console.log(workingDays.workDays.length)

    if(user && workingDays){
        const singleWorkDay = workingDays.workDays.find( elem => elem._id == req.params.id)

        if(singleWorkDay){
            singleWorkDay.day = day || singleWorkDay.day,
            singleWorkDay.openingHour = openingHour || singleWorkDay.openingHour,
            singleWorkDay.closingHour = closingHour || singleWorkDay.closingHour
        }

        const savedWorkDay = await singleWorkDay.save()
        if(savedWorkDay){
            res.json({
                status: "ok",
                message: "Work day and time updated succesfully",
                data: savedWorkDay
            })
        }
    }else {
        res.json({
            message: "This user does not have work days and time"
        })
    }
})


export const delete_single_working_hour = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user.id)
    const workingDays = await WorkDays.findOne({created_by: req.user.id})
    console.log(workingDays.workDays.length)

    if(user && workingDays){
        let singleWorkDay = workingDays.workDays.find( elem => elem._id == req.params.id)

        const updateWork = await WorkDays.findByIdAndUpdate(workingDays._id, {
            $pullAll : {
                workDays: [singleWorkDay]
            }
        }, ({new: true, useAndModify: false}))

        if(updateWork){
            res.json({
                status: "ok",
                message: "Work day and time deleted successfully",
                data: workingDays
            })
        }else{
            res.json({
                message: "This work day and time don't exist"
            })
        }
    }else {
        res.json({
            message: "This user does not have work days and time"
        })
    }
})