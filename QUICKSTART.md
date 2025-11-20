# 快速開始指南

> Token Admin Web 快速構建和部署指南

## 📦 前置需求

- Node.js 16+
- Yarn
- Docker
- Make

## 🚀 快速構建

### 使用 Makefile（推薦）

```bash
# 顯示所有可用命令
make help

# 完整構建流程（最簡單）
make build-all

# 或分步執行
make install          # 1. 安裝依賴
make build           # 2. 構建前端應用
make build-docker    # 3. 打包 Docker 鏡像
```

### 環境特定構建

```bash
# Staging 環境
make docker-staging

# Production 環境
make docker-production
```

## 🔧 詳細步驟

### 1. 安裝依賴

```bash
make install
# 或
cd cmd/token-admin-web && yarn install
```

### 2. 構建前端應用

```bash
# 使用預設 API 端點
make build

# 或指定 API 端點
make build REACT_APP_BASE_PATH=https://your-api.example.com/

# 手動構建
cd cmd/token-admin-web
REACT_APP_BASE_PATH=https://token-admin-api.passon.tw/ yarn build
```

### 3. 打包 Docker 鏡像

```bash
# 使用 Makefile
make build-docker DOCKER_TAG=v1.0.0

# 手動構建
docker build \
  -f deploy/token-admin-web/Dockerfile \
  -t ghcr.io/passontw/token-admin-web:v1.0.0 \
  .
```

### 4. 推送鏡像

```bash
# 登入 GHCR
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# 推送鏡像
docker push ghcr.io/passontw/token-admin-web:v1.0.0
```

## 🧪 本地測試

### 測試構建產物

```bash
make test-local
# 訪問 http://localhost:8080
```

### 測試 Docker 鏡像

```bash
docker run -d \
  --name token-admin-web-test \
  -p 8080:80 \
  ghcr.io/passontw/token-admin-web:latest

# 測試健康檢查
curl http://localhost:8080/health

# 訪問應用
open http://localhost:8080

# 查看日誌
docker logs -f token-admin-web-test

# 停止並刪除
docker stop token-admin-web-test
docker rm token-admin-web-test
```

## 💻 開發模式

```bash
# 啟動開發伺服器
make dev
# 或
cd cmd/token-admin-web && yarn start
```

## 🧹 清理

```bash
# 清理構建產物
make clean

# 清理 Docker 鏡像
docker rmi ghcr.io/passontw/token-admin-web:latest
```

## 📊 Makefile 命令總覽

| 命令 | 說明 |
|------|------|
| `make help` | 顯示所有可用命令 |
| `make install` | 安裝依賴 |
| `make build` | 構建前端應用 |
| `make build-docker` | 打包 Docker 鏡像 |
| `make build-all` | 完整構建流程 |
| `make build-staging` | 構建 Staging 環境 |
| `make build-production` | 構建 Production 環境 |
| `make docker-staging` | Staging 環境完整構建 |
| `make docker-production` | Production 環境完整構建 |
| `make test-local` | 本地測試構建結果 |
| `make dev` | 啟動開發伺服器 |
| `make clean` | 清理構建產物 |

## 🔍 故障排除

### 構建失敗

**問題：** `error:0308010C:digital envelope routines::unsupported`

**解決：** 確保使用 `NODE_OPTIONS=--openssl-legacy-provider`

```bash
# 已在 package.json 中配置，使用 Makefile 即可
make build
```

### Docker 構建失敗

**問題：** 找不到 build 目錄

**解決：** 先執行本機構建

```bash
make build        # 先構建前端
make build-docker # 再打包 Docker
```

### 權限問題

**問題：** Docker push 失敗

**解決：** 確保已登入 GHCR

```bash
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin
```

## 📚 相關文檔

- [README.md](README.md) - 專案總覽
- [deploy/README.md](deploy/README.md) - 部署詳細說明
- [k8s/README.md](k8s/README.md) - Kubernetes 操作指南

---

**快速命令：** `make build-all` → 完成所有構建！🚀

