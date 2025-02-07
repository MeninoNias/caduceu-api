import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAlterTableConfirmEmail1738901721272 implements MigrationInterface {
    name = 'UserAlterTableConfirmEmail1738901721272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "emailConfirm" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailConfirm"`);
    }

}
