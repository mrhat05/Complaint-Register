import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function fetchAdminEmails(): Promise<string[]> {
  const res = await fetch(
    `${process.env.APP_URL}/api/admin/emails`,
    {
      method: "GET",
      headers: {
        Cookie: `admin_token=${process.env.INTERNAL_ADMIN_TOKEN ?? ""}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch admin emails");
  }

  const data = await res.json();
  return data.emails || [];
}

export async function sendNewComplaintEmail(payload: {
  title: string;
  description: string;
  category: string;
  priority: string;
}) {
  const adminEmails = await fetchAdminEmails();

  if (adminEmails.length === 0) return;

  await transporter.sendMail({
    from: `"Complaint System" <${process.env.SMTP_USER}>`,
    to: adminEmails,
    subject: "New Complaint Submitted",
    html: `
      <h2>New Complaint Submitted</h2>
      <p><strong>Title:</strong> ${payload.title}</p>
      <p><strong>Category:</strong> ${payload.category}</p>
      <p><strong>Priority:</strong> ${payload.priority}</p>
      <p><strong>Description:</strong></p>
      <p>${payload.description}</p>
    `,
  });
}


export async function sendStatusUpdateEmail(payload: {
  title: string;
  status: string;
}) {
  const adminEmails = await fetchAdminEmails();

  if (adminEmails.length === 0) return;

  await transporter.sendMail({
    from: `"Complaint System" <${process.env.SMTP_USER}>`,
    to: adminEmails,
    subject: "Complaint Status Updated",
    html: `
      <h2>Complaint Status Updated</h2>
      <p><strong>Title:</strong> ${payload.title}</p>
      <p><strong>New Status:</strong> ${payload.status}</p>
      <p><strong>Updated On:</strong> ${new Date().toLocaleString()}</p>
    `,
  });
}
