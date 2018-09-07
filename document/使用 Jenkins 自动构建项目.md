# 前言
公司项目开发到后期需要放到服务器上面去运行测试，但是不想每次都在本地编译成 jar 之后传到服务器再运行，于是使用 Jenkins 来完成这些步骤

## 安装 jenkins
    
    # 需要先安装 java
    apt install software-properties-common
    add-apt-repository ppa:webupd8team/java
    apt-get update
    apt-get install oracle-java8-installer
    
    # 安装 jenkins
    wget -q -O - https://jenkins-ci.org/debian/jenkins-ci.org.key | sudo apt-key add -
    sudo sh -c 'echo deb http://pkg.jenkins-ci.org/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
    sudo apt-get update
    sudo apt-get install jenkins

## 配置 jenkins
    
    vim /etc/default/jenkins 

修改里面的 http 端口

## caddy 反向代理
    
    jenkins.domain.com {
            proxy / localhost:8080 {
                    transparent
            }
    }

## 启动
    
    /etc/init.d/jenkins start
    # 或者 service jenkins start

## 配置

访问 `jenkins.domain.com` 完成配置，
一般直接选择默认配置就好了
一开始需要获取默认密码，使用
 
    cat /var/lib/jenkins/secrets/initialAdminPassword
    
可以获取

## 获取 API TOKEN
 - 面板右边的系统管理
 - 管理用户
 - 用户列表右边的图标
 - 拿到用户的 USER ID 和 API TOKEN
    
       User ID : root
       API TOKEN : 7d77089fq8f86906px5b5d707d13d

    ![](http://ww1.sinaimg.cn/large/ae1a7c45gy1fv11qft8ifj21h60r2af1.jpg)

## 安装`Hudson Post build task` 插件
因为我们要让项目在构建成功之后自动运行，所以要手动增加一个插件 `Hudson Post build task`

### 1 进入插件管理中心
![](http://ww1.sinaimg.cn/large/ae1a7c45gy1fv11zqqc7nj21h30qjjvv.jpg)

搜索到 `Hudson Post build task` 插件之后安装就好了

 
## 新建项目
### 1 新建
![](http://ww1.sinaimg.cn/large/ae1a7c45gy1fv11pse47cj21h80q5gqb.jpg)

一般选择第一个

### 2 配置 git 地址
![](http://ww1.sinaimg.cn/large/ae1a7c45gy1fv11tazoeqj214y0nymza.jpg)
填入 git 地址，如果有用户名和密码的话也要设置好

### 3 设置构建触发

![](https://ws1.sinaimg.cn/large/ae1a7c45gy1fv12u9agcoj215h0lrgnz.jpg)
这里要配置一个 TOKEN，后面要用到

### 4 配置构建脚本
![](http://ww1.sinaimg.cn/large/ae1a7c45gy1fv11vx8m5mj21590pndhv.jpg)

我的项目是 Spring Boot ，使用 mvn 命令就可以构建了，所以脚本内容如下

    echo $WORKSPACE
    echo $pwd
    mvn install -Dmaven.clean.failOnError=false -Djar.forceCreation -Dmaven.test.skip=true

### 5 设置构建好之后的运行脚本
由于我们已经安装了 `Hudson Post build task`，所以能够选择构建之后运行特定的 Shell 脚本

![](http://ww1.sinaimg.cn/large/ae1a7c45gy1fv122wpze4j21fl0r940t.jpg)

脚本内容如下

    #!/bin/bash 
    echo "停止之前运行的 jar"
    pid=`ps -ef | grep test-DEBUG-SNAPSHOT-exec | grep -v grep | awk '{print $2}'`
    if [ -n "$pid" ]
    then
    echo "kill -9 的pid:" $pid
    kill -9 $pid
    fi
    # 保持脚本运行
    BUILD_ID=dontKillMe
    
    # 将 jar 复制到运行文件夹
    cp /var/lib/jenkins/workspace/test/target/test-DEBUG-SNAPSHOT* /home/sboot/
    # 启动 jar
    java -jar /home/sboot/test-DEBUG-SNAPSHOT-exec.jar &

### 6 设置权限
起初我无法在构建之后运行脚本，一直提示权限不足，后面将 jenkins 设置为 ROOT 权限运行之后，就可以解决了，虽然会有不安全的因素
 
 设置步骤如下
 
    vim /etc/default/jenkins
    # 修改或者增加 JENKINS_USER="root"
    
    # 然后修改Jenkins home，webroot和日志的所有权
    chown -R root:root /var/lib/jenins
    chown -R root:root /var/cache/jenkins
    chown -R root:root /var/log/jenkins
    
    # 重启 jenkins
    service restart jenkins

## 设置 webhook
新建完项目之后我们就可以设置 WebHook 使得我们 push 了之后项目 jenkins 能够知道并有所动作

因为项目是放在 Gitee 上面的，所以这里就以 Gitee 作为示范

![](http://ww1.sinaimg.cn/large/ae1a7c45gy1fv12cl707ij20zb0prjv3.jpg)

地址的格式是

    https://{你的User ID}:{你的API TOKEN}@{你的服务器域名}/job/{jenkins上面的项目名称}/build?token={远程构建的触发认证TOKEN}

例如
    
    https://admin:7d77089fq8f86906px5b5d707d13d@jenkins.domains.com/job/Test/build?token=Build-TOKEN

填进去之后就可以测试了，如果 Webhook 无法生效的话，可能是 jenkins 设置了跨域访问限制，可以在

    系统管理 -> 全局安全配置 -> CSRF Protection
  
  设置，取消跨域访问限制
 
 后面的就是测试构建能够成功，以及根据输出来修改构建脚本或者运行脚本吧