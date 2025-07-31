import cron from "node-cron";
import { campaignModel } from "../models/campaigns.model.js";
import nodemailer from "nodemailer";
import "dotenv/config";

export function scheduleMail(campaign) {
  const deliveryDate = new Date(campaign.delivery);
  const minute = deliveryDate.getMinutes();
  const hour = deliveryDate.getHours();
  const day = deliveryDate.getDate();
  const month = deliveryDate.getMonth() + 1;

  console.log(campaign.recepients);

  const cronTime = `${minute} ${hour} ${day} ${month} *`;
  cron.schedule(cronTime, async () => {
    try {
      await sendMail(campaign.campaignName, campaign.recepients, campaign.mail);
      await campaignModel.findByIdAndUpdate(
        { _id: campaign._id },
        { status: "success" }
      );
      console.log("mail successful");
    } catch (e) {
      await campaignModel.findByIdAndUpdate(
        { _id: campaign._id },
        { status: "failed" }
      );
      console.log(`mail failed ${e.message}`);
    }
  });
}

async function sendMail(campaignName, recepients, body) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAILADDRESS,
      pass: process.env.MAILPASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from: process.env.MAILADDRESS,
    to: recepients.join(","),
    subject: campaignName,
    text: body,
  });
}
