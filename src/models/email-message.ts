export interface IEmailMessage {
    to: string;
    subject: string;
    headers?: Record<string, string>
    text: string;
    html: string;
  }