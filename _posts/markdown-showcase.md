---
title: "Markdown 功能一覽"
date: '2026-11-16'
updated: '2026-11-16'
draft: false
type: blog
category: notes
series: "Twilight 入門"
tags:
  - twilight
  - markdown
summary: 這個主題支援的 Markdown 語法：程式碼、數學式、表格、提示框、圖片和註腳。
---

這篇列出文章裡可以用的語法，寫文章時可以當參考[^1]。

## 程式碼

程式碼區塊會自動加上語法高亮、行號和複製按鈕。

```python
def fib(n: int) -> int:
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```

行內程式碼像這樣：`npm run dev`。

## 數學式

行內：$E = mc^2$。獨立一行：

$$
\nabla \cdot \mathbf{E} = \frac{\rho}{\varepsilon_0}
$$

## 提示框

> [!NOTE]
> 一般補充說明。

> [!WARNING]
> 需要讀者特別注意的地方。

> [!CAUTION]
> 可能造成損失的操作。

## 表格

| 指令 | 用途 |
|---|---|
| `npm run dev` | 開發伺服器 |
| `npm run build` | 正式版 build |
| `npm run lint` | 程式碼檢查 |

## 圖片

![文章從 Markdown 變成網頁的流程](/images/sample-diagram.svg)

## 清單

- [x] 換掉網站名稱
- [x] 換掉大頭貼
- [ ] 寫第一篇文章

[^1]: 註腳會出現在文章最下面。
