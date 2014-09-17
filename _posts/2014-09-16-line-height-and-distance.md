---
layout: post
title: line-height与间距总总
description: <strong>摘要:</strong><br />本文讲了line-height属性对行内元素距离的影响分析，并说明了如何根据设计图进行行级元素的精确设计<a href="/linehheight-and-distance" title="阅读全文">阅读全文</a>
tags: 前端开发
excerpt: css,line-height
---

## 一点说明（个人吐槽，可以略过）
之所以想写这篇文章，是因为自己工作的经验总结。以前的页面编写极度不注重间距大小，特别是行级元素间距。认为只要差不多好就行了，没必要花那么大的精力去抠几px的小细节。事实证明这个想法大错特错，因为前期开发不注重这些细节，导致后期修改的时候被需求人员逼着一处一处的重新修改。<strong>不仅花费了大量的时间和精力（开发时间的好几倍，%>_<%），而且页面整得这里一块，那里一块，到最后我简直觉得就是个shit。</strong>虽然最后还是顺利上线，但完全是项目压力，以后还要花长时间彻底重构才行 ⊙﹏⊙b汗。前端工作任重而道远啊~~~~    

本文是根据自己最近思考实践总结出来的，主要是针对行级元素距离的分析，并说明如何做到行级元素的精确设计。（彩蛋：未来将会实践并总结出块级元素间距影响以及精确设计，敬请期待）    

**本文地址: [http://forkme.info/line-height-and-distance/]()或者[http://www.cnblogs.com/blackmanba/p/line-height-and-distance.html](http://www.cnblogs.com/blackmanba/p/line-height-and-distance.html), 转载请注明源地址。**

示例：
本文使用的例子是最近写的页面其中一部分（只涉及本文内容），截图如下：

![line-height 1](/images/lineheightdis/lh1.png)

例子比较简单，代码就不给出了，字体大小是13px，行高（line-height）为1，文字那一行没有margin，padding以及border值。（ps：排除影响因素）

## 1. 为何inline元素间的高度不一样
首先我们看到的最明显的就是文字和图片的高度不一样，文字间距是3px，而日历图片的高度间距是0，下图是ps下放大倍数的高度间距：

![height 3](/images/lineheightdis/h3.png)

产生这个问题的原因就是多个inline元素所产生的inline box。    
**简单来说，就是容器中每个行级元素都会产生一个inline box，而多个行级元素排成一行就会有多个inline box，即inline boxes。**    
举个例子：

	<p>行级元素1<span>行级元素2</span>行级<em>元素3</em></p>

以上HTML有4个inline box，解释如下：

* p元素是一个容器，包裹了整个行级元素
* 不带标签的文字也是一个隐藏的行级元素

根据上面的解释，得出结论，所有行级元素分别是 *行级元素1*、*<span\>行级元素2</span\>*、*行级*以及*<em\>元素3</em\>* 四个inline box，而每一行都会有一个line box，其实就是每一行所有inline boxes。其高度取的是最高的inline box的高度。    
**要注意一点：如果inline box宽度超出容器而发生折行，此时每一行都会产生新的inline box**    

根据以上原理可以解释图中现象：每一行中，文字和图片都是inline box，它们共同组成了一个line box，line box的高度取决于inline box中最高的元素，图片是18px高，而文字是13px，所以line box高度是18px，并且文字产生垂直间距。

## 2. line-height元素介绍
很多同行应该都知道line-height会影响行级元素的高度，并且可以实现一些效果，比如垂直居中，详情可以参考我的另一篇文章[元素垂直居中的各种实现方式][]。那么line-height的各种取值含义是什么？分别是怎样渲染的？下面一一道来：

line-height可取值：

* line-height: normal 
* line-height: 3.5    /\* <number\> values \*/
* line-height: 3px    /\* <length\> values \*/
* line-height: 34%    /\* <percentage\> values \*/
* line-height: inherit

说明如下：

* normal：浏览器默认值，一般是1.2
* 数值：根据具体的行级元素字体乘以数值计算得出
* 高度：直接规定多少像素
* 百分比：计算方式和数值一样，不同的是百分比值子元素也直接继承了父元素计算值
* inherit：继承父元素值

一般情况下，建议使用数值，其他的值比较少用，因为数值能根据每个行级元素本身的字体大小计算出来，灵活性很高。

## 3. line-height对高度的影响
line-height值是如何影响高度的呢？    
首先，让我们按照原来设定来构建一个新的测试用例：    

* line-height改为1.6

最终效如下：

![line height 1.6](/images/lineheightdis/lh1d6.png)

间距如下图：

![height 20](/images/lineheightdis/h20.png)

经过我的试验（目前只在firefox和chrome试验过，其他浏览器还没有测试），浏览器是这样渲染高度滴：

* line box值：font-size值*line-height值
* line box如果有小数，不管多大，全部舍弃（上面结果是13*1.6=20.8，结果是20）
* 文字上下间距：（line box - font-size）/2
* 如果不整除，上方间距小1px，下方间距大1px

## 4. line-height对line box背景图片影响
**结论：**背景图片大小是不会受line-height大小影响的，但是背景图片的高度取决于图片自身的高度和line box高度中的较大值，文字不仅会受到inline-height影响，同是也取决于自身高度和line box高度较大值。因为有上面的铺垫，得出这个结论比较简单。就不再举例说明了。

## 5. 进行精确的line box测量
这个其实是一个伪命题。怎么说呢？对于前端来说，同样的布局，效果可以用多种方式来实现，并没有固定的方式。这里主要是谈谈我的测量方法：

* 1. 查看文字的line-height值，根据font-size计算占据高度;
* 2. 测量同一行最高的inline box（非文字）高度;
* 3. 比较两者高度，两种情况:
* 4. 最高的inline box（非文字）比较高，采用其值，外面填上对应的其他间距即可;
* 5. 文字比较高，此时要算出文字上下占据的距离，最后将其他外间距和计算间距相减，得出距离;

## 结语
本文是根据自己最近实践总结出来的，主要是针对行级元素距离进行精确很细分析，并说明如何做到行级元素的精确设计。希望对您的学习有所帮助。随时欢迎交流意见，请在下方评论，多多益善!!

[元素垂直居中的各种实现方式]: http://forkme.info/element-vertical-align/