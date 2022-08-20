import { uid } from "uid";
import validator from "validator";
import { IChannel } from "../models/channel";
import { IMessageConfiguration } from "../models/message-configuration";
import { IMessage } from "../models/notification.entity";
import { IRecipient } from "../models/recipient";
import { MailgunEmailService } from "./integration/mail/impl/mailgun-email.service";
import { MailResponse } from "./integration/mail/mail.service";
import { TermiiSmsService } from "./integration/sms/impl/termii-sms.service";
import { TemplateProcessorService } from "./template-processor.service";
import { TemplateService } from "./template.service";
import config from "../config";
import { FcmPushService } from "./integration/push/impl/fcm-push-service";

export class QueueService {
  retryLimit: number = 5;
  configuration: IMessageConfiguration;
  templateProcessor: TemplateProcessorService;
  templateService: TemplateService;

  constructor() {
    this.configuration = {
      sms: new TermiiSmsService(config.sms.sender || ""),
      email: new MailgunEmailService(config.mail.sender || ""),
      push: new FcmPushService(),
    };
    this.templateProcessor = new TemplateProcessorService();
    this.templateService = new TemplateService();

    // this
  }

  /**
   * @param  {IMessage} message
   * handle message from queue
   */
  async handle(message: IMessage, done: Function) {
    message.messageId = message.messageId || uid(20);

    // this.logger.log(`Sending message ${message}`);
    const template = (await this.templateService.getTemplate(
      message.template ?? ""
    )) || { text: "", title: "", html: "" };

    // this.logger.log(`Sending message -  ${template}`);
    let recipients = message.recipients;
    let failed: IRecipient[] = [];

    for (let i = 0; i < recipients.length; i++) {
      const user = recipients[i];

      let data = { ...message.data, user };

      const text = this.templateProcessor.render(
        message.text || template.text || "",
        data
      );
      const subject = this.templateProcessor.render(
        message.title || template.title || "",
        data
      );
      const html = this.templateProcessor.render(
        message.html || template.html || "",
        data
      );
      // console.log(subject, text, data);

      let promise: Promise<MailResponse>[] = [];

      if (
        message.channels.includes(IChannel.EMAIL) &&
        validator.isEmail(user.email || "")
      ) {
        // this.logger.log(`Sending message ${user}`);
        promise.push(
          this.configuration.email.send({
            html,
            text,
            subject,
            to: user.email || "",
          })
        );
      }

      if (
        message.channels.includes(IChannel.SMS) &&
        String(text).length > 5 &&
        String(user.phone).length > 5
      ) {
        /// TODO: implement a validator for phone number
        promise.push(
          this.configuration.sms.send({
            to: user.phone || "",
            sms: text || "",
          })
        );
      }

      if (
        message.channels.includes(IChannel.PUSH) &&
        (user.pushToken != null || user.topic != null)
      ) {
        // this.logger.log(`Sending message ${user}`);
        promise.push(
          this.configuration.push.send({
            topic: user.topic,
            tokens: user.pushToken,
            analyticsLabel: message.analyticsLabel,
            image: message.image,
            notification: {
              title: subject,
              body: text,
            },
          })
        );
      }

      const results = await Promise.allSettled(promise);
      console.log(results);
      done();
    }
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
