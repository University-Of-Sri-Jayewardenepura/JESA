import mongoose, { Schema } from "mongoose";

// Define RegTable Schema
const RegTableSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Whatsapp: {
    type: String,
    required: true,
  },
  RegNo: {
    type: String,
    required: true,
  },
});

const RegTable =
  mongoose.models.RegTable || mongoose.model("RegTable", RegTableSchema);

export default RegTable;