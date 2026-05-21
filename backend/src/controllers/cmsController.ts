import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/db';
import { getPrismaErrorMessage } from '../lib/prismaErrors';
import { logAudit } from '../services/auditService';

function paramId(id: string | string[] | undefined): string | undefined {
  if (id === undefined) return undefined;
  return Array.isArray(id) ? id[0] : id;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const getPublicPage = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = String(req.params.slug);
    const page = await prisma.cmsPage.findFirst({
      where: { slug, status: 'PUBLISHED' },
      include: { sections: { orderBy: { sortOrder: 'asc' } } },
    });

    if (!page) {
      res.status(404).json({ message: 'Page not found' });
      return;
    }

    res.json(page);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const listPublicBlogPosts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const posts = await prisma.cmsPage.findMany({
      where: { status: 'PUBLISHED', pageType: 'BLOG_POST' },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        seoDescription: true,
        publishedAt: true,
        sections: { where: { type: 'HERO' }, take: 1 },
      },
    });
    res.json(posts);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const getPublicNavigation = async (req: Request, res: Response): Promise<void> => {
  try {
    const location = (req.query.location as string) || 'header';
    const items = await prisma.cmsNavigation.findMany({
      where: { location, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(items);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const getPublicSettings = async (_req: Request, res: Response): Promise<void> => {
  try {
    const settings = await prisma.cmsSiteSetting.findMany();
    const map: Record<string, unknown> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    res.json(map);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const adminListPages = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pages = await prisma.cmsPage.findMany({
      include: { sections: { orderBy: { sortOrder: 'asc' } } },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(pages);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const adminCreatePage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, slug, pageType, seoTitle, seoDescription, status, sections } = req.body;
    const pageSlug = slug || slugify(title);

    const page = await prisma.cmsPage.create({
      data: {
        title,
        slug: pageSlug,
        pageType: pageType || 'PAGE',
        seoTitle,
        seoDescription,
        status: status || 'DRAFT',
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        sections: sections?.length
          ? {
              create: sections.map((s: { type: string; sortOrder?: number; contentJson: unknown }, i: number) => ({
                type: s.type,
                sortOrder: s.sortOrder ?? i,
                contentJson: s.contentJson,
              })),
            }
          : undefined,
      },
      include: { sections: true },
    });

    await logAudit({
      actorId: req.user?.id,
      action: 'CMS_PAGE_CREATED',
      entityType: 'CmsPage',
      entityId: page.id,
    });

    res.status(201).json(page);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const adminUpdatePage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = paramId(req.params.id);
    if (!id) {
      res.status(400).json({ message: 'Page id required' });
      return;
    }

    const { title, slug, pageType, seoTitle, seoDescription, status, sections } = req.body;

    if (sections) {
      await prisma.cmsSection.deleteMany({ where: { pageId: id } });
      await prisma.cmsSection.createMany({
        data: sections.map((s: { type: string; sortOrder?: number; contentJson: unknown }, i: number) => ({
          pageId: id,
          type: s.type,
          sortOrder: s.sortOrder ?? i,
          contentJson: s.contentJson,
        })),
      });
    }

    const page = await prisma.cmsPage.update({
      where: { id },
      data: {
        title,
        slug,
        pageType,
        seoTitle,
        seoDescription,
        status,
        publishedAt: status === 'PUBLISHED' ? new Date() : undefined,
      },
      include: { sections: { orderBy: { sortOrder: 'asc' } } },
    });

    await logAudit({
      actorId: req.user?.id,
      action: 'CMS_PAGE_UPDATED',
      entityType: 'CmsPage',
      entityId: id,
    });

    res.json(page);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const adminDeletePage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = paramId(req.params.id);
    if (!id) {
      res.status(400).json({ message: 'Page id required' });
      return;
    }

    await prisma.cmsPage.delete({ where: { id } });
    res.json({ message: 'Page deleted' });
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const adminListNavigation = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const items = await prisma.cmsNavigation.findMany({ orderBy: { sortOrder: 'asc' } });
    res.json(items);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const adminUpsertNavigation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { items } = req.body as {
      items: { id?: string; label: string; href: string; sortOrder: number; location?: string }[];
    };

    await prisma.cmsNavigation.deleteMany({});
    await prisma.cmsNavigation.createMany({
      data: items.map((item, i) => ({
        label: item.label,
        href: item.href,
        sortOrder: item.sortOrder ?? i,
        location: item.location || 'header',
        isActive: true,
      })),
    });

    const updated = await prisma.cmsNavigation.findMany({ orderBy: { sortOrder: 'asc' } });
    res.json(updated);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const adminGetSettings = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const settings = await prisma.cmsSiteSetting.findMany();
    res.json(settings);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const adminUpdateSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { settings } = req.body as { settings: { key: string; value: unknown }[] };

    for (const s of settings) {
      await prisma.cmsSiteSetting.upsert({
        where: { key: s.key },
        update: { value: s.value as object },
        create: { key: s.key, value: s.value as object },
      });
    }

    res.json({ message: 'Settings saved' });
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const adminAuditLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const take = Math.min(Number(req.query.limit) || 50, 200);
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take,
    });
    res.json(logs);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};
