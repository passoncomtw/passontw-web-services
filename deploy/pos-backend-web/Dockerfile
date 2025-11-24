# 精簡版 Dockerfile - 僅打包已構建的靜態資源
# 構建步驟在 CI/CD 中完成

FROM nginx:alpine

# 設定維護者資訊
LABEL maintainer="PassonTW DevOps Team <passon.com.tw@gmail.com>"
LABEL description="POS Backend Web - Frontend Application"

# 複製自訂 nginx 配置
COPY deploy/pos-backend-web/nginx.conf /etc/nginx/conf.d/default.conf

# 複製構建的靜態資源（從 dist 目錄）
# 注意：構建產物必須先在 CI/CD 中生成
COPY cmd/pos-backend-web/dist /usr/share/nginx/html

# 安裝 curl 用於健康檢查
RUN apk add --no-cache curl

# 創建健康檢查腳本
RUN echo '#!/bin/sh' > /healthcheck.sh && \
    echo 'curl -f http://localhost/health || exit 1' >> /healthcheck.sh && \
    chmod +x /healthcheck.sh

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD /healthcheck.sh

# 暴露端口
EXPOSE 80

# 啟動 nginx
CMD ["nginx", "-g", "daemon off;"]

