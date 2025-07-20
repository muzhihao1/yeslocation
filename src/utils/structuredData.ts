/**
 * 结构化数据生成工具
 * 用于生成不同页面类型的 JSON-LD 结构化数据
 */

import type { Product, Store, TrainingProgram } from '../types/models';

const SITE_URL = process.env.REACT_APP_SITE_URL || 'https://yes-sports.com';
const ORGANIZATION_NAME = '耶氏体育';

/**
 * 生成面包屑导航结构化数据
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * 生成产品结构化数据
 */
export function generateProductSchema(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image ? [`${SITE_URL}${product.image}`] : [],
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${product.id}`,
      priceCurrency: 'CNY',
      price: product.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: ORGANIZATION_NAME,
      },
    },
  };
}

/**
 * 生成门店结构化数据
 */
export function generateStoreSchema(store: Store) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/stores/${store.id}`,
    name: `${ORGANIZATION_NAME} - ${store.name}`,
    description: `${ORGANIZATION_NAME}${store.name}分店，提供专业台球服务`,
    image: [],
    address: {
      '@type': 'PostalAddress',
      streetAddress: store.address,
      addressLocality: store.district || '昆明',
      addressRegion: '云南',
      addressCountry: 'CN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: store.coordinates[0],
      longitude: store.coordinates[1],
    },
    telephone: store.phone,
    openingHoursSpecification: [{  
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '22:00',
    }],
    priceRange: '¥¥',
    servesCuisine: '台球',
    aggregateRating: store.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: store.rating,
          reviewCount: 5,
        }
      : undefined,
  };
}

/**
 * 生成培训课程结构化数据
 */
export function generateCourseSchema(course: TrainingProgram) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: ORGANIZATION_NAME,
      sameAs: SITE_URL,
    },
    courseMode: 'Blended',
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Blended',
      instructor: {
        '@type': 'Organization',
        name: ORGANIZATION_NAME,
      },
      offers: {
        '@type': 'Offer',
        price: course.price,
        priceCurrency: 'CNY',
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/training/${course.id}`,
      },
    },
  };
}

/**
 * 生成文章结构化数据
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  image?: string;
  author: string;
  publishedTime: string;
  modifiedTime?: string;
  tags?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image ? `${SITE_URL}${article.image}` : undefined,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: ORGANIZATION_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    keywords: article.tags?.join(', '),
  };
}

/**
 * 生成 FAQ 结构化数据
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * 生成搜索框结构化数据
 */
export function generateSearchBoxSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * 生成视频结构化数据
 */
export function generateVideoSchema(video: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string; // ISO 8601 duration format (e.g., "PT15M33S")
  contentUrl?: string;
  embedUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.name,
    description: video.description,
    thumbnailUrl: `${SITE_URL}${video.thumbnailUrl}`,
    uploadDate: video.uploadDate,
    duration: video.duration,
    contentUrl: video.contentUrl,
    embedUrl: video.embedUrl,
    publisher: {
      '@type': 'Organization',
      name: ORGANIZATION_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo.png`,
      },
    },
  };
}