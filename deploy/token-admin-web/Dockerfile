# Stage 1: Build
FROM node:16-alpine AS builder

WORKDIR /app

# 複製 package.json 和 yarn.lock
COPY cmd/token-admin-web/package.json cmd/token-admin-web/yarn.lock ./

# 安裝依賴
RUN yarn install --frozen-lockfile --ignore-engines

# 複製源代碼
COPY cmd/token-admin-web/ ./

# 構建參數（從 GitHub Actions 傳入）
ARG REACT_APP_BASE_PATH=https://token-admin-api.passon.tw/
ENV REACT_APP_BASE_PATH=${REACT_APP_BASE_PATH}

# 構建應用
RUN NODE_OPTIONS=--openssl-legacy-provider yarn build

# Stage 2: Production
FROM nginx:alpine

# 複製自訂 nginx 配置
COPY deploy/token-admin-web/nginx.conf /etc/nginx/conf.d/default.conf

# 複製構建產物
COPY --from=builder /app/build /usr/share/nginx/html

# 創建健康檢查腳本
RUN echo '#!/bin/sh' > /healthcheck.sh && \
    echo 'curl -f http://localhost/ || exit 1' >> /healthcheck.sh && \
    chmod +x /healthcheck.sh && \
    apk add --no-cache curl

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD /healthcheck.sh

# 暴露端口
EXPOSE 80

# 啟動 nginx
CMD ["nginx", "-g", "daemon off;"]

