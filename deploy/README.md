# Docker 部署配置

> 本目錄包含各服務的 Docker 構建配置

## 📁 目錄結構

```
deploy/
├── README.md                    # 本文檔
└── token-admin-web/            # Token Admin Web 前端
    ├── Dockerfile              # Docker 構建文件
    └── nginx.conf              # Nginx 配置
```

---

## Token Admin Web

### 構建流程

本專案採用**兩階段構建策略**：
1. **本機構建** - 在本機執行 `yarn build`，生成靜態資源
2. **Docker 打包** - 將靜態資源打包到精簡的 nginx 鏡像中

**優勢：**
- ✅ 避免 Docker 內 Node.js 版本相容性問題
- ✅ 使用本地開發環境（Node 16）構建
- ✅ 最終鏡像極度精簡（僅 nginx + 靜態文件，約 15-20MB）
- ✅ 構建速度更快（利用本地快取）

### 使用 Makefile 構建（推薦）

```bash
# 從專案根目錄執行
cd /path/to/passontw-web-services

# 完整構建流程（推薦）
make build-all

# 或分步執行
make install          # 安裝依賴
make build           # 構建前端應用
make build-docker    # 打包 Docker 鏡像

# 環境特定構建
make docker-staging      # Staging 環境完整構建
make docker-production   # Production 環境完整構建
```

### 手動構建

```bash
# 1. 構建前端應用
cd cmd/token-admin-web

# Staging 環境
REACT_APP_BASE_PATH=https://token-admin-api.passon.tw/ yarn build

# Production 環境
REACT_APP_BASE_PATH=https://api.passon.tw/ yarn build

# 2. 構建 Docker 鏡像
cd ../..
docker build \
  -f deploy/token-admin-web/Dockerfile \
  -t ghcr.io/passontw/token-admin-web:develop-latest \
  .
```

### 推送鏡像

```bash
# 登入 GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# 推送鏡像
docker push ghcr.io/passontw/token-admin-web:develop-latest
docker push ghcr.io/passontw/token-admin-web:main-latest
```

### 本地測試

```bash
# 運行容器
docker run -d \
  --name token-admin-web-test \
  -p 8080:80 \
  ghcr.io/passontw/token-admin-web:develop-latest

# 測試訪問
curl http://localhost:8080/health

# 訪問應用
open http://localhost:8080

# 查看日誌
docker logs -f token-admin-web-test

# 停止並刪除
docker stop token-admin-web-test
docker rm token-admin-web-test
```

---

## 鏡像構建說明

### 構建策略

Token Admin Web 採用**本機構建 + Docker 打包**策略：

**本機構建階段：**
- 使用本地 Node.js 環境（推薦 Node 16）
- 執行 `yarn install` 和 `yarn build`
- 生成靜態資源到 `cmd/token-admin-web/build/`
- 利用本地快取加速構建

**Docker 打包階段：**
- 基於 `nginx:alpine`（最精簡的 nginx 基礎鏡像）
- 僅複製構建產物和 Nginx 配置
- 無需 Node.js 相關依賴
- **最終鏡像大小：約 15-20MB** 🎉

### 與傳統多階段構建的對比

| 項目 | 傳統多階段構建 | 本機構建 + Docker 打包 |
|------|--------------|---------------------|
| **構建環境** | Docker 內（node:17） | 本機（node:16） |
| **構建速度** | 較慢（每次重新安裝依賴） | 快（利用本地快取） |
| **最終鏡像大小** | ~50MB | **~15-20MB** |
| **Node.js 版本問題** | 需處理相容性 | 使用本地環境，無相容性問題 |
| **CI/CD 複雜度** | 簡單（單一 Dockerfile） | 中等（需先構建再打包） |

### 環境變數

| 變數 | 說明 | 預設值 |
|------|------|--------|
| `REACT_APP_BASE_PATH` | 後端 API 基礎路徑 | `https://token-admin-api.passon.tw/` |

**設定方式：**

```bash
# Makefile（推薦）
make build REACT_APP_BASE_PATH=https://api.passon.tw/

# 手動設定
REACT_APP_BASE_PATH=https://api.passon.tw/ yarn build
```

