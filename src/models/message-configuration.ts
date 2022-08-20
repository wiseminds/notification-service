import { MailService } from '../services/integration/mail/mail.service'
import { PushService } from '../services/integration/push/push_service'
import { SmsService } from '../services/integration/sms/sms.service'

 

export interface IMessageConfiguration {
    sms: SmsService
    email: MailService
    push: PushService
}