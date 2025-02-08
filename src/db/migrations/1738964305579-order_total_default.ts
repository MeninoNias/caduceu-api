import { MigrationInterface, QueryRunner } from "typeorm";

export class OrderTotalDefault1738964305579 implements MigrationInterface {
    name = 'OrderTotalDefault1738964305579'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "total" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "total" DROP DEFAULT`);
    }

}
