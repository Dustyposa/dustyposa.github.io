---
title: 从零开始搭建Github博客(其一)
tags: [github_pages, hexo]
category: [blog]
date: 2020-04-07 18:03:30
---
# 搭建 github 博客之旅 （Part 1）

## 简介


*修正（这里经常被忽略，所以不折叠了，感觉还是比较有意义的）：这非实操部分，可以跳过！*

搭建博客其实还是有很好处的，比如随时记录自己的`idea`，记录学习过程，让别人了解你,etc...    
搭建博客的方式有很多，但是必不可少的肯定是：
   - 服务器
   - 前端页面  

没有服务器，怎么办？我们有 `Github Pages`。  
前端页面写起来太麻烦？ 我们有 `hexo or jekyll`。  
部署麻烦？我们有 `travis` 自动部署。  
emm,好像看起来很简单？就是避坑总结？ 没人看怎么办？  
**当然没那么简单！**    
我们再加点新东西，速度优化，自动化脚本，全部往上面加！话不多说，不要浪费自己的计数能力，就是冲！  
综上，所以有了我们这个小系列文章，越看越精彩！


## Github Pages
### 1. GithubPages 简介

<details>
<summary>Github Pages是...</summary>

> GitHub Pages 是一项静态站点托管服务，它直接从 GitHub 上的仓库获取 HTML、CSS 和 JavaScript 文件，（可选）通过构建过程运行文件，然后发布网站。 您可以在 [GitHub Pages 示例集合](https://github.com/collections/github-pages-examples)中查看 GitHub Pages 站点的示例。  
 您可以在 GitHub 的 github.io 域或自己的自定义域上托管站点。 更多信息请参阅“对 GitHub Pages 使用自定义域”。

通俗的说，就是你可以把一个仓库当作**一台服务器(静态)**，可以用 `github.io` 的域名来访问。  
这就解决我们的服务器问题了！  

`Github Pages` 有三类——项目、用户和组织。
区别不大，主要是域名及发布分支的区别。
我们教程使用的 `Github Pages` 是用户类，默认发布源只能为 `master`。（这里要注意哦，只能为 `master`，发布目录为根目录或者 `/docs`）
So，我们开始吧。

</details>

### 2. 创建 `Github Pages`
- a. 创建`Github Pages`仓库，名字必须为 `<username>.github.io`。 [详细教程](https://help.github.com/cn/github/working-with-github-pages/creating-a-github-pages-site)
    也就是你的用户名 + '.github.io' 
    比如我的就是这样：
    > ![image.png](https://i.loli.net/2020/04/09/RMB6AstjyE3m5Dc.png)
                             
                                                                                                                                                                                                    >
    创建时建议**勾选上**，避免手动 `init`:
    > ![image.png](https://i.loli.net/2020/04/09/AhHR5Y7TzvmgeFi.png)
- b. 克隆创建的仓库 
  `git clone https://github.com/username/username.github.io.git`
- c. 创建页面文件并部署页面
   ```bash
   cd username.github.io  
   echo "my first page in git hub" > index.html  # 创建 index.html 文件
   # 开始部署
   git add --all 
   git commit -m "init first page"
   git push -u origin master  # 推到 master 分支后相当于自动部署
   ```
   做完上述操作后，我们打开[你的站点页面(https://username.github.io)]
   就能看到我们的创建的网站～不过目前只有一句话。
    效果如下图：
    > ![image.png](https://i.loli.net/2020/04/09/P8msFpzLXjbSliq.png)
### 3. 总结
`Github Pages`就相当于一个**独立站点**，从上面的操作步骤可以看出。展示内容与我们的仓库内容相关。尤其是 `index.html`。 
那么，我们就有很多发挥空间了。
编写静态博客太麻烦？
上 `Hexo` ！


## Hexo

### 1. Hexo 简介

<details>
  <summary>Hexo是...</summary>
  
> `Hexo` 是一个快速、简洁且高效的**博客框架**。`Hexo` 使用 `Markdown`（或其他渲染引擎）解析文章，在几秒内，即可利用靓丽的主题生成静态网页。


也就是说，我们不用从零开始编写静态网站，利用现有的博客生成器就可以了！
而且 支持 `Markdown`！写文档必备。
效果如何？马上来看。
</details>

### 2. 安装并生成博客
   - #### a. 安装 `hexo`      
         npm install -g hexo-cli
     > node 版本推荐 10+
     
   - #### b. 初始化 `Hexo` 博客
    ```bash
    hexo init docs # docs 为文件夹名称
    cd docs
    npm install  # 安装相关依赖
    ```
    
     新建完成后，我们可以看到目录如下：
        ```
        .
        ├── _config.yml  # 配置文件
        ├── package.json  # 安装依赖
        ├── scaffolds  # 模版文件
        ├── source  # 资源文件
        |   ├── _drafts
        |   └── _posts
        └── themes  # 主题文件夹，根据不同主题生成不同的静态资源
        ```

   - #### c. 开始写博客
    我们根据模板创建一片文章
    `hexo new poster_name  # poster_name 为文章名字，当然都可以改`
    可以看到，运行命令之后，我们在 `source/_posts` 下生成了一个叫 `<poster_name>.md` 的文件。
    这就是我们的博客文件，我们用 `Markdown` 语法简单测试一下。写入以下内容：
        
    ````markdown
    
    ## 这是我的第一篇博客
    > 引用能用吗？
    
    ```python
    # 我是 python 代码
    a = 1
    print(a)
    ```
    
    ````
   - #### d. 实时博客效果
    文章写好了。怎么看效果呢？  
    我们运行 `hexo server` 即可。
    ```bash
    $ hexo server # or hexo s
    INFO  Start processing
    INFO  Hexo is running at http://localhost:4000 . Press Ctrl+C to stop.
    ```
    得到输出结果如上，打开 [http://localhost:4000](http://localhost:4000) 就能看到我们的页面了！
    > 待补图
    
    我们更改一下我们的 `md` 文件，再刷新一下，就能**实时**看到效果。
    参考效果如下：
    > ![image.png](https://i.loli.net/2020/04/10/5hozAHC6kqx3sVY.png)
   - #### e.生成静态站点并部署
   博客预览ok，那么就可以准备生成静态站点文件了。
   So，我们运行
   ```bash
hexo generate # or hexo g
```
    就能看到有一堆文件产生，都放在了我们的 `public` 文件夹下面。
    最重要的 `index.html` 也在其中。
    那么问题来了，因为 `index.html` **必须**在 `/ or /docs` 目录下面。
    而现在我们的目录结构是 `/docs/public/index.html` 。这样直接推上去肯定是不行的，那么怎么办呢？
    > 当然，解决办法有很多，但是都**不是很推荐**，我们列举几个，发散一下思维。
    例如：
    > - 单开一个分支用来写，master 只用来部署，保留 public 文件夹内容。实现方式利用软连接即可，这样可以写一个分支，部署一个分支，做到分离。
    > - 改变 git 根目录，改变仓库位置。
    
    这时候，就可以祭出我们的部署神器 `hexo-deployer-git`
    首先安装它（记得切换一个分支， 比如 `writing` ， 专门用来写文章）：
    ```
    npm install hexo-deployer-git
    ```
    之后编辑一下 `_config.yml`， 将末尾替换一下：
    ```
    # Deployment
    ## Docs: https://hexo.io/docs/deployment.html
    deploy:
      type: git
      repo: git@github.com:username/username.github.io.git
      branch: master
    # username 是你的 github 昵称！！！！！！！！！！
    ```
    之后运行
    ```
    hexo deploy # hexo d
    # 或者 生成加部署 hexo g & d
    ```
    就能一键部署完成了！
    一气呵成。
> Notion: 问题思考，部署后，我们的`origin` 的 `master` 分支的内容都是 `pulic` 文件夹中的内容。也就是运行 `hexo g` 之后生成的内容。
> 那么，本地的比如主题文件，博客文件之类怎么办呢？ 我换个环境怎么编写博客以及部署呢？

    <details>
        <summary>思考一下再看</summary>
        
        我们可以新建一个分支，专门用来写东西以及维护样式。
        比如 `writing` 分支， 然后我们将 `docs` 文件夹及其下面的全部都传上去即可，(`node_modules` 之类的文件不用上传)~。
        之后我们换个环境，只需要：
        ```bash
        git clone -b writing 仓库地址
        cd 仓库文件夹/docs
        npm i
        ```
        就能同步环境了。
        之后 用 `hexo` 正常操作即可~
        
    </details>

那么第一篇就到这里(第一步踩坑完成)，之后我们会出第二篇，会加上一些小操作～来让我们写博客更简单！
> 详细文档
> [Github Pages 中文文档](https://help.github.com/cn/github/working-with-github-pages/about-github-pages)
> [Hexo 中文文档](https://hexo.io/zh-cn/docs/)
   
    
    
