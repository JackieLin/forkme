---
layout: post
title: Windows平台下如何使用node.js显示系统盘符
description:	<strong>node.js</strong>上大部分API说明使用的例子都是基于Linux或者Mac os系统, 对Windows系统叙述比较少(当然, 因为node.js兼容所有平台, 所以这一点其实也无伤大雅)。但是, 如果应用涉及到调用系统命令行来完成一些功能, 兼容Windows就会是比较痛苦的一件事了, 最近就遇到了一个问题, 在Windows平台上怎么显示系统盘符呢？这个问题如果在Linux系统和Mac os 系统下是很容易解决的, 直接使用node.js调用cd / | ls -al命令显示就可以了, 但是在Windows平台上这个问题讨论得就比较少了。下面就来说说这个问题在Windows平台下的解决方式......<a href="/windows-nodejs-show-system-letter" title="阅读全文">阅读全文</a>
tags:	前端开发
excerpt:	node.js windows盘符
---
## 1. 概述

[node.js][]上大部分的API说明使用的例子都是基于Linux或者Mac os系统, 对Windows系统叙述比较少(当然, 因为node.js兼容所有平台, 所以这一点其实也无伤大雅)。但是, 如果应用涉及到调用系统命令行来完成一些功能, 兼容Windows就会是比较痛苦的一件事了, 最近就遇到了这么一个问题, 在Windows平台上怎么显示系统盘符呢？这个问题如果在Linux系统和Mac os 系统下是很容易解决的, 直接使用node.js调用```cd / | ls -al```命令显示就可以了, 但是在Windows平台上这个问题讨论得就比较少了。下面就来说说这个问题在Windows平台下的解决方式。

## 2. 策略
### 2.1. 思路
解决Windows下用node.js显示系统盘符这个问题的方法其实和在Linux和Mac os下显示根目录文件的方法是一致的。那就是使用node.js直接调用系统命令, 不同的只是不同平台之间命令不一致罢了。node.js已经为我们提供了调用系统命令的API, 那就是[**child_process**][]模块。

### 2.2. Windows平台命令
那么, Windows平台使用什么命令来显示系统盘符呢？答案是使用[wmic][]命令。为了显示系统盘符, 我们采用以下命令:
	
	wmic logicaldisk get caption

输出情况如下:

![Git Bash](/images/windowsletter/wmic.png)

## 3. 实现
以下是使用node.js显示Windows平台下盘符的代码:

	var exec = require('child_process').exec;

	// show  Windows letter
	function showLetter(callback) {
		exec('wmic logicaldisk get caption', function(err, stdout, stderr) {
	        if(err || stderr) {
	            console.log("root path open failed" + err + stderr);
	            return;
	        }
	        callback(stdout);
    	}
	}
	/**
	 *  output:
	 *  Caption
	 *  C:
	 *  D:
	 *  E:
	 *  F:
	 *  G:
	 **/

如果你使用的Windows 7系统, 恭喜你, 代码已经能够正确运行并输出你所想要的结果。但如果你使用的是Windows xp系统, 那么就会发现一个问题, 那就是代码没有产生任何输出, 并且也没有报任何错误。o(╯□╰)o

## 4. Windows xp兼容问题
其实这个问题出现的主要原因就是因为**wmic**命令事实上是一个交互式命令, 在Windows xp下其实也能正确的执行并产生对应的输出, 不同的是在Windows xp下命令行还在等待与用户的交互, 所以没有产生任何输出。也就是说我们其实还需要自己输入```ctrl+c```命令来结束这个命令。

这种解决方法最大的缺点就是我们必须自己通过键盘输入来停止与命令的交互。那有没有不用让用户进行直接操控, 执行完命令就自动退出的方法呢？答案是有的。那就是使用node.js exec方法返回的[Child Process][]对象, 调用**end**方法停止与用户的交互, 同时监听对象的close事件来处理返回的信息。示例代码如下:

	var exec = require('child_process').exec;
 
	// show  Windows letter, to compatible Windows xp
 
	function showLetter(callback) {
	    var wmicResult;
	    var command = exec('wmic logicaldisk get caption', function(err, stdout, stderr) {
	        if(err || stderr) {
	            console.log("root path open failed" + err + stderr);
	            return;
	        }
	        wmicResult = stdout;
	    });
	    command.stdin.end();   // stop the input pipe, in order to run in windows xp
	    command.on('close', function(code) {
	        console.log("wmic close:: code:" + code);
	        var data = wmicResult.split('\n'), result = {};
	        callback(result);
	    });
	}
	 
	/**
	 *  output:
	 *  Caption
	 *  C:
	 *  D:
	 *  E:
	 *  F:
	 *  G:
	 **/

## 5. 总结
本文通过使用Windows系统下的wmic命令解决显示系统盘符这个问题, 并且同时解决了Windows xp下的兼容性问题。

[node.js]: http://nodejs.org/
[**child_process**]: http://nodejs.org/api/child_process.html
[wmic]: https://en.wikipedia.org/wiki/Windows_Management_Instrumentation_Command-line
[Child Process]: http://nodejs.org/api/child_process.html#child_process_child_process