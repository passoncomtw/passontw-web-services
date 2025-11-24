.PHONY: help install build build-docker clean check-node \
        pos-install pos-build pos-build-docker pos-clean pos-dev

# 預設服務：token-admin-web
SERVICE_NAME := token-admin-web
SERVICE_PATH := cmd/$(SERVICE_NAME)
BUILD_OUTPUT := $(SERVICE_PATH)/build
DOCKER_IMAGE := ghcr.io/passoncomtw/$(SERVICE_NAME)
DOCKER_TAG ?= latest
REACT_APP_BASE_PATH ?= https://token-admin-api.passon.tw/
REQUIRED_NODE_VERSION := 22

# POS Backend Web 變數
POS_SERVICE_NAME := pos-backend-web
POS_SERVICE_PATH := cmd/$(POS_SERVICE_NAME)
POS_BUILD_OUTPUT := $(POS_SERVICE_PATH)/dist
POS_DOCKER_IMAGE := ghcr.io/passoncomtw/$(POS_SERVICE_NAME)
POS_DOCKER_TAG ?= latest

help: ## 顯示幫助信息
	@echo "可用的 make 命令："
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

check-node: ## 檢查 Node.js 版本
	@echo "🔍 檢查 Node.js 版本..."
	@NODE_VERSION=$$(node -v | cut -d'v' -f2 | cut -d'.' -f1); \
	if [ "$$NODE_VERSION" != "$(REQUIRED_NODE_VERSION)" ]; then \
		echo "❌ 錯誤: 需要 Node.js $(REQUIRED_NODE_VERSION).x，當前版本是 $$(node -v)"; \
		echo ""; \
		echo "請使用以下命令切換版本:"; \
		echo "  nvm use $(REQUIRED_NODE_VERSION)"; \
		echo ""; \
		echo "或安裝 Node.js $(REQUIRED_NODE_VERSION):"; \
		echo "  nvm install $(REQUIRED_NODE_VERSION)"; \
		exit 1; \
	fi
	@echo "✅ Node.js 版本正確: $$(node -v)"

install: check-node ## 安裝依賴
	@echo "📦 安裝 $(SERVICE_NAME) 依賴..."
	cd $(SERVICE_PATH) && yarn install --frozen-lockfile

build: check-node ## 構建前端應用
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
dev: ## 啟動 token-admin-web 開發伺服器
	@echo "🚀 啟動開發伺服器..."
	cd $(SERVICE_PATH) && yarn start

###############################################################################
# POS Backend Web 相關目標
###############################################################################

pos-install: check-node ## 安裝 pos-backend-web 依賴
	@echo "📦 安裝 $(POS_SERVICE_NAME) 依賴..."
	cd $(POS_SERVICE_PATH) && yarn install --frozen-lockfile

pos-build: check-node ## 構建 pos-backend-web 應用（Vite）
	@echo "🔨 構建 $(POS_SERVICE_NAME)..."
	cd $(POS_SERVICE_PATH) && \
		NODE_OPTIONS='--max-old-space-size=4096 --max-semi-space-size=1024' \
		yarn build:production
	@echo "✅ 構建完成: $(POS_BUILD_OUTPUT)"

pos-build-docker: ## 構建 pos-backend-web Docker 鏡像（需先執行 make pos-build）
	@echo "🐳 構建 $(POS_SERVICE_NAME) Docker 鏡像..."
	@if [ ! -d "$(POS_BUILD_OUTPUT)" ]; then \
		echo "❌ 錯誤: 找不到構建產物 $(POS_BUILD_OUTPUT)"; \
		echo "   請先執行: make pos-build"; \
		exit 1; \
	fi
	docker build \
		-f deploy/$(POS_SERVICE_NAME)/Dockerfile \
		-t $(POS_DOCKER_IMAGE):$(POS_DOCKER_TAG) \
		.
	@echo "✅ Docker 鏡像構建完成: $(POS_DOCKER_IMAGE):$(POS_DOCKER_TAG)"

pos-build-all: pos-install pos-build pos-build-docker ## 完整構建 pos-backend-web（安裝 -> 構建 -> Docker）

pos-clean: ## 清理 pos-backend-web 構建產物
	@echo "🧹 清理 $(POS_SERVICE_NAME) 構建產物..."
	rm -rf $(POS_BUILD_OUTPUT)
	@echo "✅ 清理完成"

pos-test-local: pos-build ## 本地測試 pos-backend-web 構建結果
	@echo "🧪 啟動本地測試伺服器..."
	cd $(POS_BUILD_OUTPUT) && python3 -m http.server 8080

pos-dev: ## 啟動 pos-backend-web 開發伺服器
	@echo "🚀 啟動 $(POS_SERVICE_NAME) 開發伺服器..."
	cd $(POS_SERVICE_PATH) && yarn dev

###############################################################################
# 通用目標
###############################################################################

build-all-services: build-all pos-build-all ## 構建所有服務

clean-all: clean pos-clean ## 清理所有服務的構建產物

