// i PushService = require("./push.service");
import { connect } from "amqplib";
import { default as config } from "../config";
import { IMessage } from "../models/notification.entity";
import { ITemplate } from "../models/template";
import { QueueService } from "./queue.service";
import { TemplateService } from "./template.service";

export class SubscriberService {
  queue: QueueService;
  templateService: TemplateService;
  constructor() {
    this.queue = new QueueService();

    this.templateService = new TemplateService();
  }

  async listen() {
    const conn = await connect(config.rabbitHost);

    const channel = await conn.createChannel();
    await channel.assertQueue(config.queueIdentifier);
    console.log(config.queueIdentifier, "waiting for messages");

    // Listener
    channel.consume(config.queueIdentifier, (msg) => {
      console.log("Received:", msg);
      if (msg !== null) {
        const message = JSON.parse(msg.content.toString());
        console.log("Received:", msg, msg.content.toString());
        switch (msg.properties.type) {
          case "notification":
            let m = message as IMessage;
            this.queue.handle(m, () => {
              channel.ack(msg);
            });
            break;
          case "update-template":
            let template = message as ITemplate;
            console.log(template);
            this.templateService.saveTemplate(template);
            channel.ack(msg);
            break;
          default:
            break;
        }
        channel.ack(msg);
      } else {
        console.log("Consumer cancelled by server");
      }
    });

    console.log("listening for messages", await  this.templateService.getTemplate("test"));
    this.templateService.saveTemplate({
      slug: "test",
      text: "hey {{user.name}}, use this OTP to verify your account",
      title: "Hello {{user.name}}",
      html: "Hello {{user.name}}",
      data: {},
    });
  }
}
