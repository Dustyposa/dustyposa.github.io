---
title: Celery 简介
pubDatetime: 2020-05-30T09:43:13Z
description: "Python 中 Celery 的基础使用教程"
author: DustyPosa
featured: false
draft: false
tags:
  - python
  - celery
  - 异步任务
category:
  - Python 进阶
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

> **重要：为了使用更加简单，我们所有命令行操作都是在宿主机上进行的！**



`Celery` 的运行，**至少需要**一个 `broker`，一般选用 `rabbitmq or redis`，一个运行 `Celery` 的服务。那么安装起来比较麻烦，网络配置也比较麻烦，这里我们直接**推荐**用 `Docker` 来进行测试环境的**搭建**。

> 为什么用 `Docker` ？ 假设我们直接安装，来看看我们要做什么。
>
> 1. 直接在主机上安装 `rabbitmq` （安装比较慢）
> 2. 直接在主机上安装 `redis` （安装比较慢）
> 3. 启动 `rabbitmq and redis`
> 4. 安装 `celery` 并运行。
> 5. 最重要的：因为你在宿主机上安装了这些，所以，你需要**管理所有**的这些应用！！非常耗时耗力。



### 安装 Docker
安装比较简单，我们直接**推荐**按照官方安装即可：
> [Linux 安装](https://docs.docker.com/engine/install/#server)  
> [Windows 安装](https://docs.docker.com/docker-for-windows/install/)  
> [Mac 安装](https://docs.docker.com/docker-for-mac/install/)  

### Celery 容器构建
因为 [docker hub](https://hub.docker.com/) 上面的 `celery` 镜像比较老了，我们就从零安装一个镜像即可。
步骤如下：
   - 1. 拉取 `python` 镜像作为**基础镜像**。因为目前 `celery` 还不支持 `PY38`，所以我们拉取 `PY37` 即可。    

      `docker pull python:3.7-slim`
      
      

 - 2. 利用拉取的 `python` 镜像，生成 `python` 容器。运行以下命令:

    ```bash
  $ docker run --name celery -v /tmp/celery_data:/tmp/celery_data -dit python:3.7-slim bash # 挂载目录并在后台创建运行 python 容器
  $ docker exec celery bash -c "pip install celery redis -i https://pypi.tuna.tsinghua.edu.cn/simple   # 在容器内安装第三方库
  Looking in indexes: https://pypi.tuna.tsinghua.edu.cn/simple
  Collecting celery
    Downloading https://pypi.tuna.tsinghua.edu.cn/packages/7e/54/4d87a8f589259456efb09f574d538fcf3fd7339a3daaae8e02320c1780f1/celery-4.4.2-py2.py3-none-any.whl (422 kB)
  Collecting redis
    Downloading https://pypi.tuna.tsinghua.edu.cn/packages/29/90/8c3f7cd9c23cc259dd01979f03971e70fe2ddad79b93a70026716be20ded/redis-3.5.1-py2.py3-none-any.whl (71 kB)
  ....
  $ docker ps  # 查看运行的容器
  CONTAINER ID        IMAGE             COMMAND             CREATED             STATUS       PORTS      NAMES
  655908bd8ae1        python:3.7-slim   "python3"          12 minutes ago      Up 12 minutes            celery                                                             
   ```
  



可以看到，**短短几行命令**，我们的 `celery` 容器创建完成，相关**依赖库**也已经安装成功。第一步，大功告成。

但是，我们还缺少一个 `broker`。同样，我们用 `docker` 创建一个。

### Broker 容器创建(rabbitmq)

这个创建就更简单了！直接参照命令行即可。

```bash
$ docker pull rabbitmq
$ docker run -d --name rq -p 5462:5462 rabbitmq  # 取名为 rq （没错，就是太懒了,这名字有什么用？ 不急！后面还有用！
```



### Backend 容器创建(redis)

依葫芦画瓢

```bash
$ docker pull redis
$ docker run -d --name rd -p 6379:6379 redis  # 取名为 rd （没错，就是太懒了,这名字有什么用？ 不急！后面还有用！
```

我们的依赖就安装好了，看看目前的状态：

```bash
$ docker ps
CONTAINER ID        IMAGE                      COMMAND                  CREATED             STATUS              PORTS                                                        NAMES
655908bd8ae1        python:3.7-slim            "bash"                   2 minutes ago       Up 2 minutes                                                                    celery
047191725a73        redis                      "docker-entrypoint.s…"   1 minutes ago       Up 1 minutes         0.0.0.0:6379->6379/tcp                                       rd
a8766c15631f        rabbitmq                   "docker-entrypoint.s…"   1 minutes ago       Up 1 minutes         4369/tcp, 5671-5672/tcp, 25672/tcp, 0.0.0.0:5462->5462/tcp   rq

```



### 编写 `celery` 应用

Ok，我们需要的三个基础容器已经创建完成。我们来测试一下 `celery`，先编写一个脚本：

```bash
$ vim /tmp/celery_data/tasks.py
from celery import Celery
app = Celery('tasks', backend='redis://localhost', broker='pyamqp://localhost')

@app.task
def add(x, y):
    return x + y

```



*咦，不对啊，这网络地址怎么填？我看看，不对，用的 `docker` ，网络填起来比较麻烦，各个 `container` 容器 `ip` 还不一样。卧槽，这不是麻烦死了吗？*

等等，是不是一般人都会这么想。

害，别急。`container` 网络是隔离的~更加安全，隔离性更高。当然，我们可以通过：

```bash
$ docker inspect --format='{{.NetworkSettings.IPAddress}}' celery
172.17.0.7
```

来查看各个容器的端口，然后再**回填**到我们的 `tasks.py` 中。但是呢，这样还是比较麻烦，因为 `ip` **不能固定**，最好的方式是什么呢，当然用 `hosts` 映射一个**与域名类似**的东西，保证名字相同就行。

什么东西能帮我们完成这个任务呢？当然就是我们的 `docker network`。

我们现在要做什么：

>  **创建一个小型局域网，每个台主机可以通过主机名直接连接。**



### docker network 的使用

使用比较简单，命令如下：

#### 创建 `docker network`

```bash
$ docker network create msg_middleware  # 创建一个局域网
3576e1af1f60834e9c2871c39a94fcfe86bf63963057adca130fdc6fdf5b7302
$ docker network ls  # 查看创建局域网
NETWORK ID          NAME                           DRIVER              SCOPE
00398aeb039a        bridge                         bridge              local
988e494caf26        host                           host                local
064055db55a9        msg_middleware                 bridge              local
```



#### 将 `container` 拉入网络中

```bash
$ docker network connect msg_middleware celery
$ docker network connect msg_middleware rd  # 在 msg_middleware 的网络下，相当于直接可以 ping rd 
$ docker network connect msg_middleware rq
```



#### 再更改 `tasks.py` 的配置

```bash
$ vim /tmp/celery_data/tasks.py
from celery import Celery
app = Celery('tasks', backend='redis://rd', broker='pyamqp://rq')  # 注意这行！！！！

@app.task
def add(x, y):
    return x + y
```

可以看到我们的链接就很简单了，不再依赖于 `ip` 这样非常方便。



### `Celery` 简单使用

到目前为止，我们所需要的 `celery, broker, backend` 都搞定了。毫无疑问，这样肯定比你从**零安装快**多了！

让我们赶紧测测我们的 `celery` 吧！

#### 测试 `Celery`

> **重要：为了使用更加简单，我们所有命令行操作都是在宿主机上进行的！**

首先，我们打开一个 `shell` 运行我们的 `celery` 脚本。

```bash
$ docker exec -w /tmp/celery_data/ -it celery bash -c "celery -A tasks worker --loglevel=info"
/usr/local/lib/python3.7/site-packages/celery/platforms.py:801: RuntimeWarning: You're running the worker with superuser privileges: this is
absolutely not recommended!

Please specify a different user using the --uid option.

User information: uid=0 euid=0 gid=0 egid=0

  uid=uid, euid=euid, gid=gid, egid=egid,

 -------------- celery@bffcf1356c76 v4.4.2 (cliffs)
--- ***** -----
-- ******* ---- Linux-4.15.0-52-generic-x86_64-with-debian-10.1 2020-05-14 06:10:21
- *** --- * ---
- ** ---------- [config]
- ** ---------- .> app:         tasks:0x7fc101c1cb90
- ** ---------- .> transport:   amqp://guest:**@rq:5672//
- ** ---------- .> results:     redis://rd/
- *** --- * --- .> concurrency: 1 (prefork)
-- ******* ---- .> task events: OFF (enable -E to monitor tasks in this worker)
--- ***** -----
 -------------- [queues]
                .> celery           exchange=celery(direct) key=celery


[tasks]
  . tasks.add
...

```

然后**再开**一个 `shell`，输入命令：

```bash
$ docker exec -w /tmp/celery_data/ -it celery python
Python 3.7.4 (default, Oct 17 2019, 06:10:02)
[GCC 8.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> from tasks import add
>>> res = add.delay(4, 4)
>>> res.ready()
True
>>> res.get()
8
```

可以看到我们的 `测试环境` 成功搭建~ `celery` 也能正常使用了！

但是，这里还是**有个问题**。

> Q：
>
> 每次清掉测试环境之后，**再启动步骤很多，关闭操作也很多。**，比较麻烦，有没有什么简单的方法呢？
>
> A：
>
> 当然有啦！容器编排简单版 `docker-compose`

### docker-compose 管理测试容器

#### docker-compose 是什么？

<detail>

<summary>点这里</summary>

>  Compose 是用于定义和运行多容器 Docker 应用程序的工具。通过 Compose，您可以使用 YML 文件来配置应用程序需要的所有服务。然后，使用一个命令，就可以从 YML 文件配置中创建并启动所有服务。

</detail>

#### docker-compose 安装

安装比较简单，看一下这里就行

[各系统的安装方式](https://docs.docker.com/compose/install/)



#### docker-compose file 的编排

有了 `docker-compose` 之后，就可以管理我们的容器了！我们回忆一下，目前我们有哪些东西：

- 三个容器
  - rabbitmq
  - redis
  - celery
- 一个网络
  - msg_middleware

有了这些，我们就可以编写我们的 `docker-compose.yml` 了。

创建一个 `yml`。

```bash
touch docker-compose.yml
```

编写 `yml` 文件：

```yaml
version: '2'
services:
  celery:
    image: python:3.7-slim
    container_name: 'celery'
    volumes:
      - /tmp/celery_data:/tmp/celery_data
    depends_on:
      - redis
      - rabbitmq
    networks:
      - msg_middleware
    working_dir: /tmp/celery_data
    command: ["bash", "celery.sh"]
  redis:
    image: redis
    container_name: 'rd'
    ports:
      - 6379:6379
    networks:
      - msg_middleware
  rabbitmq:
    container_name: 'rq'
    image: rabbitmq
    ports:
      - 5462:5462
    networks:
      - msg_middleware
networks:
  msg_middleware:
```

细心的你会发现，我们有一个 `celery.sh`，其实脚本也比较简单，如下：
```bash
$ vim celery.sh
pip install celery redis -i https://pypi.tuna.tsinghua.edu.cn/simple
celery -A tasks worker --loglevel=info
```
把之前的命令行全放进来就行了（`pip` 这里不标准，应该放到 `dockerfile` 中的，便于演示，就直接这样了。）
运行我们的 `docker-compose` 就可以啦！
#### 启动 测试集,，并在后台运行

```bash
$ docker-compose up -d
Creating network "data_msg_middleware" with the default driver
Creating rq ... done
Creating rd ... done
Creating celery ... done
```

检测是否运行成功，我们在宿主机测试，参照之前的方式即可：

```bash
docker exec -w /tmp/celery_data/ -it celery python
Python 3.7.4 (default, Oct 17 2019, 06:10:02)
[GCC 8.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> from tasks import add
>>> res = add.delay(4, 4)
>>> res.ready()
True
>>> res.get()
8
```
#### 关闭 测试集
```bash
$ docker-compose down
Stopping rd ... done
Stopping rq ... done
Removing celery ... done
Removing rd     ... done
Removing rq     ... done
Removing network data_msg_middleware
```
#### 其他命令
- 停止 `docker-compose stop`
- 重启 `docker-compose restart`
- 启动子应用 `docker-compose up subapp_name`
- 删除镜像及容器 `docker-compose rmi --all`


#### 总结
用 `docker` 来搭建 `celery` 测试环境的文章就到这里啦。相信大家对 `docker` 也有了一定的认识。至少用来做环境管理是非常方便的！
从 `docker` 创建我们所需的环境，再到 `docker-compose` 一键管理我们的环境，相信你也学到了很多。
至少再也不用担心的环境问题了！
今天就到这里，下次我们会对 `celery` 进行深入使用哦，敬请期待。

> 参考资料：
>
> [Celery 中文文档](https://www.celerycn.io/)
>
> [菜鸟编程](https://www.runoob.com/docker/docker-compose.html)
>
> [docker compose](https://docs.docker.com/compose/)
>
> 

