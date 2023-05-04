const mongoose = require('mongoose');
const { END_URL, ORG_URL } = require('../config/config');
const Database = require('../models/Database');
let Schema = mongoose.Schema;

exports.newRoom = async (req, res) => {
    try {
        const { checkPointCode, OrganizationCode, RoomId, eventCode } = req.body;
        const existingOrg = await Database.findOne({ OrganizationCode });
        if (existingOrg) {
            let conn = await mongoose.createConnection(`${ORG_URL}DB_${OrganizationCode}${END_URL}`, { useNewUrlParser: true, useUnifiedTopology: true });
            let CheckPoint_Room = conn.model("CheckPoint_Rooms", new Schema({
                checkPointCode: {
                    type: String
                },
                eventCode: {
                    type: String
                },
                RoomId: {
                    type: String
                }
            }));
            let existingRoom = await CheckPoint_Room.findOne({ eventCode, checkPointCode, RoomId: `${eventCode}_${checkPointCode}` });
            if (existingRoom) {
                res.status(300).json({ err: 300, msg: `Room for ${existingRoom.checkPointCode} is alredy created RoomId of ${existingRoom.RoomId}` })
            } else {
                let newCheckpointRoom = new CheckPoint_Room({
                    checkPointCode, RoomId: `${eventCode}_${checkPointCode}`, eventCode
                })
                newCheckpointRoom.save().then((result) => {
                    res.status(200).json({ err: 200, msg: "Room created successfully", checkPointCode: result.checkPointCode, RoomId: result.RoomId })
                })
            }
        } else {
            res.status(300).json({ err: 300, msg: "Organization not found" })
        }
    } catch (error) {
        res.status(500).json(error.toString());
    }
}


exports.fetchRoom = async (req, res) => {
    try {
        const { checkPointCode, OrganizationCode, RoomId, eventCode } = req.body;
        const existingOrg = await Database.findOne({ OrganizationCode });
        if (existingOrg) {
            let conn = await mongoose.createConnection(`${ORG_URL}DB_${OrganizationCode}${END_URL}`, { useNewUrlParser: true, useUnifiedTopology: true });
            let CheckPoint_Room = conn.model("CheckPoint_Rooms", new Schema({
                checkPointCode: {
                    type: String
                },
                eventCode: {
                    type: String
                },
                RoomId: {
                    type: String
                }
            }));
            let Room = await CheckPoint_Room.findOne({ eventCode, checkPointCode });
            console.log(Room)
            if (Room) {
                let roomId = Room.RoomId
                res.status(200).json({ err: 200, msg: `Room Id found`, RoomId: roomId });
            } else {
                res.status(300).json({ err: 300, msg: `Room not found` });
            }
        } else {
            res.status(300).json({ err: 300, msg: "Organization not found" })

        }
    } catch (error) {
        res.status(500).json({ err: 500, msg: error.toString() })
    }
}