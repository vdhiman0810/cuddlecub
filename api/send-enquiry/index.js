const { EmailClient } = require("@azure/communication-email");

const requiredFields = [
  "parentName",
  "email",
  "phone",
  "childAge",
  "startDate",
  "schedule",
  "message",
  "consent",
];

module.exports = async function sendEnquiry(context, req) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    context.res = {
      status: 204,
      headers: corsHeaders,
    };
    return;
  }

  const body = req.body || {};
  const missing = requiredFields.filter((field) => !body[field]);

  if (missing.length > 0) {
    context.res = {
      status: 400,
      headers: corsHeaders,
      body: { error: `Missing required fields: ${missing.join(", ")}` },
    };
    return;
  }

  const connectionString = process.env.ACS_CONNECTION_STRING;
  const senderAddress = process.env.ACS_SENDER_ADDRESS;
  const recipientAddress =
    process.env.ENQUIRY_RECIPIENT_EMAIL ||
    "rosydhiman2@gmail.com,varundhiman08@gmail.com";

  if (!connectionString || !senderAddress || !recipientAddress) {
    context.res = {
      status: 500,
      headers: corsHeaders,
      body: { error: "Email service is not configured." },
    };
    return;
  }

  const emailClient = new EmailClient(connectionString);
  const subject = `New daycare enquiry from ${body.parentName}`;
  const plainText = [
    `Parent name: ${body.parentName}`,
    `Email: ${body.email}`,
    `Phone: ${body.phone}`,
    `Child age: ${body.childAge}`,
    `Desired start date: ${body.startDate}`,
    `Schedule needed: ${body.schedule}`,
    "",
    "Message:",
    body.message,
  ].join("\n");

  try {
    const poller = await emailClient.beginSend({
      senderAddress,
      content: {
        subject,
        plainText,
      },
      recipients: {
        to: recipientAddress
          .split(",")
          .map((address) => ({ address: address.trim() }))
          .filter((recipient) => recipient.address),
      },
      replyTo: [{ address: body.email, displayName: body.parentName }],
    });

    await poller.pollUntilDone();

    context.res = {
      status: 200,
      headers: corsHeaders,
      body: { ok: true },
    };
  } catch (error) {
    context.log.error(error);
    context.res = {
      status: 502,
      headers: corsHeaders,
      body: { error: "Email send failed." },
    };
  }
};
