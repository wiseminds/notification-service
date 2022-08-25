export interface IEmailMessage {
    from?: string;
    to: string;
    subject: string;
    headers?: Record<string, string>
    text: string;
    html: string;
  }