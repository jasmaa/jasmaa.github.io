import config from '@lib/config';
import { getSortedPostsData, getPostData } from '@lib/posts';

/**
 * Generate RSS content for single post
 * 
 * @param {*} post 
 */
function generatePostRSS(post) {
  return `
  <item>
    <guid>${config.baseURL}/blog/${post.id}</guid>
    <title>${post.title}</title>
    <link>${config.baseURL}/blog/${post.id}</link>
    <description>${post.subtitle}</description>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
  </item>`;
}

/**
 * Generates RSS feed for blog posts
 */
export function generateRSSFeed() {

  const posts = getSortedPostsData();

  return `
  <!-- RSS Feed auto-generated from Next -->
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>Blog - ${config.siteName}</title>
      <link>${config.baseURL}/blog</link>
      <description>My blog</description>
      <language>en</language>
      <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="${config.baseURL}/rss.xml" rel="self" type="application/rss+xml"/>
      ${posts.map(generatePostRSS).join('')}
    </channel>
  </rss>`;
}