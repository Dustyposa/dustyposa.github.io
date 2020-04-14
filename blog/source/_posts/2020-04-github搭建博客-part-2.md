---
title: 从零开始搭建Github博客(其二)
tags:
  - github_pages
  - hexo
category:
  - blog
mermaid: true
abbrlink: e575718e
date: 2020-04-09 10:28:39
---
# 搭建 github 博客之旅 （Part 2）
在第一部分，我们介绍了如何搭建一个免费博客并部署在 `Github` 上面，但是我们还有很多可以优化（更懒）的地方，例如：
- [自动部署（非一键部署）](#自动化部署-CI-CD)
- [主题更换（换个漂亮的皮肤）](#更换主题)
- [性能优化（带宽，响应太慢？）](#性能优化)
- 加点料
    - [icon 制作](#icon-生成)
    - [增强表现力-流程图支持](#流程图支持)
    - [来点评论](#评论支持)

那么，话不多说，开始正题。

## 自动化部署-CI/CD 
### 简介
我们简述一下我们目前的部署流程：
> 在 writing 编写文章, 编写完成后，运行 
    ```
    $ hexo g & d
    ```
> 长篇文章写好之后，这点操作没什么太大负担，但是如果进行小调整的话每次都要输这些命令，那就很麻烦了。
> 那么我们思考一下，写完文章后输入命令发布，
> 命令是不变的，那么我们这里肯定可以**自动化**。
> 那么，关键问题是如何确定文章写完了？毕竟不可能每次写一半，或者写一点就自动发布，我们就需要一个**自动发布触发点**。
> `git` 比较好想，我们触发点使用 `push` 或者 分支更新即可。
> 看起来很简单，如何实现呢？
> 这时候就可以祭出我们的利器了 - `Travis Ci`！


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
 - #### a. 把 `Travis CI` 添加到你的 `GitHub` 账户中。
    打开 [Travis CI](https://github.com/marketplace/travis-ci) 安装页面。
    选择免费安装（只适合于开源项目）
![image.png](https://i.loli.net/2020/04/09/HfkOcwTMa2sVWJ8.png)


 - #### b. 配置 `Travis CI` 权限。
   前往 `GitHub` 的 [Applications settings](https://github.com/settings/installations)，配置 `Travis CI` 权限，使其能够访问你的 `repository`。
   > ![image.png](https://i.loli.net/2020/04/11/aNkuiDx9AnSqdby.png)
                                                                                                                                                                                                                                                                                                                                                         
   你应该会被重定向到 `Travis CI` 的页面。如果没有，请 [手动前往](https://travis-ci.com/)。              
                                  
    在浏览器新建一个标签页，前往 GitHub 新建 [Personal Access Token](https://github.com/settings/tokens)，只勾选 `repo` 的权限并保存。`Token` 生成后请复制并保存好。
    > ![image.png](https://i.loli.net/2020/04/11/H5nNtPu8s6RVx3B.png)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 >
    回到 `Travis CI`，前往你的 `repository` 的设置页面，在 **Environment Variables** 下新建一个环境变量，**Name** 为 `GH_TOKEN`，**Value** 为刚才你在 GitHub 生成的 Token。确保 **DISPLAY VALUE IN BUILD LOG** 保持 **不被勾选** 避免你的 Token 泄漏。点击 `Add` 保存。
    设置页面在这里进：
    ![image.png](https://i.loli.net/2020/04/10/A1ZGmkyTudVjWfz.png)
    
    
- #### c. 编写自动部署脚本
    在**根目录**新建一个 `.travis.yml` 的文件:
    ```yaml
   sudo: false
language: node_js
node_js:
      - 10 # use nodejs v10 LTS
cache: npm
install:
      - cd docs && npm i
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
    这样在我们的自动部署就差不多完成了，我们将配置好的文件 `push` 上去。稍等片刻，就能看到自动部署详情了（可以到 `Travis CI` 中看详细日志）。
在我们的 `master` 分支页面就能看到机器人了~
> ![image.png](https://i.loli.net/2020/04/09/RkIPD9piuQjCfG3.png)
    
## 更换主题
默认主题的 `hexo` 比较单调，一点都不炫酷。自然，换肤的需求就诞生了。到现在，`hexo` 也有了很多炫酷的主题可选，在这里，我推荐一个 `Material Design` 风格的主题 [`flud`](https://hexo.fluid-dev.com/docs/guide/#%E4%B8%BB%E9%A2%98%E7%AE%80%E4%BB%8B)
当然也有很多其他主题可选，在[这里](https://hexo.io/themes/)可以看，使用方式基本一致，依葫芦画瓢即可。

### 安装 flud 
  下载 [最新 release 版本](https://github.com/fluid-dev/hexo-theme-fluid/releases)，`master` 分支无法保证稳定。
  下载后解压到 `themes` 目录下并重命名为 `fluid`。
  结果如下图：
![image.png](https://i.loli.net/2020/04/09/IaOnpSDxCGYFeUK.png)

### 更换主题
   更换主题也很简单，我们更改 `hexo` 配置文件即可。
   打开 `docs/_config.yml` (即博客目录下的该配置文件),更改下面的配置：
   ```

theme: fluid  # 指定主题

language: zh-CN  # 指定语言，可不改
```
这样我们重新运行
```hexo s```
就能看到我们新的主题了！参考效果如下：
> ![image.png](https://i.loli.net/2020/04/11/fvBIEbJsaukDd26.png)

整个操作也很简单，但是需要定制化操作的话，看[官方文档](https://hexo.fluid-dev.com/docs/guide)即可～非常详细。


## 性能优化
由于我们的带宽是有限的，那么如果传递的资源太大，响应就会很慢。大家可以测试一下，**更换一下** `banner` 图片，**部署**后再次访问，就会发现很慢很慢。这也非常影响用户体验。

那么如何解决呢？
很明显，我们至少有两种解决办法：

- ~~a. 加带宽~~ （什么？加带宽？那是不可能的，服务器都是白嫖的，还想我加带宽？？？）
- b. 减少从**自身**服务器传输的数据量（注意加粗部分）
    这里我们可以再分出两种思路
    - **1. 减少自身服务器传输的数据大小（例如: 文本文件数据，图片数据之类）**  
    - **2. 将数据放到其他地方，远程获取（例如： CDN，文件服务器，图床等等）** 

那么，我们就简单介绍一下这两种方法，顺便对我们的博客网站进行优化。
### 文件压缩
#### a. 文本文件压缩
这个我们列举一种方式，用压缩插件完成即可。
- 安装插件 `hexo-all-minifier`
```
npm install hexo-all-minifier --save
```
> mac 用户可能需要安装其他东西
`brew install libtool automake autoconf nasm`

- 开启插件 
在博客配置文件中加入
```
all_minifier: true
```
我们在运行 `hexo g` 或者部署即可看到效果，`js,css` 等文件都被压缩了。
> 压缩详细配置可参考文档：
[hexo_all_minifier](https://github.com/chenzhutian/hexo-all-minifier)


### 图片压缩以及存储
#### 图片压缩
我们的文件压缩了，大一点图片怎么办呢？（比如图片就有：1M， 这样我们网站加载也会很慢）
当然图片也可以直接通过 `js` 来压缩，但是压缩品质可能不太好。我们换一种服务，[tinyjpg](https://tinyjpg.com/)
使用也很简单，把要压缩的图片放上去，压缩后下载回来即可，我们就不阐述了。
#### 图片存储
那么图片有了，我们应该把图片放哪里呢？放本地？不大好，毕竟**带宽很慢，也浪费资源。**
这里我们推荐一种通用方式，`CDN or 图床 or 文件存储服务之类`。这里我们选用**图床**，其他的都大同小异。
图床有很多可以选择的，因为图片比较少，我就推荐一个我目前使用的图床。[MS](https://sm.ms/)

> 图床是什么？
简单的说就是一个专门用来放图片的地方，图片在图床服务的服务器。
好处是？
图片在别的服务器，当然就不会占用我们服务器的带宽，有些图床还支持 `CDN` 速度能更快。
另外，图片管理也更方便，平时的图片都可以存上面（非隐私图片）。

使用那就很简单了，我们把图片上传到图床即可。上传之后大致可以得到如图效果：
> ![image.png](https://i.loli.net/2020/04/10/PrDiS9lLkMfWJ7V.png)

常用的链接一般就这两个～一个是绝对链接，一个是 `Markdown` 语法的，复制到 `md` 文件中就能看到效果了。

综上，合理**压缩和利用图床**等存储服务，能**极大的提升我们的博客响应速度**。降低服务器压力～将用户体验提升到极致。（当然任何服务都可以酌情应用该方案，不止博客！）



### 小插曲
**ちょっと待って，不对不对，你这不是套我嘛？浏览者的用户体验提升了，但是写作者的用户体验没提升呀，还要传来传去，跳来跳去，多麻烦。**
没错！这个问题，我们当然也能优化！怎么做？
**等下回咯**（逃，不要打我

到这里结束了嘛？当然没有，我们再加一点其他的小插件。


## icon 生成
不知道大家发现没有，我博客的 `icon` 变了！！
**5分钟**搞定的。
How to do?
来试试我们的神奇的[网站](https://favicon.io), 网站比较简单，专门用来做 `icon`, 怎么使用网站就不介绍了，我们介绍一下如何替换自己网站的 `icon`。
我们主要需要这个文件：
```
favicon.png
```
在网站生成的`压缩包`中可以找到。
我们把它放入和 `_posts` 文件夹同级的 `img` 文件夹中即可。
大概如下图：
```
├── _post
├── img
|   ├── favicon.png
```
就是这么简单～

## 流程图支持
为了增强文章的表达力，我们有时候也会在文章中加入一些**流程图**就像这样：
<div class="mermaid"> 
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
</div>
那么如何做呢？只需要 **4步**：

#### 1. 安装 `hexo-filter-mermaid-diagrams` 插件
```
npm i hexo-filter-mermaid-diagrams # or yarn install hexo-filter-mermaid-diagrams
```
#### 2. 配置 `ejs`
因为我们的流程图之类主要在文章中使用，所以我们只给文章页面配置该功能。
找到该文件 `post.ejs`:
```
├── themes
|    ├── fluid  # 你的使用的主题的文件夹
|           ├── layout
|                   ├── post.ejs
```


在文件末尾加上以下代码：

```ejs
<!-- Mermaid -->
<% if (page.mermaid && theme.post.mermaid.enable) { %>
  <script src="<%- url_for(theme.post.mermaid.cdn) %>"></script>
  <script>
    if (window.mermaid) {
      mermaid.initialize(<%- JSON.stringify(theme.post.mermaid.options) %>);
    }
  </script>
<% } %>
```
在主题配置文件的 `post` 配置中，大概这个位置：
![image.png](https://i.loli.net/2020/04/12/IrSOQmKZAujbW7x.png)

加入以下代码：

```yaml
mermaid: ## mermaid url https://github.com/knsv/mermaid
  enable: true  # default true
  specific: false
  cdn: https://cdn.jsdelivr.net/npm/mermaid@7/dist/mermaid.min.js
  options:  # find more api options from https://github.com/knsv/mermaid/blob/master/src/mermaidAPI.js
    theme: forest
```



<p class="note note-info">
<b>简单的性能优化</b>：
<br>
由于不是每篇文章都要流程图之类以及该功能需要<b>加载</b>额外的 <code>js</code> 文件，所以我们设置了一个开关，来让文章决定是否开启加载。
</p>

#### 3. 开启 mermaid 渲染
主要要在文章文件 `xxx.md` 的顶部加上：
```yaml
mermaid: true
```
这样我们的这篇文章就会**加载**渲染流程图需要的 `js` 文件， 如果不设置，文章就**不会加载**相关 `js` 文件。

`md` 文件的参考头部如下：
> \---
> title: 从零开始搭建Github博客(其二)
> tags: [github_pages, hexo]
> category: [blog]
> date: 2020-04-09 10:28:39
> **mermaid: true**
> \---

#### 4. 在文章中加入流程图语法
完成上面的设置之后，就完成了大半了，但是我们的 `md` 文件中中还没有流程图语法。
流程图语法也比较简单，**`md`** 文件中的任意位置加入以下代码即可：
```html
<div class="mermaid"> 
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
</div>
```
这样就更能增强文章的表达力了～赶快试一试吧！

## 评论支持
评论支持比较简单，参考这篇文章就行。
[评论支持](https://litstronger.github.io/2020/04/03/hexo-fluid%E6%B7%BB%E5%8A%A0utterances%E8%AF%84%E8%AE%BA%E5%8A%9F%E8%83%BD/)

<p class="note note-danger">
<b>下面部分请根据自己的主题及参考代码酌情设置!!!!</b>
</p>

但是开启评论的话参考 `post.ejs` 部分，具体代码如下(主要是**第一行**)：

```js
<% if(page.comments && theme.post.comments.enable) { %>
                <!-- Comments -->
                <div class="comments" id="comments">
                  <% var type = '_partial/comments/' + theme.post.comments.type %>
                  <%- partial(type) %>
                </div>
              <% } %>
```

由上面代码可得，如果要开启评论还需要在每篇文章的头部加上
```
comments: true
```
才会开启，不是很方便，所以我们做一下粒度控制。
### 粒度控制

<p class="note note-info">
主要是方便我们开启全局都允许评论，忽略文章头部的设置。因为大多数文章都是开启评论，小部分可能需要关闭评论，所以我们就用来用代码控制这小部分情况。
</p>

#### 1. 在主题配置文件中的 `post.comments` 中加入一个粒度开关 `postCheck`：
```yaml
post:
  ...
    comments:  
        ...
        postCheck: false
```

#### 2. 更改 `post.ejs` 配置
更改参考如下：
```js
<% if((!theme.post.comments.postCheck || page.comments) && theme.post.comments.enable) { %>
```

这样，当我们设置 `postCheck: false` 时，所有文章都会**开启评论**。
而当我们设置 `postCheck: true` 同时如果文章头部设置了: `comments: false` 时，该篇文章就会**禁用**评论功能了~


## 增加看板娘
就是我的博客右下角那 **萌小子**
实现也很简单，参考 [这里](https://github.com/EYHN/hexo-helper-live2d)即可
<p class="note note-info">有一点需要注意:可以将官方的两种配置混合使用</p>

## 增加永久链接
因为目前我们的文章链接**不是固定的**，所以分享给别人的时候链接会**失效**，所以有了这个插件，就可以**固定**住我们的文章链接了。
安装模块：
```bash
npm install hexo-abbrlink --save
```
更改配置:
全局搜索 `permalink`,然后更改为
```yml
permalink: posts/:abbrlink/
# 下面的为需要添加的
abbrlink:
  alg: crc32  # support crc16(default) and crc32
  rep: hex  # Represent (the generated link could be presented in hex or dec value)
```

*具体作用可以参看[文档](https://github.com/rozbo/hexo-abbrlink)*

开启测试：
命令行界面输入 
```bash
hexo clean  # 这部比较关键
hexo s # 重启服务
```
就可以看到我们的网站链接都变成了固定的短链接了。
<p class="note note-info">
可能遇到的情况是文章没有生成短链接，那是由于文章头部加了 <code>layout: xxx</code>，<b>删除</b>该配置即可。
</p>


## 音乐播放器
[WAITING TO SET](https://github.com/MoePlayer/hexo-tag-aplayer/blob/master/docs/README-zh_cn.md)
next part




>参考资料：
[hexo 文档](https://hexo.io/zh-cn/docs/github-pages)
[fluid 文档](https://hexo.fluid-dev.com/docs)
[hexo_all_minifier 文档](https://github.com/chenzhutian/hexo-all-minifier)
[hexo-filter-mermaid-diagrams](https://github.com/webappdevelp/hexo-filter-mermaid-diagrams)
[评论支持](https://litstronger.github.io/2020/04/03/hexo-fluid%E6%B7%BB%E5%8A%A0utterances%E8%AF%84%E8%AE%BA%E5%8A%9F%E8%83%BD/)
[固定链接](https://github.com/rozbo/hexo-abbrlink)

