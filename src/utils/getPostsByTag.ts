import type { CollectionEntry } from "astro:content";
import getSortedPosts, { getSortedContentPosts } from "./getSortedPosts";
import { slugifyAll } from "./slugify";

const getPostsByTag = (posts: CollectionEntry<"blog">[], tag: string) =>
  getSortedPosts(
    posts.filter(post => slugifyAll(post.data.tags).includes(tag))
  );

// Get posts by tag with content filtering (excludes posts with specific tags)
const getContentPostsByTag = (posts: CollectionEntry<"blog">[], tag: string) =>
  getSortedContentPosts(
    posts.filter(post => slugifyAll(post.data.tags).includes(tag))
  );

export default getPostsByTag;
export { getContentPostsByTag };
