---
layout: post
title: 构建工具系列二--Grunt
description: <strong>摘要:</strong> 最近在做Toki项目时遇到一个苦逼问题, 就是每次调试的时候需要将Javascript和css同时压缩(因为发布的成品代码是经过压缩的)。寻寻觅觅, 终于让我找到一款前端构建神器--Grunt。Grunt是什么呢？Grunt实际上是一个Javascript任务运行框架......<a href="/frontend-scaffold-grunt/" title="阅读全文">阅读全文</a>
tags: 前端开发
excerpt: node.js grunt
---
## 概述
最近在做[Toki][]项目时遇到一个苦逼问题, 就是每次调试的时候需要将Javascript和css同时压缩(因为发布的成品代码是经过压缩的)。寻寻觅觅, 终于让我找到一款前端构建神器--[Grunt][]。Grunt是什么呢？ 正如官网定义的:

>GRUNT    
>The JavaScript Task Runner

也就是说, Grunt实际上是一个Javascript任务运行框架, 本身并不包括具体任务的实现逻辑。要使用Grunt, 首先需要根据执行的具体任务选择插件, 并通过配置文件指定如何构建项目。以后只要执行配置文件, Grunt就会自动构建项目。所以我更愿意称Grunt为功能强大的前端脚手架。

插播一下, 这里介绍一个持续构建的工具Travis-cli, 感兴趣的可以点[这里](/continuous-integration-tool-travis-cli/)。

## Hello World
好了, 介绍了那么多, 接下来就是如何使用了。每种工具(或语言)第一个讲的就是[Hello World][]程序, 程序需要用到Grunt以及[Grunt.log][]插件, 下面就来具体介绍:

###   Grunt安装
Grunt本身是基于[node.js][]开发的应用, 那第一步当然就是安装node.js这个神器啦o(╯□╰)o!! 根据不同的平台选择各自的安装包安装(node.js的具体安装不在本文的讨论范围内)。

完成了第一步之后, 接下来就是安装Grunt了, Grunt需要先安装CLI(Grunt's command line interface)工具, 控制台下使用**npm**命令完成安装: ```npm install -g grunt-cli ```, 接下来安装Grunt模块: ```npm install grunt -g --save-dev```。

如果你不跑任何任务的话, Grunt到这里就已经安装成功了, 你也可以出去找找妹纸逛逛街了(额, 暴露了我的性别, 女生表介意哈)。但是问题来了, Grunt是一个任务运行工具, 任务不存在又如何称得上Task Runner呢？

###  Gruntfile文件
好了, 废话说了那么多, 接下来就讲如何配置Gruntfile文件。首先新建目录```GruntFirst```(名字自定), 在GruntFirst新建Gruntfile.js文件, 这个是Grunt必须的配置文件, 在文件中写入:

	/**
	 *  Gruntfile.js 固定写法
	 *  module.exports = function(grunt){
	 *      ××××;
	 *  }
	 */
	module.exports = function(grunt){
		'use strict';
		
	    grunt.registerTask('default', function(){
			grunt.log.writeln('Hello world');
		});
	};

然后在当前目录打开终端, 输入```grunt defult```, 如果看到以下输出, 恭喜您已经进入了Grunt的世界!!

![Git Bash](/images/gruntjs/helloworld.png)

## 问题解决
还记得本文开始的时候提到的问题吗？如果忘记了的话证明您木有认真阅读本文, 果断回去重新看一遍! 好了, 下面就是问题的解决方法, 采用Grunt自动构建并且监控文件变化:

	module.exports = function(grunt) {
	    'use strict';
	    // project config
	    grunt.initConfig({
	        pkg: grunt.file.readJSON('package.json'),    // load package.json file
	        cssmin: {
	            options: {
	                'keepSpecialComments': 0
	            },
	            combine: {
	                files: {
	                    'build/css/style.css': [
	                        'css/*.css'
	                    ]
	                }
	            }
	        },
	        jshint: {
	            options: {
	                jshintrc: '.jshintrc'
	            },

	            files: ['Gruntfile.js', 'javascript/*.js', 'node_modules/*.js', '!javascript/jquery-2.1.0.min.js']
	        },
	        uglify: {
	            options: {
	                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
	            },
	            dist: {
	                files: [{
	                    cwd: 'javascript',
	                    src: '**/*.js',                 // source files mask
	                    dest: 'build/javascript',       // destination folder
	                    expand: true,                   // allow dynamic building
	                    flatten: true                   // remove all unnecessary nesting
	                    /*ext: '.min.js'                // replace .js to .min.js*/
	                }]
	            }
	        },

	        htmlhint: {
	            options: {
	                htmlhintrc: '.htmlhintrc'
	            },
	            src: ['*.html']
	        },

	        watch: {
	            css: {
	                files: ['css/**/*.css'],
	                tasks: ['cssmin']
	            },
	            js: {
	                files: ['<%= jshint.files %>'],
	                tasks: ['jshint']
	            },
	            uglify: {
	                files: ['javascript/**/*.js'],
	                tasks: ['uglify']
	            },

	            htmlhint: {
	                files: ['*.html'],
	                tasks: ['htmlhint']
	            }
	        }
	    });
	    // load Grunt plug-in
	    grunt.loadNpmTasks('grunt-contrib-cssmin');
	    grunt.loadNpmTasks('grunt-contrib-watch');
	    grunt.loadNpmTasks('grunt-contrib-jshint');
	    grunt.loadNpmTasks('grunt-contrib-uglify');
	    grunt.loadNpmTasks('grunt-htmlhint');
	    // register default task
	    grunt.registerTask('default', ['watch']);
	};

**Note:** [grunt-contrib-cssmin][], [grunt-contrib-watch][], [grunt-contrib-jshint][], [grunt-contrib-uglify][], [grunt-htmlhint][]插件的功能分别是: **css压缩, 文件监控(ps: 文件变化时自动执行), javascript检验, javascript压缩, html检查**。Grunt的第三方插件很多, 而且还在不停增加。其他插件以及具体用法就要您根据需求的需要自己去配置了。

对上面的配置有什么不懂的, 可以查看各个插件的具体配置信息和[官方文档](http://gruntjs.com/getting-started)

## 总结
Grunt是新兴的项目任务运行工具, 可以帮助我们更快更好的构建和测试项目。

[Toki]: https://github.com/JackieLin/Toki
[Grunt]: http://gruntjs.com/
[Hello World]: http://en.wikipedia.org/wiki/Hello_world_program
[Grunt.log]: http://gruntjs.com/api/grunt.log
[node.js]: http://nodejs.org/
[这里]: https://www.npmjs.org/doc/json.html
[grunt-contrib-cssmin]: https://github.com/gruntjs/grunt-contrib-cssmin
[grunt-contrib-watch]: https://github.com/gruntjs/grunt-contrib-watch
[grunt-contrib-jshint]: https://github.com/gruntjs/grunt-contrib-jshint
[grunt-contrib-uglify]: https://github.com/gruntjs/grunt-contrib-uglify
[grunt-htmlhint]: https://github.com/yaniswang/grunt-htmlhint