---
title: Python Requests 代理和重定向信息
pubDatetime: 2020-04-07T09:43:13Z
description: "Python Requests 库中代理和重定向的使用教程"
author: DustyPosa
featured: false
draft: false
tags:
  - python
  - requests
  - 网络请求
category:
  - Python 进阶
---
在使用 `requests`的途中，我们经常会有使用代理的需求。那么如何使用代理呢？
使用起来是和简单的，话不多说，直接上代码：
#### 1. http 代理
代理只需要一个字典，一般格式如下：
`{"http": "http://user:pass@10.10.1.10:3128/"}`
需要注意的是，该方式值是针对`HTTP Basic Auth`
我们测试网址使用`http://httpbin.org/get`
完整代码如下：
```python
import requests
from pprint import pprint

url = 'http://httpbin.org/get'
proxies = {"http": "http://111.111.90.238:8888", "https": "http://111.111.90.238:8888"}
response = requests.get(url, proxies=proxies).json()
pprint(response)
```
输入如下：
```
{'args': {},
 'headers': {'Accept': '*/*',
             'Accept-Encoding': 'gzip, deflate',
             'Host': 'httpbin.org',
             'User-Agent': 'python-requests/2.22.0'},
 'origin': '111.111.90.238, 111.111.90.238',
 'url': 'https://httpbin.org/get'}
 ```
 可以看到`origin`字段变成你使用的**代理的ip**，代理就成功啦。
 是不是很简单？不过需要注意的是，我们使用的代理没**有认证的用户名和密码，就没有添加**，如果有的话，需要按照格式填写哦。
**还有一点：** `http 和 https`设置了两个，两种请求方式可以用不同的代理。

#### 2. socks 代理
和`http`代理类似，代码也很简单，基本格式如下：
`'http': 'socks5://user:pass@host:port'`,也就是`scheme`不一样。
代码如下：
```python
import requests
from pprint import pprint

url = 'http://httpbin.org/get'
proxies = {"http": "socks5://127.0.0.1:1080", "https": "socks5://127.0.0.1:1080"}
response = requests.get(url, proxies=proxies).json()
pprint(response)
```
一般我们的`socks`代理在本地，所以用的`127.0.0.1`
代码很简单，我们就不重述了。
**接下来，我们看看如何实现重定向请求的获取：**
#### 3. 重定向历史请求获取（history 属性）
要获取重定向请求~我们得先找到有重定向的网址。
我们用`url = 'https://dwz.cn/Qk6kP0DS'`（这是定制的短链接，会跳转到百度）
好了,话不多说，上代码：
```python
import requests

headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36',
}
url = 'https://dwz.cn/Qk6kP0DS'
response = requests.get(url, headers=headers)
redirect_responses = response.history
for resp in redirect_responses:
    print(f'redirect url: {resp.url}')
```
输出如下：
```
redirect url: https://dwz.cn/Qk6kP0DS
```
今天的`TIPS`就到这里~希望你能有所收获
