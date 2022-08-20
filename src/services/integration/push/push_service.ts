import { IPushMessage } from '../../../models/push-message'; 
import { MailResponse } from '../mail/mail.service';

export abstract class PushService {
 

 

  /**
   * @param  {any} data
   * @param  {Function} done
   * @returns Promise
   * send push notification
   */
  abstract send(data: IPushMessage): Promise<any>
}
