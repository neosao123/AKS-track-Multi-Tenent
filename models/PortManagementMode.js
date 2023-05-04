const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let PortManagement = new Schema({
    OrganizationCode: {
        type: String,
    },
    Ports: {
        type: Array
    }
});

module.exports = mongoose.model("ManagePort", PortManagement);  