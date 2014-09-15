---
layout: post
title: 元素垂直居中的各种实现方式
description: <strong>摘要:</strong><br /> <a href="#"><img src="/images/elementvg/main.png" alt="main.png"></a><p>本文的主要内容是介绍各种垂直居中对齐的实现方法，介绍各种实现方法的优缺点。希望本文介绍的方法能够对您的学习有所启发......</p><a href="/element-vertical-align" title="阅读全文">阅读全文</a>
tags: 前端开发
excerpt: css,vertical-align
---

## 一点感悟
曾子曰:"吾日三省吾身", 意思就是说每天要多次想一想自己到底干了什么 O(∩_∩)O~。好吧，这个其实大家都知道，那为什么还要在这里扯呢？很简单，就是知道的人很多，但做到的人很少。结合自己的工作经验，谈谈前端开发的一些认识误区：

* 只知其然，不知其所以然；
* 解决过的问题，下次同样还是忘记，要查找相关的资料；
* google，百度一个方法，实现了就可以了；

这些认识的误区，我相信很多人（包括我自己）都会犯，原因是多种多样的：

* 项目有时候确实很急，我们没有时间来捣鼓这些东西；
* 哎，以后遇到再找资料好了，反正自己已经知道怎么查找关键字了；
* 我去，哥（姐）还要和女（男）盆友去逛街呢，没空搞这些细节；
* ......

总结原因，那就是对技术的<strong>专注度</strong>不够，没有热情往纵深的方向去挖掘。有人可能会反驳了: "擦，css就那些有限的的属性，感觉没什么好学的"（ps：自己以前就是报这种态度的，惭愧）。其实这是正确的吗？css其实是很精深的一门学问，别看只有一些属性，但属性的各种值，属性之间的搭配，属性之间的差异......，还有浏览器不同的表现，这些都了解清楚了吗？我们常常在感慨为什么别人会实现一些很好的效果出来，会提出很好的解决方案，其实就是因为他们对属性，属性值了解得很透彻，知道怎样的搭配能产生怎样的效果。所以，骚年们，如果想在前端有些进步，好好静下心来学习吧。<strong>专注，实践，学习，归纳</strong>

本文是css学习总结的开篇之作，也是我最近感悟的一些总结，希望对您有一些思考吧，废话什么的就不多说了。
	
