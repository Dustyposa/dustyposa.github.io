---
title: pytest 之旅(Part:1)（ing 未写完，慎点）
tags:
  - python
  - test
category:
  - advance
mermaid: false
abbrlink: 173aa14f
date: 2020-04-22 22:34:26
---

## 从零开始使用 Pytest

### install
安装比较简单，我们使用：
```
python3 -m pip install pytest
```
即可。

<details>
<summary>venv 安装方式<b style="color: darkred">（推荐）</b></summary>

```bash
python -m venv env  # 创建 虚拟环境文件夹
source env/bin/activate  # 激活虚拟环境，windows 请自己寻找 activate.exe
pip install pytest

# else command
deactivate # 退出虚拟环境
```

</details>

### 基本使用
我们建立一个 `test_a,py` 文件，编写一些测试代码:
```python
import pytest

def test_bool() -> None:
    assert bool(1) == True
    assert 2 > 1
    with pytest.raises(ZeroDivisionError):
        1 / 0
```
**运行测试文件：**
```bash
$ pytest test_a.py
```

我们可以看到打印出来了很多东西：

> 待补充

#### 那么从这个简单的 `demo` 我们能看出和 `unitest` 比起来有什么区别呢？
我认为至少有 3 点：
 - 更自然
     - 用 `assert` 实现，不需要 继承 `unittest.TestCase` ，以原生语法就能支持
 - 更解耦
     - 不需要额外的类来管理，直接用函数管理测试用例即可
- 搭建速度更快
    - 想到什么就能写什么

### 进阶使用
#### 命令行参数
#### parameterze
#### fixture
#### task

