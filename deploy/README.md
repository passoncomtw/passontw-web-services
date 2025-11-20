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

### 構建鏡像

```bash
# 從專案根目錄執行
cd /path/to/passontw-web-services

# 構建 Staging 鏡像
docker build \
  -f deploy/token-admin-web/Dockerfile \
  --build-arg REACT_APP_BASE_PATH=https://token-admin-api.passon.tw/ \
  -t ghcr.io/passontw/token-admin-web:develop-latest \
  .

# 構建 Production 鏡像
docker build \
  -f deploy/token-admin-web/Dockerfile \
  --build-arg REACT_APP_BASE_PATH=https://api.passon.tw/ \
  -t ghcr.io/passontw/token-admin-web:main-latest \
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

### 多階段構建

Token Admin Web 使用多階段構建來優化鏡像大小：

1. **Stage 1: Builder**
   - 基於 `node:16-alpine`
   - 安裝依賴並構建 React 應用
   - 使用 `--openssl-legacy-provider` 解決 Node.js v16+ 相容性問題

2. **Stage 2: Production**
   - 基於 `nginx:alpine`
   - 僅複製構建產物和 Nginx 配置
   - 最終鏡像大小約 50MB

### 構建參數

| 參數 | 說明 | 預設值 |
|------|------|--------|
| `REACT_APP_BASE_PATH` | 後端 API 基礎路徑 | `https://token-admin-api.passon.tw/` |

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

**解決方案：** 使用 `NODE_OPTIONS=--openssl-legacy-provider`

```dockerfile
RUN NODE_OPTIONS=--openssl-legacy-provider yarn build
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

