const nedb = require("nedb-promise");
campaignDb = new nedb({ filename: "./databases/campaign.db", autoload:true });

async function getAllCampaigns() {
    return await campaignDb.find({});
}

async function addCampaign(campaign) {
    return await campaignDb.insert(campaign);
}

module.exports = {
    getAllCampaigns,
    addCampaign
}