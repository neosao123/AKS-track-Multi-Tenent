const mongoose = require('mongoose');
const Database = require("../models/Database");
const { ORG_URL, END_URL } = require('../config/config');
const moment = require('moment');
require("moment-timezone");

let Schema = mongoose.Schema;
// checkPoint Logs updated and added every scanned participants data   
// checkPoint wise documents added and updated collection  - ckp_1 - all participants
// find room to emit the data in room - by eventCode and checkPoint
exports.create_scanned_participants = async (req, res) => {
    try {
        const { OrganizationCode, address, age, bibNo, category, checkPoint, city, email, emergencyContact, gender, participantCode, participantName, percent, postalCode, qrCode, raceCode, raceEndDate, raceName, raceStartDate, teamName, eventCode, addIP, addDate, entryDate } = req.body;

        let formatString = 'YYYY-MM-DD HH:mm:ss';
        let start = moment(raceStartDate, formatString);
        let end = moment();
        let diffInMilliseconds = Math.abs(start.diff(end));
        let diffDuration = moment.utc(diffInMilliseconds).format('HH:mm:ss');

        const existingOrg = await Database.findOne({ OrganizationCode });
        if (existingOrg) {
            try {
                let conn = await mongoose.createConnection(`${ORG_URL}DB_${OrganizationCode}${END_URL}`, { useNewUrlParser: true, useUnifiedTopology: true });
                console.log('Connected to ' + `DB_${OrganizationCode}`);
                // find room to emit the data in room - 
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
                let Room = await CheckPoint_Room.findOne({ checkPointCode: checkPoint, eventCode: eventCode });
                let roomId = Room.RoomId


                // checkPoint Logs updated every scanned participants data in  
                let checkPointLog = conn.model("checkPointLog", new Schema({
                    eventCode: {
                        type: String,

                    },
                    raceCode: {
                        type: String,

                    },
                    checkPoint: {
                        type: String,

                    },
                    participantCode: {
                        type: String,

                    },
                    percent: {
                        type: String,

                    },
                    addIP: {
                        type: String,

                    },
                    addDate: {
                        type: Date,
                        default: Date.now
                    },
                    timeTaken: {
                        type: String
                    },
                    entryDate: {
                        type: Date,
                        default: Date.now
                    }
                },));


                let existingRecord = await checkPointLog.findOne({ eventCode, checkPoint, raceCode, participantCode });
                if (existingRecord) {
                    let filter = { checkPoint, raceCode }
                    let update = {
                        eventCode,
                        raceCode,
                        checkPoint,
                        participantCode,
                        percent,
                        addIP: req.ip,
                        addDate,
                        entryDate,
                        timeTaken: diffDuration
                    }
                    let options = { new: true }
                    let updateRecord = await checkPointLog.updateOne(filter, update, options)
                } else {
                    let newRecord = await new checkPointLog({
                        eventCode,
                        raceCode,
                        checkPoint,
                        participantCode,
                        percent,
                        addIP: req.ip,
                        addDate,
                        entryDate,
                        timeTaken: diffDuration
                    });
                    let newSavedRecord = await newRecord.save();
                }

                // checkPoint wise documents added collection - ckp_1 - all participants                
                let Scanned_Participants = conn.model(checkPoint, new Schema({
                    organizationCode: {
                        type: String
                    },
                    address: {
                        type: String,
                    },
                    age: {
                        type: Number
                    },
                    bibNo: {
                        type: String
                    },
                    category: {
                        type: String
                    },
                    checkPoint: {
                        type: String
                    },
                    city: {
                        type: String
                    },
                    email: {
                        type: String
                    },
                    emergencyContact: {
                        type: String
                    },
                    gender: {
                        type: String
                    },
                    participantCode: {
                        type: String
                    },
                    participantName: {
                        type: String
                    },
                    percent: {
                        type: String
                    },
                    postalCode: {
                        type: String
                    },
                    qrCode: {
                        type: String
                    },
                    raceCode: {
                        type: String
                    },
                    raceEndDate: {
                        type: String
                    },
                    raceName: {
                        type: String
                    },
                    raceStartDate: {
                        type: String
                    },
                    teamName: {
                        type: String
                    },
                    timestamp: {
                        type: Date,
                        default: Date.now().toPrecision()
                    },
                }));
                let existingParticipant = await Scanned_Participants.findOne({ participantCode });
                if (existingParticipant) {
                    let filter = { participantCode };
                    let update = {
                        address, age, bibNo, category, checkPoint, city, email, emergencyContact, gender, participantCode, participantName, percent, postalCode, qrCode, raceCode, raceEndDate, raceName, raceStartDate, teamName
                    }
                    let options = { new: true }
                    let updateParticipantInCheckpointCollection = await Scanned_Participants.findOneAndUpdate(filter, update, options).then((result) => {

                        res.status(201).json({ err: 201, msg: "Participant updated", data: result });
                    })
                } else {
                    let newParticipant = new Scanned_Participants({
                        address, age, bibNo, category, checkPoint, city, email, emergencyContact, gender, participantCode, participantName, percent, postalCode, qrCode, raceCode, raceEndDate, raceName, raceStartDate, teamName
                    });
                    let savedParticipantInCheckpointCollection = newParticipant.save().then(async (result) => {

                        res.status(200).json({ err: 200, msg: "Participant addedd", data: result })
                    })
                }
            } catch (error) {
                console.log(`Failed to connect to MongoDB for organization ${OrganizationCode}:`, error);
                return res.status(500).json({ err: 500, msg: 'Internal server error' });
            }
        } else {
            res.status(300).json({ err: 300, msg: "Organization not found" });
        }
    } catch (error) {
        res.status(500).json({ err: 500, msg: error.toString() });
    }
}

