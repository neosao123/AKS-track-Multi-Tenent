const Ports = require("../models/PortManagementMode");
const net = require('net');
const mongoose = require("mongoose");
const DBMODEL = require("../models/Database");
const { ORG_URL, END_URL } = require("../config/config");


// exports.create = async (req, res) => {
//     const { OrganizationCode } = req.body;
//     let conn = await mongoose.createConnection(`mongodb://0.0.0.0:27017/DB_${OrganizationCode}`, { useNewUrlParser: true, useUnifiedTopology: true });
//     let Ports = conn.model("ports", new mongoose.Schema({
//         OrganizationCode: {
//             type: String,
//         },
//         Ports: {
//             type: Array
//         }
//     }))

//     let existingModel = await Ports.findOne({ OrganizationCode })
//     if (existingModel) {
//         res.status(300).send({ err: 300, msg: "Already exist" })
//     } else {
//         let PORT = [];
//         let lastPort;
//         let ExistingPorts = await Ports.findOne({}).sort({ Port: -1 });
//         if (ExistingPorts) {

//             let lastPort = ExistingPorts.Ports.reduce((max, prt) => {
//                 return (prt.portnumber > max) ? prt.portnumber : max;
//             }, 0);

//             for (let i = lastPort + 1; i < lastPort + 6; i++) {
//                 PORT.push({ portnumber: i, status: "off", eventCode: "" });
//             }
//         } else {
//             lastPort = 3001;
//             for (let i = lastPort; i < lastPort + 5; i++) {
//                 PORT.push({ portnumber: i, status: "off", eventCode: "" });
//             }
//         }
//         let portCreated = new Ports({ OrganizationCode, Ports: PORT });
//         portCreated.save()
//         res.status(200).send({ err: 200, msg: "Organization and port created succefully", data: portCreated });
//     }
// }

exports.findAvailablePort = async (req, res) => {
    const { OrganizationCode, eventCode, eventStatus } = req.body;
    let existingOrg = await DBMODEL.findOne({ OrganizationCode });
    if (existingOrg) {    
        let conn = await mongoose.createConnection(`${ORG_URL}DB_${OrganizationCode}${END_URL}`, { useNewUrlParser: true, useUnifiedTopology: true });
        let Ports = conn.model("ports", new mongoose.Schema({
            portnumber: String,
            status: String,
            eventCode: String,
            eventStatus: String
        }));
        let alreadyAssignedPort = await Ports.findOne({ status: "on", eventCode, eventStatus });
        if (alreadyAssignedPort) {
            res.status(300).json({ err: 300, msg: "Port already assigned" })
        } else {
            if (eventStatus === "Start") {
                let freePort = await Ports.findOne({ status: "off" })
                if (freePort?.status === "off") {
                    freePort.status = "on"
                    freePort.eventStatus = "Start"
                    await Ports.findOneAndUpdate(
                        { "portnumber": freePort.portnumber },
                        { $set: { "status": freePort.status, "eventCode": eventCode, "eventStatus": freePort.eventStatus } }
                    );
                    res.status(200).json({ err: 200, msg: "Event " + eventCode + " started on port " + freePort.portnumber, port: freePort.portnumber });
                } else {
                    res.status(300).json({ err: 300, msg: "All Ports are running" });
                }
            }

            if (eventStatus === "Complete") {
                let removePort = await Ports.findOne({ status: "on", eventCode, eventStatus: "Start" })
                if (removePort === null) {
                    res.status(300).json({ err: 300, msg: "Event does not exist" })
                } else {
                    if (removePort?.status === "on") {
                        removePort.status = "off"
                        removePort.eventCode = ""
                        removePort.eventStatus = ""
                    }
                    await Ports.findOneAndUpdate(
                        { "portnumber": removePort?.portnumber },
                        { $set: { "status": "off", "eventCode": "", "eventStatus": "" } }
                    );
                    res.status(200).json({ err: 200, msg: "Event " + eventCode + " Completed and port " + removePort?.portnumber + " is disconnected " });
                }
            }
        }
    } else {
        res.status(300).json({ err: 300, msg: "Organization not found" });
    }
}


