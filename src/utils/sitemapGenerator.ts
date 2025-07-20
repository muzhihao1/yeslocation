/**
 * 站点地图生成器
 * 用于生成 XML 格式的站点地图
 */

const SITE_URL = process.env.REACT_APP_SITE_URL || 'https://yes-sports.com';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * 生成站点地图 XML
 */
export function generateSitemapXML(urls: SitemapUrl[]): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${SITE_URL}${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;
  return xml;
}

/**
 * 获取所有站点页面 URL
 */
export function getSitemapUrls(): SitemapUrl[] {
  const now = new Date().toISOString().split('T')[0];
  
  return [
    // 首页
    {
      loc: '/',
      lastmod: now,
      changefreq: 'daily',
      priority: 1.0,
    },
    
    // 主要页面
    {
      loc: '/about',
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.8,
    },
    {
      loc: '/products',
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      loc: '/stores',
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      loc: '/training',
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.8,
    },
    {
      loc: '/franchise',
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.7,
    },
    {
      loc: '/contact',
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.6,
    },
    
    // 产品子页面
    {
      loc: '/products/tables',
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.7,
    },
    {
      loc: '/products/accessories',
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.7,
    },
    {
      loc: '/products/custom',
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.6,
    },
    
    // 门店子页面
    {
      loc: '/stores/map',
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.7,
    },
    {
      loc: '/stores/flagship',
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.7,
    },
    {
      loc: '/stores/appointment',
      lastmod: now,
      changefreq: 'daily',
      priority: 0.8,
    },
    
    // 培训子页面
    {
      loc: '/training/courses',
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.7,
    },
    {
      loc: '/training/coaches',
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.6,
    },
    {
      loc: '/training/booking',
      lastmod: now,
      changefreq: 'daily',
      priority: 0.8,
    },
  ];
}

/**
 * 生成完整的站点地图
 */
export function generateSitemap(): string {
  const urls = getSitemapUrls();
  return generateSitemapXML(urls);
}