exports.event_participants = async (req, res) => {
    try {
        const { OrganizationCode, address, age, bibNo, category, checkPoint, city, email, emergencyContact, gender, participantCode, participantName, percent, postalCode, qrCode, raceCode, raceEndDate, raceName, raceStartDate, teamName, eventCode } = req.body;
        const existingOrg = await Database.findOne({ OrganizationCode });
        if (existingOrg) {
            try {
                let conn = await mongoose.createConnection(`${ORG_URL}DB_${OrganizationCode}${END_URL}`, { useNewUrlParser: true, useUnifiedTopology: true });
                console.log('Connected to ' + `DB_${OrganizationCode}`);
                let Event_Participants = conn.model("Event_Participants", new Schema({
                    organizationCode: {
                        type: String
                    },
                    address: {
                        type: String,
                    },
                    age: {
                        type: Number
                    },
                    bibNo: {
                        type: String
                    },
                    category: {
                        type: String
                    },
                    checkPoint: {
                        type: String
                    },
                    city: {
                        type: String
                    },
                    email: {
                        type: String
                    },
                    emergencyContact: {
                        type: String
                    },
                    gender: {
                        type: String
                    },
                    participantCode: {
                        type: String
                    },
                    participantName: {
                        type: String
                    },
                    percent: {
                        type: String
                    },
                    postalCode: {
                        type: String
                    },
                    qrCode: {
                        type: String
                    },
                    raceCode: {
                        type: String
                    },
                    raceEndDate: {
                        type: String
                    },
                    raceName: {
                        type: String
                    },
                    raceStartDate: {
                        type: String
                    },
                    teamName: {
                        type: String
                    },
                    timestamp: {
                        type: Date,
                        default: Date.now().toPrecision()
                    },
                    eventCode: {
                        type: String,
                    },
                }));
                let existingParticipant = await Event_Participants.findOne({ participantCode });
                let totalCount = await Event_Participants.find();
                if (existingParticipant) {
                    res.status(201).json({ err: 201, msg: "Participant already exist" });
                } else {
                    let newParticipant = new Event_Participants({
                        address, age, bibNo, category, checkPoint, city, email, emergencyContact, gender, participantCode, participantName, percent, postalCode, qrCode, raceCode, raceEndDate, raceName, raceStartDate, teamName, eventCode
                    });
                    let savedParticipant = newParticipant.save().then((result) => {
                        res.status(200).json({ err: 200, msg: "Participant added", eventCode: result.eventCode, totalParticipants: totalCount.length, data: result })
                    });
                }
            } catch (error) {
                console.log(`Failed to connect to MongoDB for organization ${OrganizationCode}:`, error);
                return res.status(500).json({ err: 500, msg: 'Internal server error' });
            }
        } else {
            res.status(300).json({ err: 300, msg: "Organization not found" });
        }
    } catch (error) {
        res.status(500).json(error.toString());
    }
}

exports.eventParticipantCount = async (req, res) => {
    try {
        const { OrganizationCode, eventCode, checkPointCode } = req.body;
        const existingOrg = await Database.findOne({ OrganizationCode });
        if (existingOrg) {

            let conn = await mongoose.createConnection(`${ORG_URL}DB_${OrganizationCode}${END_URL}`, { useNewUrlParser: true, useUnifiedTopology: true });
            let Event_Participants = conn.model("Event_Participants", new Schema({
                organizationCode: {
                    type: String
                },
                address: {
                    type: String,
                },
                age: {
                    type: Number
                },
                bibNo: {
                    type: String
                },
                category: {
                    type: String
                },
                checkPoint: {
                    type: String
                },
                city: {
                    type: String
                },
                email: {
                    type: String
                },
                emergencyContact: {
                    type: String
                },
                gender: {
                    type: String
                },
                participantCode: {
                    type: String
                },
                participantName: {
                    type: String
                },
                percent: {
                    type: String
                },
                postalCode: {
                    type: String
                },
                qrCode: {
                    type: String
                },
                raceCode: {
                    type: String
                },
                raceEndDate: {
                    type: String
                },
                raceName: {
                    type: String
                },
                raceStartDate: {
                    type: String
                },
                teamName: {
                    type: String
                },
                timestamp: {
                    type: Date,
                    default: Date.now().toPrecision()
                },
                eventCode: {
                    type: String,
                },
            }));

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

            if (!Room) {
                res.status(300).json({ err: 300, msg: "Room Not found" });
            }
            let participants = await Event_Participants.find({ eventCode });
            if (participants.length === 0) {
                res.status(300).json({ err: 300, msg: "Participants Not found" });
            } else {
                res.status(200).json({ err: 200, msg: "Participants Found", ParticipantCount: participants.length, RoomId: Room.RoomId });
            }
        } else {
            res.status(300).json({ err: 300, msg: "Organization not found" })
        }


    } catch (error) {
        res.status(500).json({ err: 500, msg: error.message })
    }
}