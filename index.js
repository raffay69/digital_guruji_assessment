import express from "express";
import { engine } from "express-handlebars";
import mongoose from "mongoose";
import { campaignModel } from "./models/campaigns.model.js";
import { scheduleMail } from "./utils/cronjob.js";
import "dotenv/config";

async function db() {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    if (db) console.log("db connected");
  } catch (e) {
    console.log("db connection failed ", e.message);
  }
}

db();

const app = express();

app.engine("hbs", engine({ extname: "hbs", defaultLayout: false }));
app.set("view engine", "hbs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log("running on 3000");
});

app.get("/", async (req, res) => {
  const sort = req.query.status;
  console.log(sort);
  if (!sort) {
    const allCampaigns = await campaignModel.find().lean();
    res.render("home", { allCampaigns: allCampaigns });
  } else if (sort === "success") {
    const allCampaigns = await campaignModel.find({ status: "success" }).lean();
    res.render("home", { allCampaigns: allCampaigns });
  } else if (sort === "failed") {
    const allCampaigns = await campaignModel.find({ status: "failed" }).lean();
    res.render("home", { allCampaigns: allCampaigns });
  } else if (sort === "pending") {
    const allCampaigns = await campaignModel.find({ status: "pending" }).lean();
    res.render("home", { allCampaigns: allCampaigns });
  }
});

app.get("/submit", (req, res) => {
  res.render("submit");
});

app.post("/handle-submit", async (req, res) => {
  const { campaignName, recepient, mail, delivery } = req.body;
  const campaign = await campaignModel.create({
    campaignName: campaignName,
    recepients: recepient,
    mail: mail,
    delivery: delivery,
  });
  scheduleMail(campaign);
  res.redirect("/");
});
