import { config } from "dotenv";
config();

import { SubscriberService } from "./services/subscriber.service";
import { TemplateService } from './services/template.service';

new SubscriberService().listen();

new TemplateService().seedAll()