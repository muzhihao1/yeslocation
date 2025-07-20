import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  jsonLd?: Record<string, any>;
}

const DEFAULT_TITLE = '耶氏体育 - 专业台球俱乐部';
const DEFAULT_DESCRIPTION = '云南耶氏体育，您身边的台球专家。提供专业台球器材、培训课程、场地预约等一站式服务。';
const DEFAULT_KEYWORDS = '台球,桌球,斯诺克,中式八球,九球,台球培训,台球器材,台球俱乐部,云南台球,昆明台球';
const DEFAULT_IMAGE = '/images/og-default.jpg';
const SITE_NAME = '耶氏体育';
const SITE_URL = process.env.REACT_APP_SITE_URL || 'https://yes-sports.com';

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  canonicalUrl,
  noindex = false,
  jsonLd,
}) => {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const pageUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;
  
  // 基础结构化数据
  const baseJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+86-871-1234567',
      contactType: 'customer service',
      areaServed: 'CN',
      availableLanguage: ['zh-CN'],
    },
    sameAs: [
      'https://weibo.com/yessports',
      'https://www.douyin.com/yessports',
    ],
  };
  
  // 合并自定义的结构化数据
  const structuredData = jsonLd ? { ...baseJsonLd, ...jsonLd } : baseJsonLd;
  
  return (
    <Helmet>
      {/* 基础 Meta 标签 */}
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph 标签 */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={pageTitle} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="zh_CN" />
      
      {/* Twitter Card 标签 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={pageTitle} />
      
      {/* 文章相关 Meta 标签 */}
      {type === 'article' && (
        <>
          {author && <meta property="article:author" content={author} />}
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
        </>
      )}
      
      {/* 产品相关 Meta 标签 */}
      {type === 'product' && (
        <>
          <meta property="product:availability" content="in stock" />
          <meta property="product:condition" content="new" />
        </>
      )}
      
      {/* 结构化数据 */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};