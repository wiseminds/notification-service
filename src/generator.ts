import { config } from "dotenv";
config();

import { TemplateService } from './services/template.service';

new TemplateService().seedAll()