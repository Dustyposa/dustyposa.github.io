---
title: python 编写多进程 socket web静态服务器
tags:
  - python3
  - server
  - socket
category:
  - 网络
  - 服务器
abbrlink: 6e9446e6
date: 2020-04-06 11:12:42
---
### 服务器模型 C/S模型

**socket** 是什么 ？
**一种进程间的通信技术 由伯克利大学（BSD） 发明， 才有了当前的互联网**

**几乎所有的C/S模型服务器， 底层都是socket实现的， web服务器也不例外， 只是web服务器用了：**
#### **HTTP协议**
<!-- more -->
用python搭建简易的web服务器：
#### 1. 导入相关模块
```python
import os  # 导入系统模块
import socket  # 导入 socket包
from multiprocessing import Process  # 导入多进程模块
```
#### 2. 创建类并初始化 

**初始化出部分需要的属性 方便之后方法的使用**
port 主机需要绑定的端口
```python
class WebServer(object):
    BASE_DIR = os.path.join(os.getcwd(), 'static')  # 查询文件夹， 用来查找访问的文件
    RESPONSE_STATUS = {200: 'OK', 404: 'Not Found', 403: 'Forbid'}  # 设置响应行可选返回状态码， 只选择了部分做演示

    def __init__(self, port=8080):
        """
        初始化参数
        :param port:
        """
        self.soc = self.create_server(port)  # 初始化socket对象
        self.new_fd: socket.socket = ...  # 方便pycharm提示,防止pycharm报波浪线
        self.request_dict = {}  # 设置空字典， 用于存储处理过后的请求头
        self.response_dict = [('Server', 'my_server'), ('Content-Type', 'text/html; charset=utf-8')]  # 设置响应头，因为可能有多个Set-Cookie， 所以用列表中的元组存储
```
#### 3. 初始化socket对象 固定四部曲
1. 创建socket对象
2. 绑定address， ip及端口
3. 防止服务器异常时， 端口的占用， 影响服务器的重启
4. 转成监听模式
```python
    # 创建socket对象
    def create_server(self, port):
        """
        用来初始化server对象
        :return:
        """
        self.soc = socket.socket()  # 创建socket对象
        self.soc.bind(('', port))  # 绑定套接字到address， 一般为 ip+port， 并且host一般是127.0.0.1或者不填(等内核分配)，一般无权绑定非本机ip
        self.soc.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)  # 接续服务器突然宕掉时，端口暂时不能使用的问题
        self.soc.listen(5)  # 转为监听状态 服务器必须
        return self.soc
```
#### 4. 多进程接受请求
1. accept() 从缓存中拿出连接描述符 此处为 阻塞IO 加入子进程
2. 创建子进程 此处为 阻塞IO 在子进程中处理
3. 开启子进程
4. 剪掉主进程对描述符的引用
```python
    # 开启多进程
    def runserver(self):
        """
        多进程处理请求
        :return:
        """
        while True:
            self.new_fd, _ = self.soc.accept()  # 从缓存中读取新的请求
            fd = Process(target=self.handler)  # 转到子进程中执行
            fd.start()  # 开启进程
            self.new_fd.close()  # 去掉主进程引用
```
#### 5. 接受描述符发送的信息

```python
    # 接收请求头
    def handler(self):
        """
        处理发送过来的信息
        :return:
        """
        print('新的链接到来，', self.new_fd)
        buf: bytes = self.new_fd.recv(1024)  # 读取部分数据，主要用来处理请求行和请求头
        if buf:
            new_buf = buf.decode('utf8')  # 将二进制数据转成str
            # 解析字符串
            self._request_handler(new_buf)
```
#### 6. 处理请求头
1. 处理请求行， 推荐使用 splitlines()进行分割， split('\r\n')在跨平台时不好用
2. 处理请求体
3. 获取文件路径
4. 进行后续处理

```python
    # 解析请求头
    def _request_handler(self, data: str):
        """
        浏览器请求 格式固定
        请求行: GET / HTTP/1.1\r\n
        请求头: Host: 127.0.0.1\r\n
               User-Agent: Mozilla5.0...\r\n
        请求体: 基本为固定为POST 的内容， 此处不演示
        :param data:
        :return:
        """
        data = data.splitlines()  # 进行行分割
        request_head = data.pop(0).strip()  # 接受请求行
        self.request_dict['Method'], self.request_dict['Path'], _ = request_head.split(' ')  # 生成请求行字典
        # 遍历data部分,得到请求头信息 Host: 127.0.0.1 列表中的格式
        new_data = {x[0]: x[1] for x in [i.split(':') for i in data if ': ' in i]}
        # 更新字典
        self.request_dict.update(new_data)
        # 获取请求路径
        self.filename = self.request_dict['Path'][1:]  # 获取请求的url
        os.chdir(self.BASE_DIR)  # 改变查找文件
        self._response_handler()

```

#### 7. 拼接及发送响应头
1. 等待状态码的返回
2. 根据不同状态吗 拼接不同的响应行
3. 拼接响应头
4. 发送响应头
5. 处理响应体
```python
# 发送响应头
    def _response_handler(self):

        """
        响应体的格式
        响应行: HTTP/1.1 200 OK\r\n
        响应头: Content-Type:text/html; charset=utf-8\r\n
               Server: My_server\r\n
        响应体: HTML/JSON/JPG/PNG/MP3.....
        """
        self.status = self._check_request()
        response_head = f"HTTP/1.1 {self.status} {self.RESPONSE_STATUS[self.status]}\r\n"  # 组成请求行
        response_content = ''.join([i[0] + ': ' + i[1] + '\r\n' for i in self.response_dict])  # 组成请求头
        response_end = '\r\n'  # 换行  头部结束
        self.response = response_head + response_content + response_end
        # 发送请求头信息
        self.new_fd.send(self.response.encode('utf8'))
        self.send_response()
```
#### 8. 判断状态码，简单判断，有资源返回200，没有资源返回404
1. 判断是否是文件
```python
    @set_status
    def _check_request(self):
        """
        给出返回值， 403用装饰器装饰
        :return:
        """
        if os.path.isfile(self.filename):
            return 200
        else:
            return 404
     ```
#### 9. 装饰器添加User-Agent验证
1. 在类外面定义装饰器函数，
2. 进行User-Agent判断
```python
def set_status(fun):
    """
    返回值的装饰器, 增加User-Agent判断代理是否异常， 返回403
    :param fun:
    :return:
    """

    def change(self, *args, **kwargs):
        if len(self.request_dict['User-Agent']) < 60:
            return 403
        else:
            return fun(self, *args, **kwargs)

    return change
```
#### 10. 发送响应体，关闭连接
- 根据不同的返回值，决定如何返回
```python
    # 发送响应体内容
    def send_response(self):
        if self.status == 200:
            # 正常访问页面
            with open(self.filename, 'rb') as f:
                self.new_fd.send(f.read())
        elif self.status == 404:
            # 打开404页面
            with open('404.html', 'rb') as f:
                self.new_fd.send(f.read())
        elif self.status == 403:
            self.new_fd.send('ForForForbid'.encode('utf8'))  # 皮一下
```
github上的完整代码 [web_server](https://github.com/Dustyposa/segementfault/blob/master/web_server.py)
