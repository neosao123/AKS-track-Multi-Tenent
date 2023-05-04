const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const databaseSchema = new Schema({
    OrganizationCode: {
        type: String,
        required: true
    },
    Ports: {
        type: Array
    },
    dbDate: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model("databaseStore", databaseSchema);