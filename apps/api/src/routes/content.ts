import { Router } from "express";
import { ContentStatus, ContentType } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { serializeContent } from "../lib/serializers.js";

const router = Router();

const createContentSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  excerpt: z.string().optional().or(z.literal("")),
  body: z.string().min(3),
  featuredImage: z.string().url().optional().or(z.literal("")),
  status: z.nativeEnum(ContentStatus),
  categoryId: z.string().optional().nullable(),
  authorEmail: z.string().email()
});

const updateContentSchema = createContentSchema.partial().extend({
  title: z.string().min(3).optional(),
  slug: z.string().min(3).optional(),
  body: z.string().min(3).optional()
});

async function findAuthorId(authorEmail: string) {
  const author = await prisma.user.findUnique({
    where: { email: authorEmail }
  });

  if (!author) {
    throw new Error("Author not found.");
  }

  return author.id;
}

function contentRouter(type: ContentType) {
  const typedRouter = Router();

  typedRouter.get("/", async (_request, response) => {
    const items = await prisma.content.findMany({
      where: { type },
      include: {
        author: true,
        category: true
      },
      orderBy: { updatedAt: "desc" }
    });

    response.json(items.map(serializeContent));
  });

  typedRouter.post("/", async (request, response) => {
    const payload = createContentSchema.parse(request.body);
    const authorId = await findAuthorId(payload.authorEmail);

    const item = await prisma.content.create({
      data: {
        title: payload.title,
        slug: payload.slug,
        excerpt: payload.excerpt || null,
        body: payload.body,
        featuredImage: payload.featuredImage || null,
        status: payload.status,
        type,
        authorId,
        categoryId: payload.categoryId || null,
        publishedAt: payload.status === ContentStatus.PUBLISHED ? new Date() : null
      },
      include: {
        author: true,
        category: true
      }
    });

    response.status(201).json(serializeContent(item));
  });

  typedRouter.put("/:id", async (request, response) => {
    const payload = updateContentSchema.parse(request.body);
    const existing = await prisma.content.findFirst({
      where: {
        id: request.params.id,
        type
      }
    });

    if (!existing) {
      response.status(404).json({ message: "Content not found." });
      return;
    }

    const data: Record<string, unknown> = {};

    if (payload.title !== undefined) data.title = payload.title;
    if (payload.slug !== undefined) data.slug = payload.slug;
    if (payload.excerpt !== undefined) data.excerpt = payload.excerpt || null;
    if (payload.body !== undefined) data.body = payload.body;
    if (payload.featuredImage !== undefined) data.featuredImage = payload.featuredImage || null;
    if (payload.status !== undefined) {
      data.status = payload.status;
      data.publishedAt = payload.status === ContentStatus.PUBLISHED ? new Date() : null;
    }
    if (payload.categoryId !== undefined) data.categoryId = payload.categoryId || null;
    if (payload.authorEmail) data.authorId = await findAuthorId(payload.authorEmail);

    const item = await prisma.content.update({
      where: { id: request.params.id },
      data,
      include: {
        author: true,
        category: true
      }
    });

    response.json(serializeContent(item));
  });

  return typedRouter;
}

router.use("/posts", contentRouter(ContentType.POST));
router.use("/pages", contentRouter(ContentType.PAGE));

export default router;