### 健康檢查

鏡像內建健康檢查：
- 端點：`/health`
- 間隔：30 秒
- 超時：3 秒
- 重試：3 次

---

## Nginx 配置特性

### 功能特性

- ✅ **Gzip 壓縮** - 減少傳輸大小
- ✅ **靜態資源快取** - 1 年快取期限
- ✅ **安全標頭** - X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
- ✅ **SPA 路由支持** - React Router 正確處理
- ✅ **健康檢查端點** - `/health` 返回 200 OK

### 端點說明

| 端點 | 說明 |
|------|------|
| `/` | 應用主頁面 |
| `/health` | 健康檢查端點 |
| `/static/*` | 靜態資源（長期快取） |
| 其他所有路徑 | 返回 `index.html`（SPA 路由） |

---

## CI/CD 整合

### GitHub Actions 自動構建

當以下文件變更時，會自動觸發構建：

```yaml
paths:
  - '.github/workflows/cicd-admin-web.yaml'
  - 'cmd/token-admin-web/**'
  - 'deploy/token-admin-web/**'
  - 'k8s/**'
```

### 鏡像標籤策略

| 分支 | 標籤格式 | 範例 |
|------|---------|------|
| `develop` | `develop-{短 SHA}` | `develop-abc1234` |
| `develop` | `develop` | `develop` (浮動標籤) |
| `main` | `main-{短 SHA}` | `main-abc1234` |
| `main` | `main` | `main` (浮動標籤) |

---

## 最佳實踐

### 構建優化

1. **使用 .dockerignore**
   ```
   node_modules
   build
   .git
   *.log
   .env.local
   ```

2. **多階段構建**
   - 僅保留運行時必需的文件
   - 減少最終鏡像大小

3. **基礎鏡像選擇**
   - 使用 Alpine Linux 變體
   - 定期更新基礎鏡像

### 安全性

1. **最小化攻擊面**
   - 不包含構建工具和源代碼
   - 僅暴露必要的端口（80）

2. **定期更新**
   - 定期更新 Node.js 版本
   - 定期更新 Nginx 版本
   - 掃描安全漏洞

3. **不暴露敏感信息**
   - API 端點通過構建參數注入
   - 不在鏡像中存儲密鑰或憑證

---

## 故障排除

### 構建失敗

**問題：** `error:0308010C:digital envelope routines::unsupported`

**原因：** 舊版 webpack 與 OpenSSL 3.0 不相容

**解決方案：** 使用本機構建策略（已實現）

由於採用**本機構建 + Docker 打包**策略，此問題已經完全避免：

1. ✅ 在本機使用 Node.js 16 構建（配合 `NODE_OPTIONS=--openssl-legacy-provider`）
2. ✅ Docker 僅負責打包靜態資源，無需處理 Node.js 版本問題
3. ✅ 最終鏡像極度精簡（15-20MB）

**如果本機構建失敗：**

```bash
# 確保 package.json 中已設定 NODE_OPTIONS
# cmd/token-admin-web/package.json
{
  "scripts": {
    "build": "NODE_OPTIONS=--openssl-legacy-provider react-app-rewired build"
  }
}

# 使用 Makefile 構建
make build
```

### 運行時錯誤

**問題：** Nginx 404 錯誤

**檢查：**
```bash
# 進入容器檢查文件
docker exec -it <container-id> sh
ls -la /usr/share/nginx/html
cat /etc/nginx/conf.d/default.conf
```

### 健康檢查失敗

**問題：** 容器健康檢查持續失敗

**檢查：**
```bash
# 手動測試健康檢查
docker exec <container-id> curl -f http://localhost/health

# 查看 Nginx 日誌
docker logs <container-id>
```

---

## 相關資源

- [Kubernetes 部署指南](../k8s/README.md)
- [GitHub Actions 工作流程](../.github/workflows/cicd-admin-web.yaml)
- [Docker 官方文檔](https://docs.docker.com/)
- [Nginx 文檔](https://nginx.org/en/docs/)

---

**最後更新：** 2025-11-20  
**維護者：** DevOps Team

