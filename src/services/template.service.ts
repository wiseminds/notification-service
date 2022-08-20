import { ITemplate } from "../models/template";
import { DatabaseService } from "./database.service";

export class TemplateService {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  public saveTemplate = async (template: ITemplate) => {
   return await this.db.saveTemplate(template);
  }

  public async  getTemplate(slug: string): Promise<ITemplate> {
   
    return this.db.getTemplate(slug);
  }
}
