import { SmsService } from "../sms.service";
import axios, { AxiosInstance } from "axios";
import { MailResponse } from "../../mail/mail.service";
import { ISmsMessage } from "../../../../models/sms-message";
import config from "../../../../config";

export class TermiiSmsService extends SmsService {
  apiKey: string;
  client: AxiosInstance;
  constructor(sender: string) {
    super(sender);

    this.apiKey = config.sms.apiKey || "";
    this.client = axios.create({
      baseURL: "https://termii.com/api/sms",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async send(data: ISmsMessage): Promise<MailResponse > {
    var payload = {
      to: data.to,
      from: this.sender,
      sms: data.sms,
      type: "plain",
      channel: "generic", //'dnd', //'
      api_key: this.apiKey,
    };

    try {
      let response = await this.client.post("/send", payload);
      if (response.data) {
        return { data };
      }
      return { error: "" };
    } catch (error) {
      console.log(error);
      return { error };
    }
  }
}
