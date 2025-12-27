import mongoose, { Document, Schema, Model } from "mongoose";

export interface IComplaint extends Document {
  title: string;
  description: string;
  category: string;
  priority: string;
  status: "Pending" | "In Progress" | "Resolved";
  dateSubmitted: Date;
}

const ComplaintSchema: Schema<IComplaint> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    priority: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
    dateSubmitted: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

const Complaint: Model<IComplaint> =
  mongoose.models.Complaint ||
  mongoose.model<IComplaint>("Complaint", ComplaintSchema);

export default Complaint;
