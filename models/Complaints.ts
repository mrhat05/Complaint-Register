import mongoose, { Document, Schema,Model } from 'mongoose';

export interface IComplaint extends Document {
    title: string;
    description: string;
    categeory: string;
    prioirity: string;
    status: string;
    dateSubmitted: Date;
}


const ComplaintSchema: Schema<IComplaint> = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true }, 
    categeory: { type: String, required: true },
    prioirity: { type: String, required: true },
    status:{enum:['Pending','In progress','Resolved'],type:String,default:'Pending'},
    dateSubmitted: { type: Date, default: Date.now },
});

export const Complaint: Model<IComplaint> = mongoose.model<IComplaint>('Complaint', ComplaintSchema);
    