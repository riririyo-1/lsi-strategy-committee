import { prisma } from "@/libs/prisma/client";
import type { TrendReport } from "@/types/trendReport";
import { ITrendReportRepository } from "../ports/ITrendReportRepository";

export class TrendReportRepository implements ITrendReportRepository {
  async findAll(): Promise<TrendReport[]> {
    const reports = await prisma.trendReport.findMany({
      include: {
        agendaItems: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return reports.map((report) => ({
      id: report.id,
      title: report.title,
      summary: report.summary,
      publishDate: report.publishDate.toISOString(),
      content: report.content || undefined,
      videoUrl: report.videoUrl || undefined,
      posterUrl: report.posterUrl || undefined,
      pdfUrl: report.pdfUrl || undefined,
      speaker: report.speaker || undefined,
      department: report.department || undefined,
      agenda: report.agendaItems.map((item) => item.content),
    }));
  }

  async findById(id: string): Promise<TrendReport | null> {
    const report = await prisma.trendReport.findUnique({
      where: { id },
      include: {
        agendaItems: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!report) {
      return null;
    }

    return {
      id: report.id,
      title: report.title,
      summary: report.summary,
      publishDate: report.publishDate.toISOString(),
      content: report.content || undefined,
      videoUrl: report.videoUrl || undefined,
      posterUrl: report.posterUrl || undefined,
      pdfUrl: report.pdfUrl || undefined,
      speaker: report.speaker || undefined,
      department: report.department || undefined,
      agenda: report.agendaItems.map((item) => item.content),
    };
  }

  async create(data: Omit<TrendReport, "id">): Promise<TrendReport> {
    const { agenda, ...reportData } = data;

    const agendaItems =
      agenda?.map((item, index) => ({
        content: item,
        order: index,
      })) || [];

    const { id, ...reportDataWithoutId } = reportData;
    const createdReport = await prisma.trendReport.create({
      data: {
        ...reportDataWithoutId, // idを除外
        publishDate: new Date(reportData.publishDate),
        agendaItems: { create: agendaItems },
      },
      include: { agendaItems: { orderBy: { order: "asc" } } },
    });

    return {
      id: createdReport.id,
      title: createdReport.title,
      summary: createdReport.summary,
      publishDate: createdReport.publishDate.toISOString(),
      content: createdReport.content || undefined,
      videoUrl: createdReport.videoUrl || undefined,
      posterUrl: createdReport.posterUrl || undefined,
      pdfUrl: createdReport.pdfUrl || undefined,
      speaker: createdReport.speaker || undefined,
      department: createdReport.department || undefined,
      agenda: createdReport.agendaItems.map((item) => item.content),
    };
  }

  async update(
    id: string,
    data: Omit<TrendReport, "id">
  ): Promise<TrendReport> {
    const { agenda, ...reportData } = data;

    // 既存のアジェンダアイテムを削除
    await prisma.agenda.deleteMany({
      where: { trendReportId: id },
    });

    // 新しいアジェンダアイテムを作成
    const agendaItems =
      agenda?.map((item, index) => ({
        content: item,
        order: index,
      })) || [];

    const updatedReport = await prisma.trendReport.update({
      where: { id },
      data: {
        ...reportData,
        publishDate: new Date(reportData.publishDate),
        agendaItems: {
          create: agendaItems,
        },
      },
      include: {
        agendaItems: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return {
      id: updatedReport.id,
      title: updatedReport.title,
      summary: updatedReport.summary,
      publishDate: updatedReport.publishDate.toISOString(),
      content: updatedReport.content || undefined,
      videoUrl: updatedReport.videoUrl || undefined,
      posterUrl: updatedReport.posterUrl || undefined,
      pdfUrl: updatedReport.pdfUrl || undefined,
      speaker: updatedReport.speaker || undefined,
      department: updatedReport.department || undefined,
      agenda: updatedReport.agendaItems.map((item) => item.content),
    };
  }

  async delete(id: string): Promise<void> {
    await prisma.trendReport.delete({
      where: { id },
    });
  }
}
