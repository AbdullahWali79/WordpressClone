import { PrismaClient, ContentStatus, ContentType, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@wpclone.local" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@wpclone.local",
      role: UserRole.ADMIN
    }
  });

  const news = await prisma.category.upsert({
    where: { slug: "news" },
    update: {},
    create: {
      name: "News",
      slug: "news",
      description: "Announcements and product updates."
    }
  });

  const guides = await prisma.category.upsert({
    where: { slug: "guides" },
    update: {},
    create: {
      name: "Guides",
      slug: "guides",
      description: "How-to articles and onboarding documentation."
    }
  });

  await prisma.content.upsert({
    where: { slug: "welcome-to-wpclone" },
    update: {},
    create: {
      title: "Welcome to WPClone",
      slug: "welcome-to-wpclone",
      excerpt: "A starter post for your new CMS.",
      body: "<p>This is your first post inside the custom CMS starter.</p>",
      status: ContentStatus.PUBLISHED,
      type: ContentType.POST,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: news.id
    }
  });

  await prisma.content.upsert({
    where: { slug: "getting-started" },
    update: {},
    create: {
      title: "Getting Started",
      slug: "getting-started",
      excerpt: "An onboarding guide page for editors.",
      body: "<p>Edit this page to describe your publishing workflow.</p>",
      status: ContentStatus.PUBLISHED,
      type: ContentType.PAGE,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: guides.id
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
