import { config } from "dotenv";
import { exit } from 'process';
config();

import { TemplateService } from './services/template.service';

new TemplateService().seedAll()

exit(0);