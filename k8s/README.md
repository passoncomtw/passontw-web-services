# Kubernetes 部署指南 - Token Admin Web

> Token Admin Web 前端應用的 Kubernetes 部署配置和操作指南

## 📋 目錄

- [目錄結構](#目錄結構)
- [快速開始](#快速開始)
- [環境配置](#環境配置)
- [部署流程](#部署流程)
- [日常操作](#日常操作)
- [故障排除](#故障排除)

---

## 目錄結構

```
k8s/
├── README.md                                  # 本文檔
├── base/                                      # 基礎配置
│   ├── kustomization.yaml                     # Kustomize 基礎配置
│   ├── token-admin-web-deployment.yaml        # Deployment 定義
│   └── token-admin-web-service.yaml           # Service 定義
├── overlays/                                  # 環境特定配置
│   ├── staging/                               # Staging 環境
│   │   └── kustomization.yaml                 # Staging 配置覆蓋
│   └── production/                            # Production 環境
│       └── kustomization.yaml                 # Production 配置覆蓋
└── ingress/                                   # Ingress 配置
    ├── ingress-staging-https.yaml             # Staging HTTPS 入口
    └── ingress-production-https.yaml          # Production HTTPS 入口
```

---

## 快速開始

### 環境準備

**前置條件：**
- ✅ kubectl 已安裝並配置
- ✅ kustomize 已安裝
- ✅ 可連接到 Kubernetes 集群
- ✅ GitHub Container Registry 認證已設置

**驗證環境：**
```bash
kubectl cluster-info
kubectl get nodes
kustomize version
```

### 首次部署

#### 1. 創建必要的 Secrets

```bash
# 創建 GHCR Pull Secret（用於拉取私有鏡像）
kubectl create secret docker-registry ghcr-pull-secret \
  --docker-server=ghcr.io \
  --docker-username=YOUR_GITHUB_USERNAME \
  --docker-password=YOUR_GITHUB_TOKEN \
  -n passontw-services-staging
```

#### 2. 自動部署（推薦）

```bash
# 推送代碼到 develop 分支會自動部署到 staging
git push origin develop

# 推送代碼到 main 分支會自動部署到 production
git push origin main
```

#### 3. 手動部署

```bash
# 部署到 Staging
cd k8s/overlays/staging
kustomize edit set image \
  ghcr.io/passontw/token-admin-web=ghcr.io/passontw/token-admin-web:develop-abc1234
kubectl apply -k .

# 部署到 Production
cd k8s/overlays/production
kustomize edit set image \
  ghcr.io/passontw/token-admin-web=ghcr.io/passontw/token-admin-web:main-abc1234
kubectl apply -k .
```

#### 4. 驗證部署

```bash
# 查看 Pods 狀態
kubectl get pods -n passontw-services-staging -l app=token-admin-web

# 查看日誌
kubectl logs -f deployment/token-admin-web -n passontw-services-staging

# 查看服務
kubectl get svc -n passontw-services-staging token-admin-web

# 查看 Ingress
kubectl get ingress -n passontw-services-staging
```

---

## 環境配置

### Staging 環境

| 項目 | 配置 |
|------|------|
| **命名空間** | `passontw-services-staging` |
| **域名** | `https://token-admin-web.passon.tw` |
| **副本數** | 2 |
| **資源請求** | CPU: 100m, Memory: 128Mi |
| **資源限制** | CPU: 500m, Memory: 512Mi |
| **API 端點** | `https://token-admin-api.passon.tw/` |

### Production 環境

| 項目 | 配置 |
|------|------|
| **命名空間** | `passontw-services-production` |
| **域名** | `https://admin.passon.tw` |
| **副本數** | 3 |
| **資源請求** | CPU: 200m, Memory: 256Mi |
| **資源限制** | CPU: 1000m, Memory: 1Gi |
| **API 端點** | `https://api.passon.tw/` |

---

## 部署流程

### CI/CD 自動部署

GitHub Actions 會在以下情況觸發自動部署：

1. **Staging 部署**
   - 觸發條件：推送到 `develop` 分支
   - 路徑變更：
     - `.github/workflows/cicd-admin-web.yaml`
     - `cmd/token-admin-web/**`
     - `deploy/token-admin-web/**`
     - `k8s/**`

2. **Production 部署**
   - 觸發條件：推送到 `main` 分支
   - 相同的路徑監控規則

**部署步驟：**
1. ✅ 構建 Docker 鏡像
2. ✅ 推送到 GHCR
3. ✅ 更新 Kubernetes 配置
4. ✅ 滾動更新部署
5. ✅ 健康檢查驗證
6. ❌ 失敗時自動回滾

### 手動部署

```bash
# 1. 構建並推送鏡像
cd /path/to/project
docker build -f deploy/token-admin-web/Dockerfile \
  --build-arg REACT_APP_BASE_PATH=https://token-admin-api.passon.tw/ \
  -t ghcr.io/passontw/token-admin-web:develop-$(git rev-parse --short HEAD) .

docker push ghcr.io/passontw/token-admin-web:develop-$(git rev-parse --short HEAD)

# 2. 更新 Kubernetes
cd k8s/overlays/staging
kustomize edit set image \
  ghcr.io/passontw/token-admin-web=ghcr.io/passontw/token-admin-web:develop-$(git rev-parse --short HEAD)

kubectl apply -k .

# 3. 監控部署
kubectl rollout status deployment/token-admin-web -n passontw-services-staging
```

---

## 日常操作

### 查看資源狀態

```bash
# 查看所有資源
kubectl get all -n passontw-services-staging -l app=token-admin-web

# 查看 Pods 詳情
kubectl describe pod <pod-name> -n passontw-services-staging

# 查看日誌（實時）
kubectl logs -f deployment/token-admin-web -n passontw-services-staging

# 查看最近 100 行日誌
kubectl logs --tail=100 deployment/token-admin-web -n passontw-services-staging
```

### 擴展副本

```bash
# 擴展到 5 個副本
kubectl scale deployment/token-admin-web --replicas=5 -n passontw-services-staging

# 查看擴展狀態
kubectl get pods -n passontw-services-staging -l app=token-admin-web -w
```

### 更新鏡像

```bash
# 更新到新版本
kubectl set image deployment/token-admin-web \
  token-admin-web=ghcr.io/passontw/token-admin-web:develop-abc1234 \
  -n passontw-services-staging

# 查看更新狀態
kubectl rollout status deployment/token-admin-web -n passontw-services-staging
```

### 回滾部署

```bash
# 查看部署歷史
kubectl rollout history deployment/token-admin-web -n passontw-services-staging

# 回滾到上一個版本
kubectl rollout undo deployment/token-admin-web -n passontw-services-staging

# 回滾到特定版本
kubectl rollout undo deployment/token-admin-web \
  -n passontw-services-staging \
  --to-revision=2
```

### 重啟 Pods

```bash
# 滾動重啟（不會造成停機）
kubectl rollout restart deployment/token-admin-web -n passontw-services-staging
```

### 進入 Pod 調試

```bash
# 進入 Pod shell
kubectl exec -it <pod-name> -n passontw-services-staging -- sh

# 查看 Nginx 配置
kubectl exec <pod-name> -n passontw-services-staging -- cat /etc/nginx/conf.d/default.conf

# 測試健康檢查
kubectl exec <pod-name> -n passontw-services-staging -- wget -O- http://localhost/health
```

---

## 故障排除

### Pod 無法啟動

**症狀：** `CrashLoopBackOff` 或 `Error`

```bash
# 1. 查看 Pod 狀態
kubectl describe pod <pod-name> -n passontw-services-staging

# 2. 查看日誌
kubectl logs <pod-name> -n passontw-services-staging
kubectl logs <pod-name> --previous -n passontw-services-staging

# 3. 查看事件
kubectl get events -n passontw-services-staging --sort-by='.lastTimestamp'
```

**常見原因：**
- Nginx 配置錯誤
- 靜態檔案缺失
- 健康檢查端點失敗
- 資源不足

### 鏡像拉取失敗

**症狀：** `ImagePullBackOff` 或 `ErrImagePull`

```bash
# 檢查 Secret
kubectl get secret ghcr-pull-secret -n passontw-services-staging

# 重新創建 Secret
kubectl delete secret ghcr-pull-secret -n passontw-services-staging
kubectl create secret docker-registry ghcr-pull-secret \
  --docker-server=ghcr.io \
  --docker-username=YOUR_USERNAME \
  --docker-password=YOUR_TOKEN \
  -n passontw-services-staging

# 重啟部署
kubectl rollout restart deployment/token-admin-web -n passontw-services-staging
```

### 服務無法訪問

```bash
# 檢查 Service
kubectl get svc -n passontw-services-staging token-admin-web
kubectl describe svc token-admin-web -n passontw-services-staging

# 檢查 Endpoints
kubectl get endpoints -n passontw-services-staging token-admin-web

# 檢查 Ingress
kubectl describe ingress -n passontw-services-staging

# 測試內部連接
kubectl run -it --rm curl-test \
  --image=curlimages/curl \
  --restart=Never \
  -n passontw-services-staging \
  -- curl -v http://token-admin-web/health
```

### HTTPS 證書問題

```bash
# 檢查證書 Secret
kubectl get secret token-admin-web-tls -n passontw-services-staging
kubectl describe secret token-admin-web-tls -n passontw-services-staging

# 檢查 cert-manager
kubectl get certificate -n passontw-services-staging
kubectl describe certificate token-admin-web-tls -n passontw-services-staging

# 強制更新證書
kubectl delete secret token-admin-web-tls -n passontw-services-staging
kubectl delete certificate token-admin-web-tls -n passontw-services-staging
```

---

## 監控與維護

### 健康檢查

```bash
# 檢查 Pod 健康狀態
kubectl get pods -n passontw-services-staging -l app=token-admin-web

# 測試健康檢查端點
kubectl port-forward deployment/token-admin-web 8080:80 -n passontw-services-staging
curl http://localhost:8080/health
```

### 資源使用

```bash
# 查看 Pod 資源使用
kubectl top pods -n passontw-services-staging -l app=token-admin-web

# 查看節點資源
kubectl top nodes

# 查看詳細資源配置
kubectl describe deployment token-admin-web -n passontw-services-staging
```

---

## 最佳實踐

### 1. 部署策略
- ✅ 使用滾動更新避免停機
- ✅ 先在 Staging 測試再部署到 Production
- ✅ 保持至少 2 個副本以提供高可用性

### 2. 資源管理
- ✅ 設定合理的資源請求和限制
- ✅ 根據實際負載調整副本數
- ✅ 監控資源使用趨勢

### 3. 安全性
- ✅ 使用 HTTPS 加密傳輸
- ✅ 定期更新基礎鏡像
- ✅ 不要將敏感資訊硬編碼在配置中
- ✅ 使用 Secrets 管理認證資訊

### 4. 監控與日誌
- ✅ 定期檢查 Pod 狀態
- ✅ 設定告警規則
- ✅ 保留部署歷史以便回滾

---

## 快速命令參考

```bash
# === 查看資源 ===
kubectl get all -n passontw-services-staging -l app=token-admin-web
kubectl get pods -n passontw-services-staging -l app=token-admin-web -w
kubectl get svc -n passontw-services-staging token-admin-web
kubectl get ingress -n passontw-services-staging

# === 查看日誌 ===
kubectl logs -f deployment/token-admin-web -n passontw-services-staging
kubectl logs --tail=100 deployment/token-admin-web -n passontw-services-staging

# === 部署操作 ===
kubectl apply -k k8s/overlays/staging
kubectl rollout restart deployment/token-admin-web -n passontw-services-staging
kubectl rollout status deployment/token-admin-web -n passontw-services-staging
kubectl rollout undo deployment/token-admin-web -n passontw-services-staging

# === 擴展與縮容 ===
kubectl scale deployment/token-admin-web --replicas=3 -n passontw-services-staging

# === 調試 ===
kubectl exec -it <pod-name> -n passontw-services-staging -- sh
kubectl port-forward deployment/token-admin-web 8080:80 -n passontw-services-staging
```

---

## 相關資源

### 文檔
- [GitHub Actions CI/CD](../../.github/workflows/cicd-admin-web.yaml) - 自動化部署配置
- [Dockerfile](../../deploy/token-admin-web/Dockerfile) - 鏡像構建配置
- [Nginx 配置](../../deploy/token-admin-web/nginx.conf) - Web 服務器配置

### 外部資源
- [Kubernetes 官方文檔](https://kubernetes.io/docs/)
- [Kustomize 文檔](https://kustomize.io/)
- [kubectl 速查表](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Nginx 配置指南](https://nginx.org/en/docs/)

---

**最後更新：** 2025-11-20  
**維護者：** DevOps Team

**快速開始：** 
1. 創建 GHCR Pull Secret → 2. 推送代碼到 develop → 3. 自動部署完成！

