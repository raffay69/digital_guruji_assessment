# 📧 Email Campaign Scheduler

A simple email campaign scheduler built using Node.js, Express, MongoDB, Handlebars, and `node-cron`.

## 📄 MongoDB Schema

```js
// models/campaignModel.js

const campaignSchema = new Schema({
  campaignName: {
    type: String,
    required: true,
  },
  recepients: {
    type: [String],
    required: true,
  },
  mail: {
    type: String,
    required: true,
  },
  delivery: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
});
```

---

## 📁 .env Example

```dotenv
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
MAILADDRESS=your-email@example.com
MAILPASSWORD=your-email-password
```
