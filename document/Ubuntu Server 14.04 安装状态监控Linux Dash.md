## 介绍
Linux Dash是一款非常简单的服务器监控程序，可以通过python、php以及LAMP部署运行，此次安装的环境是Ubuntu Server 14.04 LTS,使用Linux Dash的版本是github上面一个同学的2.0汉化版， Github地址是  
>linux-dash 的汉化版
>https://github.com/NoBey/linux-dash-zh 

## 安装Git和Python
    省略

## 通过Git安装Linux Dash
    git clone https://github.com/NoBey/linux-dash-zh.git

## 修改运行端口
    vim python-server.py
    
然后将默认运行端口改为7890(什么端口随意就好）

    parser.add_argument('--port', metavar='PORT', type=int, nargs='?', default=7890,
                    help='Port to run the server on.')

现在使用`./python-server.py`，就已经可以通过 http://localhost:7890 访问监控页面了
## 守护运行服务
让程序一直在后台运行

    nohup ./python-server.py &

## 加入安全验证
inux Dash默认没有任何验证，这样的话几乎任何人都可以查看你的服务器状态，我们需要通过nginx加上一层验证，首先我们要通过`htpasswd`来生成一个用户认证文件，Ubuntu 14.04下面，通过以下命令来安装

    sudo apt-get install apache2-utils

然后新建一个认证文件，使用`htpasswd -c [文件地址] [认证用户名]`命令来新建，例如

    htpasswd -c /usr/local/src/nginx/passwd coderschool

接着安装好nginx，在nginx文件夹下面的conf.d/文件夹下面，新建一个专用的配置文件monit.conf，因为我们需要将用户认证部署在nginx上面，配置如下

    server {
      listen       9870;
      server_name localhost;
      auth_basic "请输入用户名和密码";      #提示框的提示文字
      auth_basic_user_file /home/www/passwd;    #认证文件所在路径
      
      #重定向来自9870的流量到7890端口
      location / {
        proxy_pass http://localhost:7890;
      }
    }
    
## 最后的防火墙设置
使用ufw，禁用外部对于7890端口的访问，而允许对9870的访问，以后便可以通过9870端口，来查看Linux Dash的监控信息了 

## 效果
![验证](https://leanote.meetwhy.com/api/file/getImage?fileId=5943c5b64a0708064e00006e)

----------


![](https://leanote.meetwhy.com/api/file/getImage?fileId=5943c5b64a0708064e000070)

----------


![](https://leanote.meetwhy.com/api/file/getImage?fileId=5943c5b64a0708064e00006f)

----------


![](https://leanote.meetwhy.com/api/file/getImage?fileId=5943c5b64a0708064e000071)

## 参考
> - [linux-dash 的汉化版](https://github.com/NoBey/linux-dash-zh#安装)
> - [nginx 配置访问密码](http://coderschool.cn/2207.html)
> - [UFW 简单配置](https://linux.cn/article-2489-1.html)