# Kubernetes 部署配置（Web 服務）

> token-admin-web 的 Kubernetes 部署配置

---

## 📌 架構說明

### 各自管理原則

本專案**獨立管理**自己的 Ingress 和 SSL 證書：

```
✅ Deployment（部署配置）
✅ Service（服務配置）
✅ Ingress（HTTPS/SSL 配置）
```

**設計原則：**
1. ✅ 微服務獨立性 - 各專案管理自己的路由和證書
2. ✅ 避免跨專案依賴 - 前端和後端配置分離
3. ✅ 部署獨立 - 各自部署，互不影響
4. ✅ 職責分明 - 前端專案只包含前端相關配置

**與 Backend 專案關係：**
- Backend 專案管理：token-admin-api.passon.tw、token-app-api.passon.tw
- Web 專案管理：token-admin-web.passon.tw（本專案）
- 兩者使用不同的 Ingress 名稱，避免衝突

---

## 📁 目錄結構

```
k8s/
├── README.md           # 本文檔
├── base/              # 基礎配置
│   ├── deployment.yaml
│   ├── service.yaml
│   └── kustomization.yaml
└── overlays/          # 環境特定配置
    └── staging/
        ├── kustomization.yaml
        └── patches/   # 環境特定的配置補丁
```

---

## 🚀 部署流程

### 方式 1：使用 GitHub Actions（推薦）

```bash
# 推送到 develop 分支自動部署到 staging
git push origin develop
```

### 方式 2：使用 kubectl + kustomize

```bash
# 部署到 staging
kubectl apply -k k8s/overlays/staging/

# 查看狀態
kubectl get pods -n passontw-services-staging -l app=token-admin-web
```

---

## 🔐 SSL 證書管理

### 查看證書狀態

```bash
# 查看 web 服務的證書
kubectl get certificate token-admin-web-tls -n passontw-services-staging

# 查看證書詳情
kubectl describe certificate token-admin-web-tls -n passontw-services-staging
```

### 更新 SSL 配置

**本專案自行管理 SSL 證書：**

```bash
# 編輯 Ingress 配置
vim k8s/overlays/staging/ingress.yaml

# 應用變更
kubectl apply -f k8s/overlays/staging/ingress.yaml

# 查看證書申請進度
kubectl get certificate token-admin-web-tls -n passontw-services-staging -w
```

### 驗證 HTTPS

```bash
# 測試連接
curl -I https://token-admin-web.passon.tw

# 查看證書
echo | openssl s_client -servername token-admin-web.passon.tw \
  -connect token-admin-web.passon.tw:443 2>/dev/null | \
  openssl x509 -noout -issuer -dates
```

---

## 📋 常用命令

### 查看資源

```bash
# 查看 Web 服務的所有資源
kubectl get all -n passontw-services-staging -l app=token-admin-web

# 查看 Deployment
kubectl get deployment token-admin-web -n passontw-services-staging

# 查看 Service
kubectl get service token-admin-web -n passontw-services-staging

# 查看 Pods
kubectl get pods -n passontw-services-staging -l app=token-admin-web
```

### 查看日誌

```bash
# 實時日誌
kubectl logs -f deployment/token-admin-web -n passontw-services-staging

# 最近 100 行
kubectl logs --tail=100 deployment/token-admin-web -n passontw-services-staging
```

### 更新服務

```bash
# 重啟 Pods
kubectl rollout restart deployment/token-admin-web -n passontw-services-staging

# 擴展副本
kubectl scale deployment/token-admin-web --replicas=3 -n passontw-services-staging

# 查看更新狀態
kubectl rollout status deployment/token-admin-web -n passontw-services-staging
```

### 回滾部署

```bash
# 查看部署歷史
kubectl rollout history deployment/token-admin-web -n passontw-services-staging

# 回滾到上一個版本
kubectl rollout undo deployment/token-admin-web -n passontw-services-staging
```

---

## 🔍 故障排除

### Pod 無法啟動

```bash
# 查看 Pod 狀態
kubectl describe pod <pod-name> -n passontw-services-staging

# 查看日誌
kubectl logs <pod-name> -n passontw-services-staging

# 查看事件
kubectl get events -n passontw-services-staging --sort-by='.lastTimestamp'
```

### 服務無法訪問

```bash
# 檢查 Service
kubectl get svc token-admin-web -n passontw-services-staging
kubectl describe svc token-admin-web -n passontw-services-staging

# 檢查 Endpoints
kubectl get endpoints token-admin-web -n passontw-services-staging

# 測試內部連接
kubectl run -it --rm curl-test \
  --image=curlimages/curl \
  --restart=Never \
  -n passontw-services-staging \
  -- curl -v http://token-admin-web:80
```

### SSL 證書問題

**所有 SSL 相關問題請參考 backend 專案的文檔：**

```
passontw-backend-services/k8s/README.md
```

---

## 🔗 相關資源

### 文檔
- [Backend K8s README](../../passontw-backend-services/k8s/README.md) - 包含完整的 SSL 證書管理說明
- [GitHub Actions CI/CD](../.github/workflows/README.md) - 自動化部署說明

### 配置檔案
- [Deployment](./base/deployment.yaml) - 部署定義
- [Service](./base/service.yaml) - 服務定義
- [統一 Ingress](../../passontw-backend-services/k8s/overlays/staging/ingress.yaml) - SSL 和路由管理

### 外部資源
- [Kubernetes 官方文檔](https://kubernetes.io/docs/)
- [Kustomize 文檔](https://kustomize.io/)
- [cert-manager 文檔](https://cert-manager.io/docs/)

---

## ⚙️ 配置說明

### Deployment

- **副本數**：Staging 環境預設 2 個副本
- **資源限制**：根據實際使用調整
- **健康檢查**：配置 liveness 和 readiness probes
- **環境變數**：透過 ConfigMap 和 Secret 注入

### Service

- **類型**：ClusterIP（內部服務）
- **端口**：80（HTTP）
- **選擇器**：`app=token-admin-web`

### Ingress（在 backend 專案管理）

- **域名**：token-admin-web.passon.tw
- **TLS**：Let's Encrypt Production 證書
- **路由**：所有請求轉發到 Service

---

**最後更新：** 2025-11-20  
**維護者：** DevOps Team

**快速開始：**
1. 推送代碼到 develop 分支
2. GitHub Actions 自動構建和部署
3. 檢查 Pod 狀態：`kubectl get pods -n passontw-services-staging -l app=token-admin-web`

**SSL 管理：**
所有 SSL 配置請參考 `passontw-backend-services/k8s/README.md`
