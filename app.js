const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 4600;

const usermodel = new mongoose.Schema({
    name: String,
    email: String,
});


const Item = mongoose.model('user', usermodel, 'Dummy');
app.use(bodyParser.json());
console.log('test');

// insert endpoint
app.post('/users/', async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;

        if (name === null || name === undefined || name === "") {
            console.log("null or undefined")
            res.status(500).json({ error: 'UserId empty' });
            return
        }

        await mongoose.connect('mongodb://localhost:27017/myProject');
        const newUser = new Item({ name, email });

        await newUser.save();

        res.send(`obj id: ${newUser._id.toString()}`);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    console.log('userId');
});

//objId get from url
app.get('/users/:objectId', async (req, res) => {
    try {
        const objId = req.params.objectId
        console.log(objId, 'given objid')
        await mongoose.connect('mongodb://localhost:27017/myProject');
        let result_obj = await Item.findById(objId);
        console.log(result_obj, 'result obj id');
        res.send(result_obj);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'wrong obj ID' });
    }
});


//update 
app.patch('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const updatedEmail = req.body.email;
        console.log('update start')

        await mongoose.connect('mongodb://localhost:27017/myProject');
        let result_obj = await Item.findById(userId);
        if (!result_obj) {
            return res.status(404).json({ error: 'User not found' });
        }
        result_obj.email = updatedEmail
        await result_obj.save()
        console.log(result_obj)



        res.json(result_obj);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//Delete 
app.delete('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const deleteEmail = req.body.email;
        console.log('delete start')

        await mongoose.connect('mongodb://localhost:27017/myProject');
        const deletedUser = await Item.findByIdAndRemove(
            userId,
            { email: deleteEmail },
            { new: true }
        );
        console.log('ldelete start2')

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.send(deletedUser);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//List aa users 
app.get('/users/', async (req, res) => {
    const { page = 1, limit = 2 } = req.query;
    try {
        await mongoose.connect('mongodb://localhost:27017/myProject');
        const userList = await Item.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        console.log(userList, 'user List')
        const count = await Item.countDocuments();
        console.log(count, 'count')
        res.json({
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data: userList
        });
        // res.send(userList);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});





