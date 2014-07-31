---
layout: post
title: 构建工具系列一--Travis-cli
description: <strong>摘要:</strong> Travis-cli是一个在线的, 分布式的持续集成服务, 用来构建和测试在Github上拖管的代码......<a href="/continuous-integration-tool-travis-cli" title="阅读全文">阅读全文</a>
tags: 前端开发
excerpt: github Travis-cli
---
本文地址: [http://forkme.info/continuous-integration-tool-travis-cli/](http://forkme.info/continuous-integration-tool-travis-cli/)或者[http://www.cnblogs.com/blackmanba/p/continuous-integration-tool-travis-cli.html](http://www.cnblogs.com/blackmanba/p/continuous-integration-tool-travis-cli.html), 转载请注明源地址。

##概述
[Travis-cli]()是一个在线的, 分布式的持续集成服务, 用来构建和测试在[Github][]上拖管的代码。wikipedia上定义如下：

> In software development, Travis CI is a hosted, distributed [continuous integration][] service used to build and test projects hosted at [GitHub][]. The software is also available as an [open source][] download on GitHub, although its developers do not currently recommend it for on-premise use for closed projects.

Travis-cli不同于以前的持续集成工具, 它采用[YAML][]格式来声明(ps: 本博客使用的是[Github page][], 也是采用YAML格式配置的, [传送门][]), 同时支持C, C++, Clojure, Erlang, Go, Groovy, Haskell, Java, JavaScript, Perl, PHP, Python, Ruby和Scala语言。

插播: [构建工具系列二--Grunt](/frontend-scaffold-grunt/)

## 用途
那么, **Travis-cli**作为一个工具究竟在使用在什么应用场合呢？一般来说会在两种情况下使用：一是项目的自动测试; 而是项目的自动构建。我们知道, 在Github上协作开发过程中可能会遇到很多不认识的人或组织通过[pull request][]向我们提交代码或者是多人进行项目开发协作。在这种情况下如何保证代码风格的一致性和代码的正确性就显得十分重要。使用Travis-cli就能很好的解决以上问题。通过预先编写的代码风格检查工具和项目构建工具并将之集成到Travis-cli上, 每次提交代码时Travis-cli就会自动进行构建并对构建结果作出提示, 从而帮助我们检查代码可能存在的问题。

## 如何集成到Github
如何将Travis-cli集成到托管在Github上面的代码库呢？方法如下:

* 关联Github账号并打开开启项目集成
* 项目配置.travis.yml文件

下面是简单说明:
### 1. 关联Github账号并打开开启项目集成
<br />
1.1 进入网站[https://travis-ci.org/](https://travis-ci.org/)并点击右上角的**Sign in with GitHub**链接;

1.2 登录Github账号, 赋予Travis-cli权限, 如图:
<img src="/images/travis-cli/auth.png" alt="auth" title="auth" width="70%" height="70%" />

1.3 账号处点击Accounts, 进入Repositories页, 选择要打开Travis-cli的项目, 点击ON, 如图:

<img src="/images/travis-cli/toggle.png" alt="toggle" title="toggle" width="90%" />

### 2. 项目配置.travis.yml文件
<br />
[.travis.yml][]文件是Travis-cli的配置文件, 包括配置使用的编程语言, 版本以及执行的命令等等。具体语言的使用的配置信息不同, 参数说明在**http://docs.travis-ci.com/user/languages/×××(×××表示所使用的语言)**。比如c语言的具体配置信息链接是[http://docs.travis-ci.com/user/languages/c][]。

配置完.travis.yml后, 只要将其上传到对应目录的根目录下, 以后每次提交就可以自动进行构建了！

** Finally: enjoy it! ^_^ **

## 总结
本文介绍了Travis-cli项目持续构建工具的使用配置。希望您能在自己的Github项目中使用它, 感受它带来的便利和好处。

[Guthub]: Github
[Travis-cli]: https://travis-ci.org
[continuous integration]: http://en.wikipedia.org/wiki/Continuous_integration
[GitHub]: http://en.wikipedia.org/wiki/GitHub
[open source]: http://en.wikipedia.org/wiki/Open_source
[YAML]: http://en.wikipedia.org/wiki/YAML
[Github page]: https://pages.github.com/
[传送门]: http://forkme.info/github-pages/
[pull request]: https://help.github.com/articles/using-pull-requests
[.travis.yml]: http://docs.travis-ci.com/user/build-configuration/
[http://docs.travis-ci.com/user/languages/c]: http://docs.travis-ci.com/user/languages/c