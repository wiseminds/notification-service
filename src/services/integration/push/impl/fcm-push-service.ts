import { initializeApp, cert } from "firebase-admin/app";
import { getMessaging, Message, Messaging } from "firebase-admin/messaging";
import config from "../../../../config";
import { IPushMessage } from "../../../../models/push-message";
import { ISmsMessage } from "../../../../models/sms-message";
import { MailResponse } from "../../mail/mail.service";
import { PushService } from "../push_service";

initializeApp({
  credential: cert({
    projectId: config.push.projectId,
    privateKey: config.push.privateKey,
    clientEmail: config.push.clientEmail,
  }),
});

export class FcmPushService extends PushService {
  client: Messaging;

  constructor() {
    super();
    this.client = getMessaging();
  }

  buildMessage(data: IPushMessage): Message {
    return {
      notification: data.notification,
      android: {
        notification: {
            // "click_action": "TOP_STORY_ACTIVITY",
          imageUrl: data.image,
        },
      },
      apns: {
        payload: {
          aps: {
            "mutable-content": 1,
          },
        },
        fcmOptions: {
          imageUrl: data.image,
          analyticsLabel: data.analyticsLabel,
        },
      },
      webpush: {
        notification: {
          image: data.image,
        },
      },
      topic: data.topic || "",
    };
  }

  async send(data: IPushMessage): Promise<any> {
    if (data.topic && data.topic.length > 0) {
      return this.client.send({
        topic: data.topic,
        ...this.buildMessage(data),
      });
    }
    return this.client.sendMulticast({
      tokens: data.tokens || [],
      ...this.buildMessage(data),
    });
  }
}
