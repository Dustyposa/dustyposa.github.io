---
title: 从零开始搭建Github博客(其二)
tags: [github_pages, hexo]
category: [blog]
date: 2020-04-09 10:28:39
---
# 搭建 github 博客之旅 （Part 1）
在第一部分，我们介绍了如何搭建一个免费博客并部署在 `Github` 上面，但是我们还有很多可以优化（更懒）的地方，例如：
- 自动部署（非一键部署）
- 主题更换（换个漂亮的皮肤）
- 性能优化（带宽，响应太慢？）
- 加点料
- etc...

那么，话不多说，开始正题。

## 自动化部署-CI/CD 
### 简介
我们简述一下我们目前的部署流程：
```mermaid
在 writing 编写文章, 编写完成后，运行 
$ hexo g & d
长篇文章写好之后，这点操作没什么太大负担，但是如果进行小调整的话每次都要输这些命令，那就很麻烦了。
那么我们思考一下，写完文章后输入命令发布，
命令是不变的，那么我们这里肯定可以自动化。
那么，关键问题是如何确定文章写完了？毕竟不可能每次写一半，或者写一点就自动发布，我们就需要一个发布触发点。
git 比较好想，我们出发点使用 push 或者 分支更新即可。
看起来很简单，如何实现呢？
这时候就可以祭出我们的利器了 - Travis Ci！
```

<details>
<summary>
    CI/CD 是什么?
</summary>

这里自动部署，用到了一个概念 `CI/CD (持续集成/持续部署)`。
简单来说，就是让开发部署自动化，我们设置一个流程，对每次发布后的代码都进行相同的操作（比如：运行测试之类，当然测试完成后，我们也可以自动合并或者自动部署）。
这里，我们的项目比较简单，我们做到自动部署即可。让我们管理博客更加轻松。
> wiki解释：
>在软件工程中，CI / CD或CICD通常是指持续集成与持续交付或持续部署的组合实践。在企业沟通的上下文中，CI / CD还可以指代企业标识和企业设计的整个过程。
>
 
</details>

### Travis Ci 安装
#### 简介
<details>
<summary>Travis 是什么</summary>

> Travis CI是在软件开发领域中的一个在线的，分布式的持续集成服务，用来构建及测试在GitHub托管的代码。这个软件的代码同时也是开源的，可以在GitHub上下载到，尽管开发者当前并不推荐在闭源项目中单独使用它

简单的说，就是针对 `GitHub` 的 `CI`，也就是我们要的 `CI` 工具了，你应该也在很多仓库看到过这个工具，一般就叫 `traviscibot`。
like this：
![image.png](https://i.loli.net/2020/04/09/RkIPD9piuQjCfG3.png)
</details>

#### 安装
 - a. 把 `Travis CI` 添加到你的 `GitHub` 账户中。
    打开 [Travis CI](https://github.com/marketplace/travis-ci) 安装页面。
    选择免费安装（只适合于开源项目）
![image.png](https://i.loli.net/2020/04/09/HfkOcwTMa2sVWJ8.png)
   b. 配置 `Travis CI` 权限。
   前往 `GitHub` 的 [Applications settings](https://github.com/settings/installations)，配置 `Travis CI` 权限，使其能够访问你的 `repository`。
   > 待补图
                                                                                                                                                                                                                                                                                                                                                         
   你应该会被重定向到 `Travis CI` 的页面。如果没有，请 [手动前往](https://travis-ci.com/)。              
                                  
    在浏览器新建一个标签页，前往 GitHub 新建 [Personal Access Token](https://github.com/settings/tokens)，只勾选 `repo` 的权限并生成一个新的 Token。Token 生成后请复制并保存好。
    回到 Travis CI，前往你的 repository 的设置页面，在 **Environment Variables** 下新建一个环境变量，**Name** 为 `GH_TOKEN`，**Value** 为刚才你在 GitHub 生成的 Token。确保 **DISPLAY VALUE IN BUILD LOG** 保持 **不被勾选** 避免你的 Token 泄漏。点击 `Add` 保存。
    c. 编写自动部署脚本
    新建一个 `.travis.yml` 的文件:
    ```yaml
   sudo: false
language: node_js
node_js:
      - 10 # use nodejs v10 LTS
cache: npm
install:
      - cd blog && npm i
# 限制使用 travis 的分支
branches:
      only:
          - writing
script:
      - hexo clean
      - hexo generate # generate static files
deploy:
      provider: pages
      skip-cleanup: true
      github-token: $GH_TOKEN
      target-branch: master  # 目标分支
      keep-history: true
      on:
        branch: writing  # 在哪个分支运行脚本
      local-dir: docs/public  # 部署的文件夹

   ```