**本文地址: [http://forkme.info/element-vertical-aligns/]()或者[http://www.cnblogs.com/blackmanba/p/element-vertical-align.html](http://www.cnblogs.com/blackmanba/p/3675558.html), 转载请注明源地址。**

## 开始
最近在捣鼓页面的时候遇到一个问题，如何实现文字与图片的垂直居中？如图：

<img src="/images/elementvg/main.png" alt="垂直居中" style="width: 40%;">

其实这个问题网上答案一大堆，很多同行也都有自己的各种解决方法，下面查找资料再经过自己实验总结的方法，会着重介绍优缺点。说了这么多，接下来就是展示最终的显示效果，如果不知道效果是什么的话，[请点击我思密达][]

## 1.  inline-height法
这种方法相信很多人都知道并且尝试过，主要是利用inline元素（或者inline-block元素）的inline-box模型（ps：这个可以查看[@旭哥][]的文章[拜拜了,浮动布局-基于display:inline-block的列表布局][]，原理什么的旭哥都讲得很清楚了，这里就不要再瞎子点灯——多此一举了）, 只要设置inline-heigth的值和父元素的height一致即可让文字居中显示，样式如下：
	
	.inline {
		display: inline;
		*display: inine;
		zoom: 1;
	}
	.lg{
		font-size: 18px;
		font-weight: bold;
		line-height: 80px; /* 注意：line-height和容器的高度一致 */
	}

最终效果图上面已经截过，这里就不再搞多一张了，免得浪费亲们宝贵的时间。 O(∩_∩)O~，    
最终效果请[点击这里](http://forkme.info/demo/elementvg/test.html#inline-height)查看,    
源代码在可以在开发者工具中查看, 下同。

### 1.1 优点

* 简单，使用很少的样式就可以实现；
* 兼容性强，兼容IE6+, chrome和Firefox（opera没试过）

### 1.2 缺陷

* 只能用于单行文字，多行文字间距过大，[效果请点击](http://forkme.info/demo/elementvg/test.html#inline-height_mul)；
* 要知道父容器高度，如果不想定死高度的话只能通过javascript获取并设置，复杂度增大；
* line-height只能适用于inline和block级别的元素；

### 1.3 总结
line-height让文字垂直居中这个方法对于单行文字来说那是再好不过，不用理相邻元素是什么，图片啊，文字啊什么都妥妥的没影响。经过之前一段时间的使用，可以说效果不错。当然，如果您的需求是多行文字或者是做自适应布局的话，建议不要用这个方法，因为~~~~不适合。%>_<%


## 2. 采用absolute+margin:auto
这个方法涉及到一个概念，就是margin属性的属性的定位问题，绝对定位的元素在填充的时候会根据自身的高度和margin值来决定最终位置。如果什么都木有设置，默认就是填充整个父容器，尺寸固定就会通过margin来决定最后的位置。概念什么的比较绕，我们可以[点击这里](http://forkme.info/demo/elementvg/test.html#absm)查看最终结果，css如下：
	
	.parent {
		position: relative;
	}
	.abs {
		    position: absolute;
		    top: 0;
		    bottom: 0;
		    right: 0;
		    left: 0;
		    margin: auto;
		    height: 20%;
	}

### 2.1 优点

* 简单
* 文字多的话，兄弟元素也能对应居中，不管兄弟元素是什么，效果[请点击](http://forkme.info/demo/elementvg/test.html#absm-mul)
* 适应性强，父容器不用限死高度

### 2.2 缺陷

* IE6,7 不兼容

### 2.3 总结
这个方法对于不用兼容IE6, 7的应用来说是十分高效并且实用的，在实际项目的使用中并不推荐这种用法，因为绝对定位脱离了文档流，会带来一些维护上的问题，并且也不利于重用。当然，这一切都是权衡，综合考虑开发和维护成本后，如果觉得合适，就可以采用。

## 3. 采用display: table-cell
这个方法使用到了table-cell来布局，其实table-cell，顾名思义就是单元格，设置了table-cell的元素其实和传统的td标签效果是一致的，最终效果请[点击这里](http://forkme.info/demo/elementvg/test.html#cell)，代码如下：

	.cell {
	    display: table-cell;
	    height: 80px;
	    vertical-align: middle;
	}

### 3.1 优点

* 简单，高效
* 适应性强

### 3.2 缺点

* IE6,7 不兼容（如果是图片居中可以使用font-size，文字不可以）
* 容器高度固定，设置overflow: hidden 会导致文字不显示
* 文字撑开兄弟元素不居中，[效果](http://forkme.info/demo/elementvg/test.html#cell-mul)

### 3.3 总结
使用table-cell的方式总体来说是不错的解决方案。当然，缺点也很明显，见上面。根据具体情况具体分析使用即可

# 4. 采用inline-block 方法
这个方法是目前为止我个人觉得最好的方法。原因很简单：简单易懂，容易上手，兼容性强。此方法本质上是利用了inline-block的垂直居中对齐特性。废话不多说，[请点击我](http://forkme.info/demo/elementvg/test.html#inlineblock)。不想看效果的童鞋可以直接看代码，如下
	
	.inline-block {
		    display: inline-block;
		    *display: inline;
		    zoom: 1;
		    vertical-align: middle;
	}

### 4.1 一点小结
此方法没有什么好说的，无论是兼容性还是其他特性都能完美呈现，并且不必知道文字高度，对于高度超过图片的文字也能够完美适应。真要说不好也就是先要理解inline box模型（ps：⊙﹏⊙b汗，有硬想缺点的嫌疑）。

## 5. 采用button 方法
这个方法是无意中看到的，其实原理很简单，但很有创意。那就是利用控件的特有属性。button标签就是这样的一个例子，因为其特性，我们就可以利用它来实现对应的效果了。[请点击我](http://forkme.info/demo/elementvg/test.html#button)。代码如下：

	<button>
		<a href="#" class="inline-block w60p verticalmiddle" style="text-align: left;">盛松成：中国信贷结构继续改善</a>

		<img src="http://jsfiddle.qiniudn.com/news3.png" alt="news" class="fn nomargin verticalmiddle">
	</button>

### 5.1 优点

* 利用button本身的属性，简单明了，甚至可以不用写css
* 扩展性好，能根据文字高度自适应

### 5.2 缺点

* 典型的为了效果使用标签，可维护性低
* 不满足标签的语义化，对搜索引擎不友好

## 结语
本文算作是自己前端开发的一个开端，主要是对自己知道的方法的总结和思考，并写成文章方便自己以后查阅。希望对您的学习有所帮助。随时欢迎交流意见，请在下方评论，多多益善!!

[请点击我思密达]: http://forkme.info/demo/elementvg/test.html
[@旭哥]: http://www.zhangxinxu.com/wordpress/
[拜拜了,浮动布局-基于display:inline-block的列表布局]: http://www.zhangxinxu.com/wordpress/2010/11/%E6%8B%9C%E6%8B%9C%E4%BA%86%E6%B5%AE%E5%8A%A8%E5%B8%83%E5%B1%80-%E5%9F%BA%E4%BA%8Edisplayinline-block%E7%9A%84%E5%88%97%E8%A1%A8%E5%B8%83%E5%B1%80/