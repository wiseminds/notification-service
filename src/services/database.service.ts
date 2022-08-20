import { Knex, knex } from "knex";
import { ITemplate } from "../models/template";

export class DatabaseService {
  private instance: Knex;

  static key = "templates";

  constructor() {
    this.instance = knex({
      client: "sqlite3",
      connection: {
        filename: ".tmp/data.db",
      },
      useNullAsDefault: true,
    });
    this.instance.schema
      .createTableIfNotExists(DatabaseService.key, (table) => {
        table.string("slug").primary();
        table.text("text");
        table.text("html");
        table.string("title");
        table.json("data");
      })

      .catch(console.log)
      .then(console.log);
  }

  saveTemplate(template: ITemplate) {
    this.instance(DatabaseService.key)
      // .where({ slug: template.slug })
      .insert(template)
      .onConflict("slug")
      .merge( )
      .then(console.log)
      .catch(console.log)
    // .upsert(template);
  }

  getTemplate(slug: string): Promise<ITemplate> {
    return this.instance(DatabaseService.key)
      .where({ slug })
      .first<ITemplate>();
  }
}
