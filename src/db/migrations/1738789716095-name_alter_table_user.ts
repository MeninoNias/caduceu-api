import { MigrationInterface, QueryRunner } from "typeorm";

export class NameAlterTableUser1738789716095 implements MigrationInterface {
    name = 'NameAlterTableUser1738789716095'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying(120) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    }

}
