import { config } from "dotenv";
config();

import { SubscriberService } from "./services/subscriber.service";

new SubscriberService().listen();
