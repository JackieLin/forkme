---
layout: post
title: 迁移oracle数据库至新分区 
description: <strong>摘要:</strong> 最近一段时间，随着数据的不停累积，之前的oracle数据库所在的硬盘已经不能容纳越来越多的数据以及日志信息。发生这种情况的原因是安装时对数据库的大小估算不够(⊙﹏⊙b汗)。既然出了这种问题就要想方法解决。最后的做法其实就是最简单的想法，将oracle数据库迁移到更大的硬盘就行了呗！确实如此。但所谓知易行难，真正实施起来的时候才发现迁移过程中出现了很多问题。以下文章就是记录我在迁移过程中遇到的各种问题以及解决办法。<a href="/move-oracle-database" title="阅读全文">阅读全文</a>
tags: 后台开发
excerpt: oracle
---
最近一段时间，随着数据的不停累积，之前的oracle数据库所在的硬盘已经不能容纳越来越多的数据以及日志信息。发生这种情况的原因是安装时对数据库的大小估算不够(⊙﹏⊙b汗)。既然出了这种问题就要想方法解决。最后的做法其实就是最简单的想法，将oracle数据库迁移到更大的硬盘就行了呗！确实如此。但所谓知易行难，真正实施起来的时候才发现迁移过程中出现了很多问题。以下文章就是记录我在迁移过程中遇到的各种问题以及解决办法。

## 原因
为什么要花这么多时间和精力来将之前的数据库迁移到别的硬盘呢？直接装一个不就行了吗？的确，重新安装oracle数据库到新硬盘确实能省去很多问题。但迁移数据库却有如下好处：

* oracle数据库的所有自定义配置能原封不动的保存
* 数据库完整转移，不用再重新做创建用户，分配权限等等的操作
* 日志完整保存，能最大限度的保留之前数据库的所有信息
* 不用对数据库的数据进行恢复

说了这么多，可能还是有人会说: "太麻烦了，迁移要做这么多东西，还不如重新来过"。这确实是个见仁见智的问题。但程序员不就是为了折腾吗？

