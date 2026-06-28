import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/db';
import { getPrismaErrorMessage } from '../lib/prismaErrors';
import { logAudit } from '../services/auditService';
import {
  SITE_PAGE_REGISTRY,
  defaultSectionsForPage,
  registryBySlug,
} from '../lib/sitePagesRegistry';
import { CmsSectionType, Prisma } from '@prisma/client';

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
                type: s.type as CmsSectionType,
                sortOrder: s.sortOrder ?? i,
                contentJson: s.contentJson as Prisma.InputJsonValue,
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
          type: s.type as CmsSectionType,
          sortOrder: s.sortOrder ?? i,
          contentJson: s.contentJson as Prisma.InputJsonValue,
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
        publishedAt: status === 'PUBLISHED' ? new Date() : status === 'DRAFT' ? null : undefined,
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

export const adminGetRegistry = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pages = await prisma.cmsPage.findMany({
      include: { sections: { orderBy: { sortOrder: 'asc' } } },
    });
    const bySlug = new Map(pages.map((p) => [p.slug, p]));

    const merged = SITE_PAGE_REGISTRY.map((def) => {
      const existing = bySlug.get(def.slug);
      return {
        ...def,
        id: existing?.id ?? null,
        status: existing?.status ?? 'NOT_CREATED',
        sectionCount: existing?.sections.length ?? 0,
        updatedAt: existing?.updatedAt ?? null,
      };
    });

    const extraPages = pages
      .filter((p) => !registryBySlug(p.slug))
      .map((p) => ({
        slug: p.slug,
        path: `/p/${p.slug}`,
        title: p.title,
        group: 'Custom',
        id: p.id,
        status: p.status,
        sectionCount: p.sections.length,
        updatedAt: p.updatedAt,
      }));

    res.json({ pages: [...merged, ...extraPages], groups: [...new Set(SITE_PAGE_REGISTRY.map((d) => d.group))] });
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const adminSyncPages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const publish = req.body?.publish === true;
    let created = 0;
    let skipped = 0;

    for (const def of SITE_PAGE_REGISTRY) {
      const existing = await prisma.cmsPage.findUnique({ where: { slug: def.slug } });
      if (existing) {
        skipped++;
        continue;
      }

      const sections = defaultSectionsForPage(def);
      await prisma.cmsPage.create({
        data: {
          slug: def.slug,
          title: def.title,
          pageType: def.pageType || 'PAGE',
          seoTitle: def.title,
          seoDescription: `QuickDoctor — ${def.title}`,
          status: publish ? 'PUBLISHED' : 'DRAFT',
          publishedAt: publish ? new Date() : null,
          sections: {
            create: sections.map((s, i) => ({
              type: s.type as CmsSectionType,
              sortOrder: s.sortOrder ?? i,
              contentJson: s.contentJson as Prisma.InputJsonValue,
            })),
          },
        },
      });
      created++;
    }

    await logAudit({
      actorId: req.user?.id,
      action: 'CMS_PAGES_SYNCED',
      entityType: 'CmsPage',
      entityId: 'registry',
    });

    res.json({ message: `Sync complete. Created ${created}, skipped ${skipped} existing.`, created, skipped });
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const adminResetPageTemplate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = paramId(req.params.id);
    if (!id) {
      res.status(400).json({ message: 'Page id required' });
      return;
    }

    const existing = await prisma.cmsPage.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: 'Page not found' });
      return;
    }

    const def = registryBySlug(existing.slug);
    if (!def) {
      res.status(400).json({ message: 'No template registered for this page slug' });
      return;
    }

    const sections = defaultSectionsForPage(def);
    await prisma.cmsSection.deleteMany({ where: { pageId: id } });
    await prisma.cmsSection.createMany({
      data: sections.map((s, i) => ({
        pageId: id,
        type: s.type as CmsSectionType,
        sortOrder: s.sortOrder ?? i,
        contentJson: s.contentJson as Prisma.InputJsonValue,
      })),
    });

    const page = await prisma.cmsPage.findUnique({
      where: { id },
      include: { sections: { orderBy: { sortOrder: 'asc' } } },
    });

    await logAudit({
      actorId: req.user?.id,
      action: 'CMS_PAGE_TEMPLATE_RESET',
      entityType: 'CmsPage',
      entityId: id,
    });

    res.json(page);
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
