# 定义变量
DOCKER_IMAGE_NAME = nodeme-cc-web
DOCKER_IMAGE_TAG = latest

# 构建 Docker 镜像
build_docker:
	docker build -t $(DOCKER_IMAGE_NAME):$(DOCKER_IMAGE_TAG) .

# 运行 Docker 容器进行开发测试
dev_docker:
	docker run -it --rm -p 3000:3000 $(DOCKER_IMAGE_NAME):$(DOCKER_IMAGE_TAG)

# 清理 Docker 镜像
clean_docker:
	docker rmi $(DOCKER_IMAGE_NAME):$(DOCKER_IMAGE_TAG)

# 帮助命令
help:
	@echo "Available commands:"
	@echo "  make build_docker  - Build Docker image"
	@echo "  make dev_docker    - Run Docker container for development"
	@echo "  make clean_docker  - Remove Docker image"

.PHONY: build_docker dev_docker clean_docker help