## 迁移数据库
这是第一步，就是将oracle进程先停止再迁移到目标所在的硬盘上。我所用的版本是oracle 11g，不同的oracle版本出现的问题可能不一样，需要特别注意。启动停止oracle进程命令如下:

	sqlplus "/as sysdba"
	# 启动oracle数据库
	startup (normal/nomount/mount  #参数，具体的意义可以查看官方文档)
	# 停止数据库
	shutdown (normal/immediate/transactional/abort)
	exit

	# 查看监听状态
	lsnrctl status
	# 启动监听
	lsnrctl start
	# 关闭监听
	lsnrctl stop

关闭完oracle进程后，就可以将数据库所有文件都移动到新的硬盘去了。

## 启动数据库
移动完数据库后，首先要将之前系统的环境变量都设置为当前数据库所在的目录，如LD_LIBRARY_PATH，ORACLE_HOME，ORACLE_SID等，在此不一一列举。

### 1. 挂载启动文件
检验系统配置无误后就要启动数据库，采用上面的方法启动数据库，出现如下错误：
	
	SQL> startup
	ORA-01261: Parameter db_recovery_file_dest destination string cannot be translated
	ORA-01262: Stat failed on a file destination directory
	Linux-x86_64 Error: 2: No such file or directory

出现这个问题的原因是初始化文件中db_recovery_file_dest所指定的目录不存在，解决方法如下：

	复制数据库初始化文件init.ora.8172011185713至其他目录
	(文件所在目录:/opt/oracle/admin/orcldb/pfile/init.ora.8172011185713);

	重命名init.ora.8172011185713为init.ora
	
	以spfile方式加载启动数据库:
	SQL>startup mount pfile='$oracle_home/admin/orcldb/pfile/init.ora';
	
	打开数据库
	SQL>alter database open;
	
	创建数据库实例的spfile文件
	SQL>create spfile from pfile='$oracle_home/admin/orcldb/pfile/init.ora';
	
	重启数据库实例

如果你能按照上面的步骤执行成功，恭喜你下面的内容你可以不用看了。但我是执行到打开数据库这个步骤出错的。

### 2. 关闭flashback
在执行打开数据库操作时，出现以下错误：

	SQL> alter database open;
	alter database open
	*
	ERROR at line 1:
	ORA-38760: This database instance failed to turn on flashback database

这个错误的大意是数据库实例无法启用闪回数据库，google下发现解决方法如下：

	SQL>  select flashback_on from v$database;

	FLASHBACK_ON
	------------------
	YES

	SQL> alter database flashback off;

	Database altered.

	SQL> select flashback_on from v$database;

	FLASHBACK_ON
	------------------
	NO

### 3. 修改数据文件位置
解决上面出现的错误后重新执行，出现了另外一个错误：
	
	SQL> alter database open;
	alter database open
	*
	ERROR at line 1:
	ORA-01157: cannot identify/lock data file 1 - see DBWR trace file
	ORA-01110: data file 1: '/oracle/oradata/orcldb/system01.dbf'

这个错误的大意是无法对数据文件system01.dbf进行加锁，输出信息后发现是因为数据文件不存在。原因是数据文件被我们迁移至新的硬盘，并且目录改变。

	SQL> select name from v$datafile;
	
	NAME
	--------------------------------------------------------------------------------
	/oracle/oradata/orcldb/system01.dbf
	/oracle/oradata/orcldb/sysaux01.dbf
	/oracle/oradata/orcldb/undotbs01.dbf
	/oracle/oradata/orcldb/users01.dbf
	/oracle/oradata/orcldb/ctf_main.dbf
	/oracle/oradata/orcldb/ctf_weibo.dbf
	/oracle/oradata/orcldb/mall_189.dbf
	/oracle/oradata/orcldb/csip/csip_hr_idx_01.dbf
	/oracle/oradata/orcldb/csip/csip_gate_data_01.dbf
	/oracle/oradata/orcldb/csip/csip_arc08_idx_01.dbf
	/oracle/oradata/orcldb/csip/csip_sys_idx_01.dbf
	......

解决这个问题的方法如下：
	
	# 修改数据库物理文件到新的目录
	alter database rename file '$oracle_home/oradata/orcldb/system01.dbf' to '$oracle_home/oradata/orcldb/system01.dbf';

### 4. 修改重做日志目录
修改完数据库物理文件之后，执行之后出现另外一个错误，具体信息如下：
	
	SQL> alter database open;
	alter database open
	*
	ERROR at line 1:
	ORA-03113: end-of-file on communication channel
	Process ID: 28748
	Session ID: 192 Serial number: 5

这个问题貌似是一个比较常出现的oracle错误，网上有很多种解决方法。但我试过了之后都发现无法解决。google后发现解决问题的一种方法，那就是查看日志，具体操作如下：

	[oracle@edb bin]$ adrci

	ADRCI: Release 11.2.0.1.0 - Production on Mon Dec 23 10:46:30 2013

	Copyright (c) 1982, 2009, Oracle and/or its affiliates.  All rights reserved.

	ADR base = "/opt/oracle"
	adrci> show homes;
	ADR Homes: 
	diag/tnslsnr/edb/listener
	diag/rdbms/orcldb/orcl
	adrci> set home diag/rdbms/orcldb/orcl

	adrci> show alert -tail 100;

	2013-12-23 10:39:01.252000 +08:00
	alter database open
	Errors in file /opt/oracle/diag/rdbms/orcldb/orcl/trace/orcl_m000_28651.trc:
	ORA-00313: open failed for members of log group 1 of thread 1
	ORA-00312: online log 1 thread 1: '/oracle/oradata/orcldb/redo01.log'
	ORA-27037: unable to obtain file status
	Linux-x86_64 Error: 2: No such file or directory

这回发现问题了，那就是日志文件出错，查看了这个错误后发现是日志文件路径不对，修改日志文件路径命令如下：

	# 查询重做日志文件
	select * from v$log;
	# 移动日志到新目录
	alter database rename file '$oracle_home/oradata/orcldb/redo01.log' to '$oracle_home/oradata/orcldb/redo03.log';

### 5. 成功
修改完日志文件后，再执行第一步时的余下操作，成功启动数据库。接下来启动监听，访问也没有问题。oracle数据库迁移完成！！

## 总结
总的来说，这次迁移oracle数据库还是比较顺利的。并且也成功的让数据库重新启动成功。但这种方法只限于学习使用。通常情况下正式环境是不能这样子操作的，因为你要停止数据库那么久！正式环境的一般操作是使用lvm的方式为硬盘扩容。当然还有更好的方法我还不知道(欢迎补充)。而且刚开始在规划数据库硬盘容量时就应该考虑到各种情况，尽量保证数据库不超出硬盘存储范围。迁移数据库这种方法只是学习或者是实在没有别的方法时使用！

参考文章： <br />
<a href="http://blog.csdn.net/ghost241/article/details/6955817" target="_blank">http://blog.csdn.net/ghost241/article/details/6955817</a> <br />
<a href="http://dba.stackexchange.com/questions/49682/ora-03113-end-of-file-on-communication-channel-on-startup" target="_blank">http://dba.stackexchange.com/questions/49682/ora-03113-end-of-file-on-communication-channel-on-startup</a> <br />
<a href="http://database.51cto.com/art/201010/231946.htm" target="_blank">http://database.51cto.com/art/201010/231946.htm</a><br />
<a href="http://bbs.chinaunix.net/thread-3636279-1-1.html" target="_blank">http://bbs.chinaunix.net/thread-3636279-1-1.html</a><br />


