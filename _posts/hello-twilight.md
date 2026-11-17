---
title: "Hello, Twilight：開始使用這個主題"
date: '2026-11-17'
updated: '2026-11-17'
draft: false
type: blog
category: notes
series: "Twilight 入門"
tags:
  - twilight
  - getting-started
summary: 第一篇範例文章。說明要改哪些檔案，才能把這個主題變成你自己的部落格。
---

歡迎使用 **Twilight（薄暮與星雲）**：一個柔和的 Next.js 部落格主題。淺色模式是星雲般的淡紫與粉，深色模式是薄暮的靛藍，右上角可以切換。

> [!TIP]
> 這篇文章本身就是範例。確定不需要之後，直接刪掉 `_posts/hello-twilight.md` 就好。

## 要改的檔案

| 檔案 | 內容 |
|---|---|
| `src/config/site.ts` | 網站名稱、網址、作者、首頁自我介紹、Giscus 留言 |
| `src/data/about.ts` | 關於頁的經歷、技能、獲獎 |
| `public/images/avatar.svg` | 大頭貼（換成 png 的話記得改 `site.ts` 的 `avatar`） |
| `_posts/` | 文章 |
| `_projects/` | 專案 |
| `_changelog/` | 版本紀錄，會顯示在 `/changelog` |

## 新增一篇文章

```bash
cp _templates/blog-post.md _posts/my-first-post.md
```

把 `draft` 改成 `false` 才會出現在列表上。`category` 可以是 `notes`、`implementation`、`paper`、`til`，或刪掉不填。

## 換顏色

所有顏色都是 `src/app/globals.css` 開頭的 CSS 變數：`:root` 是淺色模式，`.dark` 是深色模式。想換成別的色調，只要改 `--primary`（薄暮紫）、`--accent`（星雲粉）和 `--hero-from` / `--hero-to`（首頁漸層）。

## 搜尋

按 `⌘K`（Windows 是 `Ctrl+K`）或右上角的放大鏡，就能搜尋所有文章。
