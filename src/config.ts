interface Config {
  queueIdentifier: string;
  rabbitHost: string;
  templateLocation: string;
  mail: {
    apiKey?: string;
    mailDomain?: string;
    sender?: string;
  };
  sms: {
    apiKey?: string;
    sender?: string;
  };
  push: {
    projectId?: string;
    privateKey?: string;
    clientEmail?: string;
  };
}

const config: Config = {
  queueIdentifier: process.env.QUEUE_IDENTIFIER || "notification-service",
  rabbitHost: process.env.RABBIT_HOST || "amqp://localhost",
  templateLocation: process.env.TEMPLATE_LOCATION || "",
  mail: {
    apiKey: process.env.MAIL_API_KEY,
    mailDomain: process.env.MAIL_DOMAIN_URL,
    sender: process.env.MAIL_SENDER,
  },
  sms: {
    apiKey: process.env.SMS_API_KEY,
    sender: process.env.SMS_SENDER,
  },
  push: {
    projectId: process.env.PUSH_PROJECT_ID,
    privateKey: process.env.PUSH_PRIVATE_KEY,
    clientEmail: process.env.PUSH_CLIENT_EMAIL,
      
  },
};
export default config;
