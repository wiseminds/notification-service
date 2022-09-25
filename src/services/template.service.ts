import { opendirSync, readFileSync, readdirSync } from "fs";
import { ITemplate } from "../models/template";
import { minify } from "html-minifier";
import { DatabaseService } from "./database.service";
import config from "../config";

export class TemplateService {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  public saveTemplate = async (template: ITemplate) => {
    return await this.db.saveTemplate(template);
  };

  public async getTemplate(slug: string): Promise<ITemplate> {
    return this.db.getTemplate(slug);
  }

  async seedAll() {
    // await setTimeout(async () => {}, 3000);
    const dir = readdirSync(config.templateLocation);
    for (const dirName of dir) {
      console.log(dirName);
      const template = this.seed(dirName);
      // console.log(template);
      if (template != null) {
       const saved = await this.saveTemplate(template);
      //  console.log(saved, await this.db.getTemplate(dirName))
      }
    }
    // console.log(dir.readSync())

    // const values = Object.values(EmailTemplates);
    // // console.log(values)
    // for (let index = 0; index < values.length; index++) {
    //   const element = values[index];
    //   await this.publisher.generateTemplate(this.seed(element));
    // }

    // this.publisher.generateTemplate(  await  this.seed(Templates.VERIFY));
    // this.publisher.generateTemplate( await  this.seed(Templates.RESET));
  }

  seed(key: string): ITemplate {
    // readFile(`${__dirname}/files/${key}/html.hbs`, console.log)
    let html = this.readFile(`${config.templateLocation}/${key}/html.hbs`);
    let text = this.readFile(`${config.templateLocation}/${key}/text.hbs`);
    let title = this.readFile(`${config.templateLocation}/${key}/subject.hbs`);

    html = minify(html, {
      removeAttributeQuotes: true,
    });

    // console.log({ html, text, title, slug: key, data: {} })

    return { html, text, title, slug: key, data: {} };
  }

  readFile(path: string): any {
    try {
      return readFileSync(path).toString();
    } catch (error) {
      console.log(error);
    }
  }
}
