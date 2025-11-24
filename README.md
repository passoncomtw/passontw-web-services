# PassonTW Web Services

> PassonTW 前端服務的 Monorepo 專案

[![CI/CD](https://github.com/passontw/passontw-web-services/workflows/CI/badge.svg)](https://github.com/passontw/passontw-web-services/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📋 目錄

- [專案概述](#專案概述)
- [服務列表](#服務列表)
- [快速開始](#快速開始)
- [開發指南](#開發指南)
- [部署架構](#部署架構)
- [CI/CD 流程](#cicd-流程)
- [相關文檔](#相關文檔)

---

## 專案概述

本專案是 PassonTW 的前端服務 Monorepo，採用現代化的 DevOps 實踐，實現了從代碼提交到生產環境的完全自動化部署流程。

### 核心特性

- ✅ **Monorepo 架構** - 統一管理多個前端應用
- ✅ **自動化 CI/CD** - GitHub Actions 驅動的完整流程
- ✅ **多環境支持** - Staging 和 Production 環境隔離
- ✅ **容器化部署** - Docker + Kubernetes
- ✅ **零停機部署** - 滾動更新策略
- ✅ **自動回滾** - 失敗時自動恢復
- ✅ **健康檢查** - 確保服務可用性
- ✅ **HTTPS 加密** - Let's Encrypt 自動證書管理

### 技術棧

| 層級 | 技術 |
|------|------|
| **前端框架** | React 17/19 + Redux + Redux Saga |
| **開發語言** | JavaScript / TypeScript |
| **構建工具** | Webpack / Vite |
| **UI 框架** | Material-UI / Custom Components |
| **容器化** | Docker (精簡版 Nginx 打包) |
| **Web 服務器** | Nginx |
| **編排工具** | Kubernetes + Kustomize |
| **CI/CD** | GitHub Actions |
| **鏡像倉庫** | GitHub Container Registry (GHCR) |
| **證書管理** | cert-manager + Let's Encrypt |

---

## 服務列表

### Token Admin Web

後台管理系統，提供商家管理、訂單管理、用戶管理等功能。

| 環境 | URL | 狀態 |
|------|-----|------|
| **Staging** | https://token-admin-web.passon.tw | [![Status](https://img.shields.io/badge/status-online-success)](https://token-admin-web.passon.tw) |

**技術細節：**
- 📁 路徑：`cmd/token-admin-web/`
- ⚛️ 技術棧：React 17 + Redux + Webpack
- 🐳 Dockerfile：`deploy/token-admin-web/Dockerfile`
- ☸️ K8s 配置：`k8s/base/token-admin-web-*`
- 🚀 工作流程：`.github/workflows/cicd-admin-web.yaml`

### POS Backend Web

POS 系統後台管理介面，提供商家 POS 相關的管理功能。

| 環境 | URL | 狀態 |
|------|-----|------|
| **Staging** | https://pos-backend-web.passon.tw | [![Status](https://img.shields.io/badge/status-online-success)](https://pos-backend-web.passon.tw) |

**技術細節：**
- 📁 路徑：`cmd/pos-backend-web/`
- ⚛️ 技術棧：React 19 + TypeScript + Vite + Material-UI
- 🐳 Dockerfile：`deploy/pos-backend-web/Dockerfile`
- ☸️ K8s 配置：`k8s/base/pos-backend-web-*`
- 🚀 工作流程：`.github/workflows/cicd-pos-backend-web.yaml`
- 📖 文檔：[部署指南](./POS_BACKEND_WEB_DEPLOYMENT.md)

---

## 快速開始

### 前置需求

- Node.js 22+ (推薦使用 nvm 管理版本)
  - `token-admin-web` 使用 Node.js 22 + Webpack
  - `pos-backend-web` 使用 Node.js 22 + Vite
- Yarn 1.22+ (推薦) 或 npm
- Docker 20+ (用於本地測試和構建)
- kubectl 1.25+ (用於部署)
- kustomize 5+ (用於 K8s 配置管理)

### 本地開發

**Token Admin Web (Webpack + React 17):**

```bash
# 1. Clone 專案
git clone https://github.com/passontw/passontw-web-services.git
cd passontw-web-services

# 2. 確保使用正確的 Node.js 版本
nvm use 22

# 3. 進入服務目錄
cd cmd/token-admin-web

# 4. 安裝依賴
yarn install

# 5. 啟動開發服務器
yarn start
# 或使用 Makefile
make dev
```

應用將在 http://localhost:3000 啟動。

**POS Backend Web (Vite + React 19 + TypeScript):**

```bash
# 1. 確保使用正確的 Node.js 版本
nvm use 22

# 2. 進入服務目錄
cd cmd/pos-backend-web

# 3. 安裝依賴
yarn install

# 4. 啟動開發服務器
yarn dev
# 或使用 Makefile
make pos-dev
```

應用將在 http://localhost:5173 啟動。

### 構建生產版本

**Token Admin Web:**

```bash
# 使用 Makefile（推薦）
make build-all          # 完整流程（安裝 -> 構建 -> Docker）
make install            # 安裝依賴
make build              # 構建應用
make build-docker       # 打包 Docker 鏡像

# 手動構建
cd cmd/token-admin-web
yarn build
```

構建產物輸出到 `cmd/token-admin-web/build/` 目錄。

**POS Backend Web:**

```bash
# 使用 Makefile（推薦）
make pos-build-all      # 完整流程（安裝 -> 構建 -> Docker）
make pos-install        # 安裝依賴
make pos-build          # 構建應用
make pos-build-docker   # 打包 Docker 鏡像

# 手動構建
cd cmd/pos-backend-web
yarn build:production
```

構建產物輸出到 `cmd/pos-backend-web/dist/` 目錄。

**構建所有服務：**

```bash
make build-all-services  # 構建所有服務
make clean-all           # 清理所有構建產物
```

---

## 開發指南

### 專案結構

```
passontw-web-services/
├── .github/
│   └── workflows/              # GitHub Actions 工作流程
│       └── cicd-admin-web.yaml
├── cmd/                        # 應用源代碼
│   └── token-admin-web/        # 後台管理系統
│       ├── src/                # 源代碼
│       ├── public/             # 靜態資源
│       ├── package.json        # 依賴配置
│       └── config-overrides.js # Webpack 配置覆蓋
├── deploy/                     # Docker 構建配置
│   ├── README.md
│   └── token-admin-web/
│       ├── Dockerfile          # 多階段構建
│       └── nginx.conf          # Nginx 配置
├── k8s/                        # Kubernetes 配置
│   ├── README.md               # K8s 部署指南
│   ├── base/                   # 基礎配置
│   ├── overlays/               # 環境特定配置
│   │   ├── staging/
│   │   └── production/
│   └── ingress/                # Ingress 配置
└── README.md                   # 本文檔
```

### 分支策略

```
main (production)
  ↑
  │ merge
  │
develop (staging)
  ↑
  │ merge
  │
feature/* (開發分支)
```

### 開發流程

1. **創建功能分支**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **開發和測試**
   ```bash
   # 開發功能
   # 運行測試
   yarn test
   ```

3. **提交代碼**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   ```

4. **創建 Pull Request**
   - 提交 PR 到 `develop` 分支
   - 等待代碼審查
   - 合併後自動部署到 Staging

5. **部署到 Production**
   ```bash
   git checkout main
   git merge develop
   git push origin main
   # 自動部署到 Production
   ```

---

## 部署架構

### 部署流程圖

```
┌─────────────────────────────────────────────────────────────────────┐
│                          開發流程                                    │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │   Git Push          │
                   │  (develop/main)     │
                   └──────────┬──────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     GitHub Actions (ubuntu)                          │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  1. Checkout Code                                          │    │
│  │  2. Set Image Tag (branch-shortSHA)                       │    │
│  │  3. Login to GHCR                                         │    │
│  │  4. Build Docker Image                                    │    │
│  │     - Multi-stage build                                   │    │
│  │     - Inject API base path                                │    │
│  │  5. Push to GHCR                                          │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │  GHCR Registry      │
                   │  (ghcr.io)          │
                   └──────────┬──────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   GitHub Actions (mac-mini-build)                    │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  1. Checkout Code                                          │    │
│  │  2. Update Kustomize Image Tag                            │    │
│  │  3. Apply Kubernetes Config                               │    │
│  │  4. Wait for Rollout (5min timeout)                       │    │
│  │  5. Verify Deployment                                     │    │
│  │  6. Rollback on Failure                                   │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │  Kubernetes         │
                   │  (k3s cluster)      │
                   └──────────┬──────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
    ┌───────────────────┐      ┌───────────────────┐
    │   Staging Env     │      │  Production Env   │
    │  Namespace:       │      │  Namespace:       │
    │  passontw-        │      │  passontw-        │
    │  services-staging │      │  services-        │
    │                   │      │  production       │
    │  Domain:          │      │  Domain:          │
    │  token-admin-web  │      │  admin.passon.tw  │
    │  .passon.tw       │      │                   │
    └───────────────────┘      └───────────────────┘
```

### 環境配置

#### Staging 環境

| 配置項 | 值 |
|--------|---|
| **Git 分支** | `develop` |
| **命名空間** | `passontw-services-staging` |
| **域名** | `https://token-admin-web.passon.tw` |
| **API 端點** | `https://token-admin-api.passon.tw/` |
| **副本數** | 2 |
| **資源請求** | CPU: 100m, Memory: 128Mi |
| **資源限制** | CPU: 500m, Memory: 512Mi |
| **鏡像標籤** | `develop-{shortSHA}` |

#### Production 環境

| 配置項 | 值 |
|--------|---|
| **Git 分支** | `main` |
| **命名空間** | `passontw-services-production` |
| **域名** | `https://admin.passon.tw` |
| **API 端點** | `https://api.passon.tw/` |
| **副本數** | 3 |
| **資源請求** | CPU: 200m, Memory: 256Mi |
| **資源限制** | CPU: 1000m, Memory: 1Gi |
| **鏡像標籤** | `main-{shortSHA}` |

---

## CI/CD 流程

### 自動化部署

推送代碼到對應分支會自動觸發部署：

```bash
# 部署到 Staging
git push origin develop

# 部署到 Production
git push origin main
```

### 部署步驟

**Job 1: Build (ubuntu-latest)**

1. ✅ Checkout 代碼
2. ✅ 設定鏡像標籤 (`branch-shortSHA`)
3. ✅ 登入 GHCR
4. ✅ 構建並推送 Docker 鏡像
   - 多階段構建優化鏡像大小
   - 注入環境變數
   - 推送版本標籤和浮動標籤

**Job 2: Deploy (mac-mini-build)**

1. ✅ Checkout 代碼
2. ✅ 更新 Kustomize 鏡像標籤
3. ✅ 應用 Kubernetes 配置
4. ✅ 等待部署完成（5 分鐘超時）
5. ✅ 驗證部署（檢查 Pod 健康狀態）
6. ❌ 失敗時自動回滾

### 手動操作

#### 查看部署狀態

```bash
# 查看 Pods
kubectl get pods -n passontw-services-staging -l app=token-admin-web

# 查看日誌
kubectl logs -f deployment/token-admin-web -n passontw-services-staging

# 查看服務
kubectl get svc -n passontw-services-staging token-admin-web
```

#### 手動部署

```bash
# 構建鏡像
docker build \
  -f deploy/token-admin-web/Dockerfile \
  --build-arg REACT_APP_BASE_PATH=https://token-admin-api.passon.tw/ \
  -t ghcr.io/passontw/token-admin-web:develop-$(git rev-parse --short HEAD) \
  .

# 推送鏡像
docker push ghcr.io/passontw/token-admin-web:develop-$(git rev-parse --short HEAD)

# 部署到 Kubernetes
cd k8s/overlays/staging
kustomize edit set image \
  ghcr.io/passontw/token-admin-web=ghcr.io/passontw/token-admin-web:develop-$(git rev-parse --short HEAD)
kubectl apply -k .
```

#### 回滾部署

```bash
# 查看部署歷史
kubectl rollout history deployment/token-admin-web -n passontw-services-staging

# 回滾到上一個版本
kubectl rollout undo deployment/token-admin-web -n passontw-services-staging
```

---

## 監控與維護

### 健康檢查

```bash
# 檢查 Pod 狀態
kubectl get pods -n passontw-services-staging -l app=token-admin-web

# 測試健康檢查端點
kubectl port-forward deployment/token-admin-web 8080:80 -n passontw-services-staging
curl http://localhost:8080/health
```

### 日誌查看

```bash
# 實時日誌
kubectl logs -f deployment/token-admin-web -n passontw-services-staging

# 查看最近 100 行
kubectl logs --tail=100 deployment/token-admin-web -n passontw-services-staging
```

### 資源監控

```bash
# 查看 Pod 資源使用
kubectl top pods -n passontw-services-staging -l app=token-admin-web

# 查看節點資源
kubectl top nodes
```

---

## 故障排除

### 常見問題

#### 構建失敗

**問題：** `error:0308010C:digital envelope routines::unsupported`

**原因：** 舊版 webpack 與 OpenSSL 3.0 不相容

**解決方案 1：** 本地開發使用 `NODE_OPTIONS`

```json
{
  "scripts": {
    "start": "NODE_OPTIONS=--openssl-legacy-provider react-app-rewired start",
    "build": "NODE_OPTIONS=--openssl-legacy-provider react-app-rewired build"
  }
}
```

**解決方案 2：** Docker 構建使用 Node.js 17

```dockerfile
# 使用 Node.js 17（完整支援 --openssl-legacy-provider）
# Node 16 某些版本不支援此選項
FROM node:17 AS builder

# 構建時啟用 legacy provider
RUN node --openssl-legacy-provider ./node_modules/.bin/react-app-rewired build
```

**版本說明：**
- **本地開發：** 使用 Node.js 16+ 配合 `NODE_OPTIONS=--openssl-legacy-provider`
- **Docker 構建：** 使用 Node.js 17，確保完整支援 `--openssl-legacy-provider` 選項
- **最終部署：** 多階段構建確保最終鏡像仍然精簡（約 50MB）

**為什麼 Docker 使用 Node.js 17？**
Node.js 16 在 `--openssl-legacy-provider` 選項的支援上存在相容性問題，某些版本不支援該選項。Node.js 17 是第一個完全穩定支援此選項的版本，確保構建過程的可靠性。

#### 部署失敗

**問題：** Pod 無法啟動

**檢查步驟：**
```bash
# 查看 Pod 狀態
kubectl describe pod <pod-name> -n passontw-services-staging

# 查看日誌
kubectl logs <pod-name> -n passontw-services-staging

# 查看事件
kubectl get events -n passontw-services-staging --sort-by='.lastTimestamp'
```

#### 服務無法訪問

**問題：** 無法通過域名訪問

**檢查步驟：**
```bash
# 檢查 Ingress
kubectl get ingress -n passontw-services-staging
kubectl describe ingress -n passontw-services-staging

# 檢查 Service
kubectl get svc -n passontw-services-staging token-admin-web

# 檢查證書
kubectl get certificate -n passontw-services-staging
```

詳細故障排除請參考：[k8s/README.md](k8s/README.md#故障排除)

---

## 安全性考量

### 鏡像安全

- ✅ 使用官方基礎鏡像
- ✅ 定期更新基礎鏡像
- ✅ 多階段構建減少攻擊面
- ✅ 不在鏡像中存儲密鑰

### Kubernetes 安全

- ✅ 使用 Secrets 管理敏感資訊
- ✅ 設定資源限制防止資源耗盡
- ✅ 使用 RBAC 控制訪問權限
- ✅ 命名空間隔離環境

### 網絡安全

- ✅ 強制 HTTPS 加密
- ✅ 設定安全標頭（X-Frame-Options, CSP 等）
- ✅ 定期更新 SSL 證書（cert-manager 自動處理）

---

## 最佳實踐

### 開發流程

1. ✅ **分支策略** - Feature → Develop → Main
2. ✅ **代碼審查** - Pull Request 必須經過審查
3. ✅ **自動測試** - 推送前運行測試
4. ✅ **小步提交** - 頻繁提交小的變更

### 部署策略

1. ✅ **先 Staging 後 Production** - 確保變更經過測試
2. ✅ **滾動更新** - 避免停機
3. ✅ **健康檢查** - 確保服務可用才繼續
4. ✅ **自動回滾** - 失敗時快速恢復

### 監控維護

1. ✅ **定期檢查** - 每天查看 Pod 狀態
2. ✅ **日誌分析** - 定期查看錯誤日誌
3. ✅ **資源優化** - 根據實際使用調整資源配置
4. ✅ **文檔更新** - 保持文檔與實際同步

---

## 相關文檔

### 開發文檔
- [Token Admin Web README](cmd/token-admin-web/README.md) - 應用開發指南

### 部署文檔
- [Kubernetes 部署指南](k8s/README.md) - K8s 詳細操作指南
- [Docker 構建文檔](deploy/README.md) - Docker 鏡像構建說明

### CI/CD 文檔
- [GitHub Actions 工作流程](.github/workflows/cicd-admin-web.yaml) - CI/CD 配置

### 外部資源
- [Kubernetes 官方文檔](https://kubernetes.io/docs/)
- [React 官方文檔](https://reactjs.org/)
- [Redux 官方文檔](https://redux.js.org/)
- [Nginx 文檔](https://nginx.org/en/docs/)

---

## 貢獻指南

我們歡迎任何形式的貢獻！

### 如何貢獻

1. Fork 本專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

### 提交訊息規範

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 規範：

```
feat: 新增功能
fix: 修復 bug
docs: 文檔更新
style: 代碼格式調整
refactor: 重構
test: 測試相關
chore: 其他雜項
```

---

## 授權

本專案採用 MIT 授權 - 詳見 [LICENSE](LICENSE) 文件

---

## 聯繫方式

- **技術問題**：提交 [GitHub Issue](https://github.com/passontw/passontw-web-services/issues)
- **緊急情況**：聯繫 DevOps 團隊
- **郵件**：passon.com.tw@gmail.com

---

**最後更新：** 2025-11-20  
**維護者：** PassonTW DevOps Team

**快速鏈接：**
- 🚀 [快速開始](#快速開始)
- 📚 [開發指南](#開發指南)
- 🔧 [故障排除](#故障排除)
- 📖 [API 文檔](https://token-admin-api.passon.tw/swagger/index.html)

