import { MailResponse, MailService } from '../mail.service';
import Email from 'email-templates';
import nodemailer from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';
import config from '../../../../config'; 
import { IEmailMessage } from '../../../../models/email-message';

export class MailgunEmailService extends MailService {
  mailService: Email;

  constructor(sender: string) {
    super(sender);

    this.mailService = new Email({
      message: {
        from: sender,
      },
      send:  process.env.NODE_ENV != 'development',
      preview: process.env.NODE_ENV == 'development',
      transport: nodemailer.createTransport(
        mg({
          auth: {
            api_key: config.mail.apiKey || '',
            domain: config.mail.mailDomain,
          },
        })
      ),
    });
  }

  async send(message: IEmailMessage): Promise<MailResponse> {
    try {
      var data = await this.mailService.send({
        message: message,
        // locals: data.locals || {},
      });
      return { data };
    } catch (error) {
      console.log(error);
      return { error };
    }
  }
}
