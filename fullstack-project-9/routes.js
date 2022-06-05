const express = require('express');
const router = express.Router();
const {User, Course} = require('./models');
const { asyncHandler } = require('./middleWare/asyncHandler')
const { userAuthentication } =  require('./middleWare/userAuthentication')

// Routes for Authenticated Users
//Create a User
router.post('/users', asyncHandler(async(req,res) => {
    try{
        await User.create(req.body)
        res.status(201).location("/").end();
    }catch(err){
        if(err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError"){
            const errors = err.errors.map(er => er.message);
            res.status(400).json({errors})
        }else{
            throw err
        }
    }
}));
// Get a User 
router.get('/users', userAuthentication, asyncHandler(async(req,res) => {
    try{
        const user = req.currentUser
        res.status(200).json({
           id: user.id,
           firstName: user.firstName,
           lastName: user.lastName,
           emailAddress: user.emailAddress
        })
    }catch(err){
        throw err
    }
}))

// Routes for Courses

// Return Multiple courses
router.get('/courses', asyncHandler(async(req, res) => {
    try{
    const courses = await Course.findAll({
        attributes: {exclude: ["createdAt", "updatedAt"]},
        include: [{
            model: User,
            as: "User",
            attributes: ["firstName", "lastName"]
        }]
    });
    res.status(200).json(courses)
    }catch(err){
        throw err
    }


}))
// Return single course
router.get('/courses/:id', asyncHandler(async(req,res) => {
    try{
        const course = await Course.findOne({
            where: {
                id: req.params.id
            },
            attributes: {exclude: ["createdAt", "updatedAt"]},
            include: [{
                model: User,
                as: "User",
                attributes: ["firstName", "lastName"]
            }]
        })
        if(course){
            res.status(200).json({
                Course: course
            })
        }else{
            res.status(404).json({"Message": "Sorry Course Not Found"})
        }
        // Handle other errors
    }catch(err){
        throw err
    }

}))

// Create single course
router.post('/courses', userAuthentication, asyncHandler(async(req,res) => {
    try{
        const course = await Course.create(req.body)
        res.status(201).location(`/courses/${course.id}`).end();
    }catch(err){
        if(err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError"){
            const errors = err.errors.map(er => er.message);
            res.status(400).json({errors})
        }else{
            throw err
        }
    }
}))

// Update a course on the database
router.put('/courses/:id', userAuthentication, asyncHandler(async(req,res) => {
    try{
        const user = req.currentUser
        const course = await Course.findByPk(req.params.id);
        if(course.userId === user.id){
            const updatedCourse = await course.update(req.body)
            res.status(204).json({
                UpdatedCourse: updatedCourse
            })
        }else{
            res.status(403).json({"Message": "Cannot Update a course you didnt create"})
        }
        // Handle errors
    }catch(err){
        if(err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError"){
            const errors = err.errors.map(er => er.message);
            res.status(400).json({errors})
        }else{
            throw err
        }
    }

}))

// Delete a course
router.delete('/courses/:id', userAuthentication, asyncHandler(async(req, res) => {
    // Delete a course
    const user = req.currentUser;
    const course = await Course.findByPk(req.params.id);
    if(course){
        if(course.userId === user.id){
            await course.destroy()
            res.status(204).end()
        }else{
            res.status(403).json({"Message": "Cannot delete a course you didnt create"})
        }
    }else{
        res.status(404).json({"Message": "Course Not Found"})
    }
}))

module.exports = router;