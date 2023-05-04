const DBMODEL = require("../models/Database");
const mongoose = require('mongoose');
const fs = require("fs");

// Create database with participants
// exports.createDB = async (req, res) => {
//     try {
//         const { OrganizationCode, dbCollectionName } = req.body;
//         const { address, age, bibNo, category, checkPoints, city, email, emergencyContact, gender, participantCode, participantName, percent, postalCode, qrCode, raceCode, raceEndDate, raceName, raceStartDate, teamName } = req.body
//         let existingDatabase = await DBMODEL.findOne({ OrganizationCode });
//         if (existingDatabase) {
//             const existingDB = mongoose.connection.useDb(OrganizationCode);
//             const ExistingDBModel = existingDB.model(existingDatabase.dbCollectionName, new mongoose.Schema({
//                 address: {
//                     type: String,
//                 },
//                 age: {
//                     type: Number
//                 },
//                 bibNo: {
//                     type: String
//                 },
//                 category: {
//                     type: String
//                 },
//                 checkPoints: {
//                     type: Array
//                 },
//                 city: {
//                     type: String
//                 },
//                 email: {
//                     type: String
//                 },
//                 emergencyContact: {
//                     type: String
//                 },
//                 gender: {
//                     type: String
//                 },
//                 participantCode: {
//                     type: String
//                 },
//                 participantName: {
//                     type: String
//                 },
//                 percent: {
//                     type: String
//                 },
//                 postalCode: {
//                     type: String
//                 },
//                 qrCode: {
//                     type: String
//                 },
//                 raceCode: {
//                     type: String
//                 },
//                 raceEndDate: {
//                     type: String
//                 },
//                 raceName: {
//                     type: String
//                 },
//                 raceStartDate: {
//                     type: String
//                 },
//                 teamName: {
//                     type: String
//                 },
//                 timestamp: {
//                     type: Date,
//                     default: Date.now().toPrecision()
//                 },
//             }));
//             const newDocument = new ExistingDBModel({
//                 participantName, address, address, age, bibNo, category, checkPoints, city, email, emergencyContact, gender, participantCode, participantName, percent, postalCode, qrCode, raceCode, raceEndDate, raceName, raceStartDate, teamName
//             });
//             await newDocument.save();
//             res.status(200).send({ status: 200, message: "Database already exists, new document created successfully", newDocument });
//             return;
//         } else {
//             const db = mongoose.connection.useDb(OrganizationCode); // specify the name of the new database here
//             // create a Mongoose model for the new database
//             const NewDB = await db.model(dbCollectionName, new mongoose.Schema({
//                 address: {
//                     type: String,
//                 },
//                 age: {
//                     type: Number
//                 },
//                 bibNo: {
//                     type: String
//                 },
//                 category: {
//                     type: String
//                 },
//                 checkPoints: {
//                     type: Array
//                 },
//                 city: {
//                     type: String
//                 },
//                 email: {
//                     type: String
//                 },
//                 emergencyContact: {
//                     type: String
//                 },
//                 gender: {
//                     type: String
//                 },
//                 participantCode: {
//                     type: String
//                 },
//                 participantName: {
//                     type: String
//                 },
//                 percent: {
//                     type: String
//                 },
//                 postalCode: {
//                     type: String
//                 },
//                 qrCode: {
//                     type: String
//                 },
//                 raceCode: {
//                     type: String
//                 },
//                 raceEndDate: {
//                     type: String
//                 },
//                 raceName: {
//                     type: String
//                 },
//                 raceStartDate: {
//                     type: String
//                 },
//                 teamName: {
//                     type: String
//                 },
//                 timestamp: {
//                     type: Date,
//                     default: Date.now().toPrecision()
//                 },
//             }))
//             // Create a new document in the new database
//             const newDocument = new NewDB({
//                 participantName, address, address, age, bibNo, category, checkPoints, city, email, emergencyContact, gender, participantCode, participantName, percent, postalCode, qrCode, raceCode, raceEndDate, raceName, raceStartDate, teamName
//             });
//             await newDocument.save();
//             let newDatabase = new DBMODEL({ OrganizationCode, dbCollectionName }).save().then(async (result) => {
//                 res.status(201).send({ status: 201, data: { newDataBase: result, newDocument }, message: "Database Created successfully" });
//             });
//         }
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

// Create database without participants 

exports.createDB = async (req, res) => {
    try {
        const { OrganizationCode } = req.body;
        let existingDatabase = await DBMODEL.findOne({ OrganizationCode });
        if (existingDatabase) {
            res.status(300).send({ status: 300, message: "Database already exists" });
            return;
        } else {
            let PORT = [];
            let lastPort;
            let ExistingPortModel = await DBMODEL.findOne({}).sort({ Ports: -1 });
            if (ExistingPortModel) {
                let lastPort = ExistingPortModel.Ports.reduce((max, prt) => {
                    return (prt.portnumber > max) ? prt.portnumber : max;
                }, 0);
                for (let i = lastPort + 1; i < lastPort + 6; i++) {
                    PORT.push({ portnumber: i, status: "off", eventCode: "", eventStatus: "" });
                }
            } else {
                lastPort = 3001;
                for (let i = lastPort; i < lastPort + 5; i++) {
                    PORT.push({ portnumber: i, status: "off", eventCode: "", eventStatus: "" });
                }
            }
            const db = mongoose.connection.useDb("DB_" + OrganizationCode);
            // Create 5 ports - 
            const Ports = await db.model("Port", new mongoose.Schema({
                portnumber: String,
                status: String,
                eventCode: String,
                eventStatus: String
            }));
            PORT.map(async (data) => {
                const port = new Ports({
                    portnumber: data.portnumber,
                    status: data.status,
                    eventCode: data.eventCode,
                    eventStatus: data.eventStatus
                })
                await port.save();
            })


            let newDatabase = new DBMODEL({ OrganizationCode, Ports: PORT }).save().then(async (result) => {
                res.status(200).send({ status: 200, data: result, message: "Database Created successfully" });
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.truncateDB = async (req, res) => {
    // try {
    //     let data = await DBMODEL.find();

    //     data.map((result) => {
    //         result.OrganizationCode.dropDatabase();
    //     })
    //     res.status(200).json({ err: 200, data, msg: "Data truncated!" });
    // } catch (err) {
    //     console.log(err)
    // }
}