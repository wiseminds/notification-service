import { config } from "dotenv";
import { exit } from "process";
config();

import { TemplateService } from "./services/template.service";

new TemplateService().seedAll().then((_) => {
  exit(0);
});
