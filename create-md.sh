#!/bin/bash

# 获取参数
TITLE="$1"
FOLDER="$2"
CUSTOM_TAG="$3"

# 默认文件夹为 _post
DEFAULT_FOLDER="_posts"

# 设置默认 TAGS 数组
TAGS=()

# 检查是否传入标题
if [ -z "$TITLE" ]; then
  echo "错误：请提供文章标题。"
  echo "用法：$0 "文章标题" [文件夹] [标签]"
  exit 1
fi

# 处理文件夹参数
if [ -z "$FOLDER" ]; then
  FOLDER="$DEFAULT_FOLDER"
fi

# 如果文件夹是 'deep_research'，则自动添加同名 tag
if [ "$FOLDER" == "deep_research" ]; then
  TAGS+=("deep research")
fi

# 添加用户提供的 tag（如果存在）
if [ ! -z "$CUSTOM_TAG" ]; then
  TAGS+=($CUSTOM_TAG)
fi

# 如果没有指定标签，则使用默认标签
if [ ${#TAGS[@]} -eq 0 ]; then
  TAGS=("others")
fi

# 获取当前日期和时间
CURRENT_DATETIME="$(date -u +'%Y-%m-%dT%H:%M:%S')Z"

# 生成文件名（去掉非法字符，转换空格为-）
FILENAME_TITLE=$(echo $TITLE | tr '[:upper:]' '[:lower:]' | tr -cd '[:alnum:] -' | tr ' ' '-')
FILENAME="$(date +%Y)-$(date +%m)-$FILENAME_TITLE.md"

# 确定目标路径
TARGET_DIR="src/data/blog/$FOLDER"
TARGET_PATH="$TARGET_DIR/$FILENAME"

# 创建目录（如果不存在）
mkdir -p "$TARGET_DIR"

# 写入 Frontmatter
{
  echo "---"
  echo "title: $TITLE"
  echo "description: 这是一篇关于 '$TITLE' 的文章。"
  echo "pubDatetime: $CURRENT_DATETIME"
  echo "modDatetime: $CURRENT_DATETIME"

# 输出 tags
echo -n "tags:"
for tag in "${TAGS[@]}"; do
  echo "
  - $tag"
done

# 默认 draft 和 featured 状态
echo "draft: false"
echo "featured: false"
echo "---"

echo "# $TITLE"
} > "$TARGET_PATH"

# 成功提示信息
echo "✅ 已成功创建文件：$TARGET_PATH"
echo "📝 文件内容："
cat "$TARGET_PATH"
