const express = require('express')
const Task = require('../models/task')
const { findByIdAndDelete } = require('../models/user')
const auth = require('../middleware/auth')
const router = express.Router()

////////////// post task ////////////
router.post('/tasks',auth,async(req,res)=>{
    try{
        // const task = new Task(req.body)
        const task = new Task({...req.body , owner : req.user._id})
        await task.save()
        res.status(200).send(task)
    }
    catch(error){
        res.status(400).send(error.message)
    }

})
///////////////// get all tasks /////////////////////
router.get('/tasks' , auth , async(req,res)=>{
    try{
        const tasks = await Task.find({})
        res.status(200).send(tasks)
    }
    catch(error){
        res.status(400).send(error.message)
    }
})
///////////// get task by id /////////////////////
router.get('/tasks/:id',auth , async(req , res)=>{
    try{
        // const task = await Task.findById(req.params.id)
        const id = req.params.id
        const  task = await Task.findOne({_id:id , owner : req.user._id})
        if(!task){
            return res.status(404).send('this task is no owned for you ')
        }
        res.send(task)
    }
    catch(error){
        res.status(500).send(error.message)
    }
})
////////////////////// patch task by using id ///////////
router.patch('/tasks/:id' , auth , async(req , res)=>{
    try{
        const task = await Task.findByIdAndUpdate({_id}, req.body , {
            new : true,
            runValidators : true
        })
        if(!task){
            return res.status(404).send('no task')
        }
        res.send(task)
    }
    catch(error){
        res.status(500).send(error.message)
    }
})
//////////////////// delete task by using id //////////////
router.delete('/tasks/:id'  , auth , async(req , res)=>{
    try{
        const task = await Task.findByIdAndDelete(req.body.id)
        if(!task){
            res.status(404).send('No task is found')
        }
        res.status(200).send(task)
    }
    catch(error){
        res.status(500).send(error.message)
    }
})

module.exports = router 
