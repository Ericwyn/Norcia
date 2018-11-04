## 前言
入坑 Android Framework ，所以先尝试着自己编译一个 ROM，因为手上有的设备是 Nexus 5X ，没有开发板，所以就先拿着可怜的小5X 来测试吧

照着 [为nexus 5x编译android n固件
](https://blog.csdn.net/w_xue/article/details/77418011) 里面的教程一步步的做，先在 tuna 下载 AOSP 源码，然后又去官网下载驱动

然后用 `make -j4` 编译，以下是自己遇到的大坑

## 趟坑记录
### JDK 版本问题
Android 8.1 要求编译时候使用 OpenJDK，虽然我的电脑上面是装了 OpenJDK 和 Oracle JDK，但是一直用的都是 Oracle JDK，一开始使用
        
        sudo update-alternatives --config java

切换版本，但是却不起作用，就觉得的很奇怪，我用的用户 `ericwyn` 下面，JDK 是  Oracle的，而切换到了 `sudo` 之后，JDK 就是 `OpenJDK` 了，懒得折腾然后直接用 `sudo make -j4` 来运行（然而这样是错的，这里又挖了一个坑，后面会提到），最后还是修改了 ~/.bashrc 环境变量文件来设置 OpenJDK，而后再使用 `make -j4` 编译

### jack-server 问题
 - sudo 下没有 jack-server
 
    上面提到的，一开始我因为JDK 版本的问题，使用 sudo 来编译，然而却发现找不到 `jack-server`。
    
    起初我就只是一直在命令行 `jack-admin start-server` 来测试而已，结果发现没问题啊，但是后面才醒悟，用 sudo 编译的话，也要 `sudo jack-admin start-server`，然后才发现问题所在，sudo 下面并没有 jack-admin ...
    
    解决的方法就是上面，配置普通用户的环境变量，使用 OpenJDK 在普通用户下编译


 - Jack server failed to (re)start
    
    jack server 无法启动，很奇怪的错误，
    
    - 我先是 rm 了 `/home/ericwyn/.jack-server` 文件夹
    
    - 然后 `jack-admin install-server` 重新安装 server
    
    - 尝试 `jack-admin start-server` 启动，`ps` 查看进程之后发现 jack-server 已经启动了，然后尝试重新编译

### Ubuntu 18.04 下编译输出  `lexer.cpp` 失败
提示 

    FAILED: out/target/product/gordon_peak_xen/obj/STATIC_LIBRARIES/libedify_intermediates/lexer.cpp

在 [Ubuntu18.04编译问题](http://rangerzhou.top/2018/08/29/Ubuntu18.04%E7%BC%96%E8%AF%91%E9%97%AE%E9%A2%98/) 中看到解决方案

解决方法是
 - 把 `export LC_ALL=C` 这行代码添加到 bashrc 文件中，`LC_ALL=C` 是为了去除所有本地化的设置，让命令能正确执行

## 等待编译

我个人觉得，如果编译的话如果能够跑完前面的 10% ，那么一般后面的 90% 应该也不会有问题了。

关于编译时间，我的电脑是 Thinkpad T450 ，配置 I5-5300U，系统是 Ubuntu 18.04 ，用 `make -j4` 使用四个核心来编译，一共是用了 `04:58:01`，我的 CPU 一直满载了 5 个小时啊天.... 

    #### build completed successfully (04:58:01 (hh:mm:ss)) ####

无比羡慕那些一个小时就能跑完的 dalao

编译过程中一般会有很多 warning，无视就好了

## 刷入 Image 

先设定输出目录，就是你的 IMG 编译好的地方
    
    export ANDROID_PRODUCT_OUT=/your/path/to/img
 
找到编译输出的  fastboot 的所在，然后进入到所在的文件夹
 
    whitch fastboot
 
先切换到 su（避免权限问题）， 用这里的 fastboot 的 devices 命令找到连接的设备
 
    ./fastboot devices      
    // 输入如下 
    00c996d81da7a82f	fastboot
 
然后开始刷机
    
    ./fastboot -w flashall 

刷机的过程一般很快的，刷完之后会自动重启，然后就可以看到清水出芙蓉的 AOSP 了

另外如果出现像 `error: neither -p product specified nor ANDROID_PRODUCT_OUT set` 的错误提示的话，是因为你没有设置 `ANDROID_PRODUCT_OUT`，使用下面的命令设置就好了

    export ANDROID_PRODUCT_OUT={你输出的文件夹，例如 out/target/product/bullhead}
    

### 后续
吐槽一下，我电脑只有两个固态，加起来不过600 g 的空间...对于编译 AOSP 来说确实不太够呜呜呜，以后一定要买个 1T 的固态口亨

另外用 Thinkpad T 系列这么久，是在编译 AOSP 的时候，才第一次深刻发觉，CPU 真的是不太够用啊，我这样一边编译，一边写博文，居然是已经卡到不能自拔了...