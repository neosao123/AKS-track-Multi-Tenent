const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let Participant = new Schema({
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
    checkPoints: {
        type: Array
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
});

module.exports = mongoose.model('Participant', Participant);