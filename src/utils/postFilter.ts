import type { CollectionEntry } from "astro:content";
import { SITE } from "@/config";

const postFilter = ({ data }: CollectionEntry<"blog">) => {
  const isPublishTimePassed =
    Date.now() >
    new Date(data.pubDatetime).getTime() - SITE.scheduledPostMargin;
  return !data.draft && (import.meta.env.DEV || isPublishTimePassed);
};

// Content filter that excludes posts with specific tags from being displayed
const contentFilter = ({ data }: CollectionEntry<"blog">) => {
  const excludedTags = ['deep research'];
  const hasExcludedTag = data.tags?.some((tag: string) => 
    excludedTags.includes(tag)
  );
  
  const isPublishTimePassed =
    Date.now() >
    new Date(data.pubDatetime).getTime() - SITE.scheduledPostMargin;
    
  return !data.draft && 
         !hasExcludedTag && 
         (import.meta.env.DEV || isPublishTimePassed);
};

export default postFilter;
export { contentFilter };
