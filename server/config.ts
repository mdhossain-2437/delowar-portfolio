export const appConfig = {
  contactInboxEmail:
    process.env.CONTACT_INBOX_EMAIL || "mdhossain2437@gmail.com",
  resendApiKey: process.env.RESEND_API_KEY || "",
  emailSender:
    process.env.MAIL_FROM ||
    "Delowar Hossain <portfolio@notifications.delowar.dev>",
  profile: {
    name: process.env.PORTFOLIO_NAME || "Delowar Hossain",
    title: process.env.PORTFOLIO_TITLE || "Product Engineer & AI Explorer",
    location: process.env.PORTFOLIO_LOCATION || "Dhaka, Bangladesh",
    timezone: process.env.PORTFOLIO_TIMEZONE || "GMT+6",
    bio:
      process.env.PORTFOLIO_BIO ||
      "Shipping expressive web/AI products, automations, and developer tools for ambitious teams.",
    availability: process.env.PORTFOLIO_AVAILABILITY || "Open for freelance & consulting",
    avatar:
      process.env.PORTFOLIO_AVATAR ||
      "https://avatars.githubusercontent.com/u/97281919?v=4",
    socials: {
      github: "https://github.com/mdhossain-2437",
      linkedin: "https://www.linkedin.com/in/mdhossain2437/",
      twitter: "https://twitter.com/mdhossain2437",
    },
  },
  publicApiBase:
    process.env.PUBLIC_API_BASE ||
    process.env.PUBLIC_SITE_URL ||
    "http://localhost:5000",
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || "",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
    privateKey: process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
      : "",
    adminEmails: process.env.FIREBASE_ADMIN_EMAILS
      ? process.env.FIREBASE_ADMIN_EMAILS.split(",").map((email) =>
          email.trim().toLowerCase(),
        )
      : ["mdhossain2437@gmail.com"],
  },
};
