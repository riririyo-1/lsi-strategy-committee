import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // TrendReportテーブルの全データを取得
    const reports = await prisma.trendReport.findMany({
      include: {
        agendaItems: true,
      },
    });

    console.log("== TrendReport テーブルの内容 ==");
    console.log(JSON.stringify(reports, null, 2));

    // レポート数を表示
    console.log(`\n合計: ${reports.length}件のレポートが見つかりました`);
  } catch (error) {
    console.error("エラーが発生しました:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
