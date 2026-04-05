import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const router = Router();

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional().or(z.literal(""))
});

router.get("/", async (_request, response) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          contents: true
        }
      }
    }
  });

  response.json(categories);
});

router.post("/", async (request, response) => {
  const payload = categorySchema.parse(request.body);

  const category = await prisma.category.create({
    data: {
      name: payload.name,
      slug: payload.slug,
      description: payload.description || null
    }
  });

  response.status(201).json(category);
});

export default router;
