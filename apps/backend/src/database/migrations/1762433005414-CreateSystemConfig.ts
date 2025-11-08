import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSystemConfig1762433005414 implements MigrationInterface {
  name = 'CreateSystemConfig1762433005414';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "system_config" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255) NOT NULL, "value" text NOT NULL, "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_5f2e19a79b923fe92ff95fa1c5e" UNIQUE ("key"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "system_config"`);
  }
}
