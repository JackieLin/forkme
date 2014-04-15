---
layout: post
title: 解决Socket.IO在IE8下触发disconnect时间过长
description: <strong>摘要:</strong> Node.js是一个是一个构建在Chrome's JavaScript runtime上的应用程序。能够容易的建立起快速, 可扩展性的应用。Node.js采用事件驱动, 无阻塞I/O模型来保证其轻量性和有效性。对于Javascript语言来说, Node.js的出现具有相当重要的意义。它意味着Javascript不再是传统意义上只能用于前端开发的语言, Javascript同时也能用于WEB后端程序的开发。Node.js相当于一座桥梁, 通过它可以打通前端与后端开发, 现在通过使用Javascript就能实现功能完备的网站。在实现聊天应用是发现一个问题:<br /><strong>在IE8浏览器下聊天窗口关闭一分钟时才触发服务端的disconnect事件。这让聊天应用的实时性大打折扣。</strong><a href="/solve-socketIO-IE8-emit-disconnect-too-long" title="阅读全文">阅读全文</a>
tags: 后台开发
excerpt: IE8,Node.js
---

##概述
[Node.js](http://nodejs.org/)是一个是一个构建在[Chrome's JavaScript runtime](https://code.google.com/p/v8/)上的应用程序。能够容易的建立起快速, 可扩展性的应用。Node.js采用事件驱动, 无阻塞I/O模型来保证其轻量性和有效性。对于Javascript语言来说, Node.js的出现具有相当重要的意义。它意味着Javascript不再是传统意义上只能用于前端开发的语言, Javascript同时也能用于WEB后端程序的开发。Node.js相当于一座桥梁, 通过它可以打通前端与后端开发, 现在通过使用Javascript就能实现功能完备的网站。

在使用Node.js开发聊天模块的过程中, 采用[Socket.IO][]实现聊天功能。Socket.IO是一个开源的库, 根据浏览器的兼容性不同采用不同的实现方式, 分别支持WebSocket, Adobe Flash Socket, AJAX long polling, AJAX multipart streaming, Forever Iframe以及JSONP Polling这些API。Socket.IO能兼容大部分的浏览器, 这也是它的最大优势。在使用Socket.IO实现聊天模块的过程中发现一个问题: 在IE8浏览器下聊天窗口关闭一分钟时才触发服务端的disconnect事件。这让聊天应用的实时性大打折扣。

##原因
为什么IE8下会出现这个问题呢? 通过查询官方文档和日志输出, 发现是以下原因导致: IE8及以下浏览器不支持WebSocket协议, 在IE8浏览器中, Socket.IO是通过[xhr-polling][]来实现数据传输的。服务器一分钟才会向客服端发送请求来确认client端是否断开连接。如此一来就会导致触发服务器disconnect事件的时间过长, 导致实时应用较晚响应, 影响用户体验。

##解决方法
关于这个问题有以下三种不同的方法解决:

### 1. 使用flashsocket实现
这是最简单的一种实现方式, 通过使用flashsocket可以在用户关闭窗口时触发disconnect事件通知服务器进行相应的处理。以下是在Socket.IO服务器端的具体配置:

    io.set('transports', [
        'websocket',
        'flashsocket',
        'htmlfile',
        'xhr-polling',
        'jsonp-polling'
    ]);
    
使用这种方式的优点是实现简单。缺点如下:

* 苹果系统不支持Flash
* swf文件下载会有一定时间的延时。经过测试在IE8下加载时间大概是10s, 这会严重影响体验。

### 2. 配置Socket.IO通知时间
根据官方配置, Socket.IO默认是60s发送请求确认客服端是否断开连接。这是导致触发disconnect事件过慢的原因,可以将相关的时间缩短, 让服务端更快的发送请求。配置代码如下:

    io.configure('production', function() {
        io.set('heartbeat timeout', 2);
        io.set('heartbeat interval', 1);
        io.set('close timeout', 5);
        io.set('polling duration', 3);
    });

    io.configure('development', function() {
        io.set('heartbeat timeout', 2);
        io.set('heartbeat interval', 1);
        io.set('close timeout', 5);
        io.set('polling duration', 3);
    });
    
以上分别是生产环境和开发环境的配置, 各个参数的意义详见[官方配置][]。通过配置, IE8触发disconnect的时间变为5s, 在一定程度上增强了实时性, 缺点如下:

* 只是接近实时, 实际上还是要经过几秒的时间才会触发事件
* 服务端发送确认请求的次数增加, 会占用更多的带宽以及更多消耗服务器的性能

### 3. 调用disconnect方法主动通知服务端
以WEB在线聊天为例。通过监听浏览器的onBeforeunload事件, 在窗口关闭前发送请求通知服务器并调用disconnect()方法主动关闭连接。实现代码如下:

	// 使用jquery库监听浏览器的onBeforeunload事件
	$(window).bind('beforeunload', function (e) {

		// 通知浏览器关闭连接
		socket.disconnect();

		/**
		 *  如果用户选择不关闭浏览器, 就要进行Socket的重新连接
		 *  第一个setTimeout的作用是将第二个setTimeout放置于执行队列中, 接下来执行return
		 *  阻塞了第二个setTimeout执行。确认关闭窗口时, 浏览器关闭不会执行第二个setTimeout,
		 *  取消关闭, 第二个setTimeout将会在1s后执行
		 **/
		setTimeout(function () {
            setTimeout(function () {
                socket.socket.reconnect();
            }, 1000);
        }, 1);

		// 返回字符串, 让用户确认是否关闭页面
		return "是否关闭窗口";
	}	

这种方式的最大好处就是在IE8下可以做到"实时"通知服务端关闭连接, 只取决于网络的快慢。当然缺点是实现有些复杂。

##总结
新的协议如websocket的使用让开发变得更加简单。但在旧的浏览器上并没有这些新的协议。使用Socket.IO, 通过其内部的自动切换, 可以用同一套API兼容不同的浏览器。但不同底层实现方式的差别仍然存在。让低版本的浏览器兼容是我们在开发过程中必须考虑的问题。

[Socket.IO]:   http://socket.io/ "Socket.IO"
[xhr-polling]:    http://en.wikipedia.org/wiki/Comet_(programming) "Comet"
[官方配置]:    https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO "Configuring Socket.IO"
