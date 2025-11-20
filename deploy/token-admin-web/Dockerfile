# 精簡版 Dockerfile - 僅打包已構建的靜態資源
# 構建步驟在本機完成（使用 Makefile）

FROM nginx:alpine

# 設定維護者資訊
LABEL maintainer="PassonTW DevOps Team <passon.com.tw@gmail.com>"
LABEL description="Token Admin Web - Frontend Application"

# 複製自訂 nginx 配置
COPY deploy/token-admin-web/nginx.conf /etc/nginx/conf.d/default.conf

# 複製本機構建的靜態資源
# 注意：構建產物必須先在本機生成（make build）
COPY cmd/token-admin-web/build /usr/share/nginx/html

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
