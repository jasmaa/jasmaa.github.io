import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remark from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

/**
 * Gets all posts sorted by date
 */
export function getSortedPostsData() {
  // Get all posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map(fileName => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);

    return {
      id,
      title: matterResult.data.title,
      subtitle: matterResult.data.subtitle,
      date: matterResult.data.date,
      categories: matterResult.data.categories.split(' ').sort(),
    }
  })
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

/**
 * Gets all post categories
 */
export function getAllPostCategories() {
  // Get all posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allCategories = new Set();
  fileNames.forEach(fileName => {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    matterResult.data.categories.split(' ')
      .forEach(category => {
        allCategories.add(category);
      })
  });
  // Sort posts by date
  return Array.from(allCategories).sort();
}

/**
 * Gets all post ids
 */
export function getAllPostIDs() {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}

/**
 * Gets post data by id
 * 
 * @param {*} id 
 */
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  // Combine the data with the id
  return {
    id,
    contentHtml,
    title: matterResult.data.title,
    subtitle: matterResult.data.subtitle,
    date: matterResult.data.date,
    categories: matterResult.data.categories.split(' ').sort(),
  }
}