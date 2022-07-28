# API overviews

## GET `/course/:id`：取得課程內容。

### 請求參數

不需要。

### 回應內容

```json
{ "data": { ... } }
```

-   200: 正常回應；data 是回傳的課程資料。
-   404: 沒有內容；data 是 null。

## GET `/course/search`：搜尋課程

### 待進行

-   [ ] 分頁功能

### 請求參數

-   `keyword`：關鍵字

### 回應內容

```json
{ "data": [ ... ] }
```

-   200: 正常回應；data 是回傳的課程資料。
-   404: 沒有內容；data 是空的。
