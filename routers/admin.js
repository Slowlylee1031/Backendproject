const express = require('express')
const admin = require('../models/admin')
const router = new express.Router()

router.post('/', async (req, res) => {
    const adminName = req.body.name;
    const adminPw = req.body.password;
    const dbResult = await getAdmin(adminName);
    // console.log("dbresult:",dbResult);
    if (!dbResult) {
        res.status(400).json({ message: 'Admin not find. Please try again later.'});
        return;
    }
    if (adminName == dbResult.name && adminPw == dbResult.password) {
        res.status(200).json({ message: 'Successful login.'});
    } else {
        res.status(400).json({ message: 'Failed login. Please try again later.'});
    }
})

const getAdmin = async (name) => {
    const adminInfo = await admin.findOne(
        {name}
    );
    return adminInfo;
};


module.exports = router
