import { MigrationInterface, QueryRunner } from "typeorm";

export class UserClientReleted1738970474852 implements MigrationInterface {
    name = 'UserClientReleted1738970474852'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "clientId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_56f28841fe433cf13f8685f9bc1" UNIQUE ("clientId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_56f28841fe433cf13f8685f9bc1" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_56f28841fe433cf13f8685f9bc1"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_56f28841fe433cf13f8685f9bc1"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "clientId"`);
    }

}
