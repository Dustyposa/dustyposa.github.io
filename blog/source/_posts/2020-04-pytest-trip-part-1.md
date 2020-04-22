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
