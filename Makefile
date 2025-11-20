.PHONY: help install build build-docker clean

# 變數定義
SERVICE_NAME := token-admin-web
SERVICE_PATH := cmd/$(SERVICE_NAME)
BUILD_OUTPUT := $(SERVICE_PATH)/build
DOCKER_IMAGE := ghcr.io/passoncomtw/$(SERVICE_NAME)
DOCKER_TAG ?= latest
REACT_APP_BASE_PATH ?= https://token-admin-api.passon.tw/

help: ## 顯示幫助信息
	@echo "可用的 make 命令："
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## 安裝依賴
	@echo "📦 安裝 $(SERVICE_NAME) 依賴..."
	cd $(SERVICE_PATH) && yarn install --frozen-lockfile

build: ## 構建前端應用
	@echo "🔨 構建 $(SERVICE_NAME)..."
	@echo "📍 API Base Path: $(REACT_APP_BASE_PATH)"
	cd $(SERVICE_PATH) && \
		REACT_APP_BASE_PATH=$(REACT_APP_BASE_PATH) \
		yarn build
	@echo "✅ 構建完成: $(BUILD_OUTPUT)"

build-docker: ## 構建 Docker 鏡像（需先執行 make build）
	@echo "🐳 構建 Docker 鏡像..."
	@if [ ! -d "$(BUILD_OUTPUT)" ]; then \
		echo "❌ 錯誤: 找不到構建產物 $(BUILD_OUTPUT)"; \
		echo "   請先執行: make build"; \
		exit 1; \
	fi
	docker build \
		-f deploy/$(SERVICE_NAME)/Dockerfile \
		-t $(DOCKER_IMAGE):$(DOCKER_TAG) \
		.
	@echo "✅ Docker 鏡像構建完成: $(DOCKER_IMAGE):$(DOCKER_TAG)"

build-all: install build build-docker ## 完整構建流程（安裝 -> 構建 -> Docker 打包）

clean: ## 清理構建產物
	@echo "🧹 清理構建產物..."
	rm -rf $(BUILD_OUTPUT)
	@echo "✅ 清理完成"

# 環境特定的構建目標
build-staging: ## 構建 Staging 環境
	@$(MAKE) build REACT_APP_BASE_PATH=https://token-admin-api.passon.tw/

build-production: ## 構建 Production 環境
	@$(MAKE) build REACT_APP_BASE_PATH=https://api.passon.tw/

# Docker 相關目標
docker-staging: build-staging ## 構建 Staging Docker 鏡像
	@$(MAKE) build-docker DOCKER_TAG=develop-$(shell git rev-parse --short HEAD)

docker-production: build-production ## 構建 Production Docker 鏡像
	@$(MAKE) build-docker DOCKER_TAG=main-$(shell git rev-parse --short HEAD)

# 本地測試
test-local: build ## 本地測試構建結果
	@echo "🧪 啟動本地測試伺服器..."
	cd $(BUILD_OUTPUT) && python3 -m http.server 8080

# 開發相關
dev: ## 啟動開發伺服器
	@echo "🚀 啟動開發伺服器..."
	cd $(SERVICE_PATH) && yarn start

