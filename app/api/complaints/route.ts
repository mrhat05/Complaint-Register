import dbConnect from '@/lib/mongodb';
import {Complaint} from '@/models/Complaints';

export async function POST(req: Request, res: Response ) {
  await dbConnect();

  const {title, description, category, priority} = await req.json();

  const newComplaint = new Complaint({
    title,
    description,
    category,
    priority
  });

  await newComplaint.save();

  return Response.json({ message: 'Complaint registered successfully', complaint: newComplaint }, { status: 201 });
}