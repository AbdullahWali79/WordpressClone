import { Router } from "express";
import { ContentStatus, ContentType } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { serializeContent } from "../lib/serializers.js";

const router = Router();

router.get("/", async (_request, response) => {
  const [posts, pages, categories, drafts, recent] = await Promise.all([
    prisma.content.count({ where: { type: ContentType.POST } }),
    prisma.content.count({ where: { type: ContentType.PAGE } }),
    prisma.category.count(),
    prisma.content.count({ where: { status: ContentStatus.DRAFT } }),
    prisma.content.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: {
        author: true,
        category: true
      }
    })
  ]);

  response.json({
    stats: { posts, pages, categories, drafts },
    recent: recent.map(serializeContent)
  });
});

export default router;
