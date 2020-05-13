---
title: celery_introduction
tags: []
category: []
mermaid: false
date: 2020-05-13 21:50:12
---
## Celery 简介

> 任务队列一般用于线程或计算机之间分配工作的一种机制。  
>
> 任务队列的输入是一个称为任务的工作单元，有专门的工作进行不断的监视任务队列，进行执行新的任务工作。
>
> Celery 通过消息机制进行通信，通常使用中间人（Broker）作为客户端和职程（Worker）调节。启动一个任务，客户端向消息队列发送一条消息，然后中间人（Broker）将消息传递给一个职程（Worker），最后由职程（Worker）进行执行中间人（Broker）分配的任务。
>
> Celery 可以有多个职程（Worker）和中间人（Broker），用来提高Celery的高可用性以及横向扩展能力。


## Celery 测试环境搭建
`Celery` 的运行，至少需要一个 `broker`，一般选用 `rabbitmq or redis`，一个运行 `Celery` 的服务。那么安装起来比较麻烦，网络配置也比较麻烦，这里我们直接推荐用 `Docker` 来进行测试环境的搭建。
### 安装 Docker
安装比较简单，我们直接推荐按照官方安装即可：
> [Linux 安装](https://docs.docker.com/engine/install/#server)  
> [Windows 安装](https://docs.docker.com/docker-for-windows/install/)  
> [Mac 安装](https://docs.docker.com/docker-for-mac/install/)  

### Celery 容器构建
因为 [docker hub](https://hub.docker.com/) 上面的 `celery` 镜像比较老了，我们就从零安装一个镜像即可。
步骤如下：
   - 1. 拉取 `python` 镜像作为基础镜像。因为目前 `celery` 还不支持 `PY38`，所以我们拉取 `PY37` 即可。    

         `docker pull python:3.7-slim`

   - 2. 利用拉取的 `python` 镜像，生成 `python` 容器。运行以下命令:

    ```bash
$ docker run -v /tmp/celery_data:/tmp/celery_data -it python:3.7-slim bash  # 挂载目录并创建运行 python容器
$ 
      ```
