---
layout: post
title: 【翻译】前景img-sprites, 高对比模式分析
description: <strong>摘要:</strong>在强调网站性能和可访问性相互之间关系的问题中，一个很少有人知道的事实是：<strong>CSS image sprites</strong>，用于<strong>减少HTTP请求</strong>的一门技术，从微软Windows系统中的高对比模式中消失了。这是因为它通常使用的是background-image这个css属性。为了描述这个问题, 我们来看看一些著名的网站在高对比模式下的表现.......<a href="/img-sprites-high-contrast/" title="阅读全文">阅读全文</a>
tags: 前端开发
excerpt: Html/Css
---

->译文，原文在[这里][]<-

本文地址: [http://forkme.info/img-sprites-high-contrast/](http://forkme.info/img-sprites-high-contrast/)或者[http://www.cnblogs.com/blackmanba/p/img-sprites-high-contrast.html](http://www.cnblogs.com/blackmanba/p/img-sprites-high-contrast.html), 转载请注明源地址。

## 概述
最近在开发网页的过程中，发现底部联系方式有很多小图片，突然想能不能直接将所有图片做成Sprites, 然后使用img标签来分别做显示呢(ˇˍˇ）？在找资料的过程中看到了下面[这篇][]文章，很好的解决了我的问题。对文章进行翻译，也算了练练翻译水平，同时方便需要的童鞋翻阅，爱钻研什么的最NB了~~    

**ps: 以下是文章翻译，带有本人的一些见解和想法!!**

在强调网站性能和可访问性相互之间关系的问题中，一个很少有人知道的事实是: [CSS image sprites][], 用于[减少HTTP请求][]的一门技术, 从微软Windows系统中的高对比模式中消失了。这是因为它(注: 指css sprites)通常使用的是**background-image**这个css属性。    

为了描述这个问题, 我们来看看一些著名的网站在高对比模式下的表现.     

**Google Video**中, 前进和后退按钮消失了: 

<img src="/images/imgspriteshighcontrast/google-video.png" alt="Google Video" style="width: auto; height: auto;" />

在**Yahoo Finance**中, 导航标签和按钮消失了:

<img src="/images/imgspriteshighcontrast/yahoo-finance.png" alt="yahoo-finance" style="width: 100%;" />

像**Fackbook**, **Amazon**和**AOL Music**等网站, logo出现从所在的位置消失了的错误。如图:

<img src="/images/imgspriteshighcontrast/facebook.png" alt="facebook" style="width: auto; height: auto;" />

<img src="/images/imgspriteshighcontrast/amazon.png" alt="amazon" style="width: auto; height: auto;" />

流行内容分享服务 **AddThis** 同样在工具箱中的分享按钮上使用了 *CSS sprites* :

<img src="/images/imgspriteshighcontrast/addthis.png" alt="addthis" style="width: auto; height: auto;" />

好的地方是现在大部分网站都使用 *sprites* 来达到更快的用户体验, 然而我们需要注意到我们正在损坏高对比模式下的用户体验。

## <img> Sprites介绍
虽然可以使用**AOL.com**的新设计: 使用新的标识字体（译者注: [Iconfont](http://css-tricks.com/html-for-icon-font-usage/)）来展示头部图片, 我决定使用我想过一些年但一直没有去尝试的东西（注: &lt;img&gt; Sprites）。    

因为 &lt;img&gt; 元素可以在高对比度模式下显示, 为什么不使用图片来达到我们想要的效果呢?    

我们的显示图片头HTML代码看起来是这样子的:

	<h2 class="popular"><img src="img-sprite.png" alt="" />Featured</h2>
	<h2 class="featured"><img src="img-sprite.png" alt="" />Popular</h2>

设置**alt**属性为""是让屏幕阅读器忽略他们（译者注: 这是可访问性的内容）。包含了文本 *Featured* 是为了让搜索引擎明白这一块的作用（比 *alt* 文本更有效）。    

下面的 **CSS** 代码能达到我们想要的效果，切分图片:

	h2 {
		overflow: hidden;
		position: relative;
		height: 50px;
		width: 200px;
	}
	h2 img {
		position: relative;
	}
	h2.popular img {
		top: -100px;
	}
	h2.featured img {
		top: -200px;
	}

只是简单设置了外部容器（在这个例子中是 &lt;h2&gt;标签）的高度（如果需要可以设置宽度）达到你想要切片的图片大小即可, 然后设置top（如果需要设置left）属性来移动图片到指定的位置。

## 验证实现

根据下面的步骤切换到Windows的高对比模式:

* 1. 开始菜单-&gt;控制面板
* 2. 打开可用性选项
* 3. 点击显示标签页
* 4. 点击高可用性复选框
* 5. 点击应用让设置生效
* 或者....
* 1. 使用Alt + Shift + Printscreen快捷键

## &lt;img&gt; Sprite 使用例子
看看 *CSS Sprites* 例子, 然后切换到高对比模式, 然后, 访问 &lt;img&gt; Sprites 页面来查看区别。

<ul>
	<li><a href="http://www.artzstudio.com/files/img-sprites/css-sprite-site.html">CSS Sprites Demo Page</a></li>
	<li><a href="http://www.artzstudio.com/files/img-sprites/img-sprite-site.html">&lt;img&gt; Sprites Demo Page</a></li>
</ul>

## 限制
切分图片要生效的话, 它（注: 表示img标签）必须在[块级元素][]下面或者[行级元素][]但*CSS属性*设置为**display: block**。    

Chris Blouch, AOL网站负责可用性专家经过测试表明: &lt;img&gt;外部的包裹的HTML元素不能包括以下元素（译者注: 本人没有经过测试, 可能新的浏览器已经支持了）:

* 无法切分图片: **&lt;fieldset&gt;, &lt;legend&gt;, &lt;input&gt;, &lt;button&gt;, &lt;table&gt;, &lt;tr&gt;, &lt;td&gt;, &lt;th&gt;**

其他标签都能工作, 如果发现异常情况请在下面留言。

这个解决方法在** IE6+, Firefox 3.5+, Chrome 和 Safari 4+ 以及其他现代浏览器**中都能生效。

## 检测高对比模式
Chris Blouch创建了一个高对比度模式检测器作为 *AXS可访问性Javascript类库* 中的一部分。如果你在高对比模式下看到网站出现问题, 这个检测器会很有用。可以查看一下网址了解信息:

* http://dev.aol.com/downloads/axs1.2/readme.html#hd

## 高可用性更多信息
下面这个视频提供了一个很好的解释: 面对低视力残疾人群对可访问性网站带来的挑战。截止至19:38（译者注: 指的是2010-04-20之前）介绍了一下Windows下的可访问性工具，像高对比模式这样子的（**以下视频需要翻墙**）：

<iframe width="420" height="315" src="//www.youtube.com/v/fw91hsVrf40&hl=en_US&fs=1&color1=0x5d1719&color2=0xcd311b&start=1178" frameborder="0" allowfullscreen></iframe>    

## 可打印的**Image Sprites**
一份文件指出背景图片默认不能打印出来, 但是&lt;img&gt; Sprites可以解决这个问题。下面是在Firefox下demo页面的打印预览, 作为展示: 

### **CSS Sprites 打印**

<img src="/images/imgspriteshighcontrast/css-sprite-print.png" alt="css-sprite-print" style="width: auto; height: auto;" />

### **&lt;img&gt; Sprites 打印**

<img src="/images/imgspriteshighcontrast/img-sprite-print.png" alt="img-sprite-print" style="width: auto; height: auto;" />

## 总结
这篇文章是我在搜索&lt;img&gt; Sprites的时候找到的, 虽然讲的是在高对比模式下实现可访问性, 但依然给了我很多启发, 和Css Sprites一样, 同样可以减少请求。可以在以下情况使用：

* 展示许多图片
* 为了可访问性, 使用img标签, 不使用背景图片
* 兼容较多的浏览器（Icon Font支持度比较低）

[这里]: http://www.artzstudio.com/2010/04/img-sprites-high-contrast/
[这篇]: http://www.artzstudio.com/2010/04/img-sprites-high-contrast/
[CSS image sprites]: http://www.alistapart.com/articles/sprites
[减少HTTP请求]: http://www.websiteoptimization.com/speed/tweak/css-sprites/
[块级元素]: http://en.wikipedia.org/wiki/HTML_element#Block_elements
[行级元素]: http://en.wikipedia.org/wiki/HTML_element#Inline_elements