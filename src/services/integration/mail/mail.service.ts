import { type } from 'os';
import { IEmailMessage } from '../../../models/email-message';

export type MailResponse = {error?: any,  data?: any};
export abstract class MailService {
  sender: string;

  constructor(sender: string) {
    this.sender = sender;
  }

  /**
   * @param  {any} data
   * @param  {Function} done
   * @returns Promise
   * send email
   */
  abstract send(data: IEmailMessage): Promise<MailResponse>;
}
