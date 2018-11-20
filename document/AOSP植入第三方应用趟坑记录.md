## 前言
之前成功的编译了 AOSP ，使用时候确实发现老旧的 Nexus5X 待机时间大大的提高了，然而 AOSP 实在是太过简陋了，还要自己下载各种常用的 APP，于是考虑能不能，直接植入一些自己常用 APP，免去刷机后重新下载的麻烦，于是找到 stackoverflow 上面的问题

> [How do I add APKs in an AOSP build?](https://stackoverflow.com/questions/10579827/how-do-i-add-apks-in-an-aosp-build)

于是就照着操作了

## 创建存储 apk 的文件夹
在 AOSP 根目录下，package/app/下面
创建一个文件，例如 `Chrome`
然后将 Chrome APK 移入到这个文件夹里面去

## 编写 Android.mk
根据stof给的 makefile 模板

    LOCAL_PATH := $(call my-dir)

    include $(CLEAR_VARS)
    
    LOCAL_MODULE_TAGS := optional
    
    LOCAL_MODULE := < 你的 app 的文件夹的名字 >
    
    LOCAL_CERTIFICATE := < desired key >
    
    LOCAL_SRC_FILES := < app 的 apk 文件名 >
    
    LOCAL_MODULE_CLASS := APPS
    
    LOCAL_MODULE_SUFFIX := $(COMMON_ANDROID_PACKAGE_SUFFIX)
    
    include $(BUILD_PREBUILT)

## 将文件夹添加到 core.mk
在【源码根目录/build/target/product/core.mk】文件添加刚才添加的项目文件夹名称
    
    PRODUCT_PACKAGES += \
        CloudMusic \     
        BasicDreams \
        BlockedNumberProvider \
        BookmarkProvider \
        Browser2 \
        BuiltInPrintService \
        Calendar \
        CalendarProvider \
        CaptivePortalLogin \
        CertInstaller \
        Contacts \
        DeskClock \
        DocumentsUI \
        DownloadProviderUi \
        Email \
        ExactCalculator \
        ExternalStorageProvider \
        ......

然后重新编译（然而这是会翻车的，请继续看下文）

## **desired key**
起初这个 desired key 我不太懂是什么意思，于是直接注释了，然后编译时候直接报错，于是又再学习了一下这个 desired key 

参考 [Android系统build阶段签名机制](https://maoao530.github.io/2017/01/31/android-build-sign/)

Android 系统在 buiild 的时候有 4 组的 key 用户对 build 阶段的 apk 签名，分别是

 - Media
 - Platform
 - Shared
 - Testkey

使用的签名，就由 Android.mk 这里的 `LOCAL_CERTIFICATE` 来限定的，其取值如下

    LOCAL_CERTIFICATE := testkey   # 普通APK，默认情况下使用。
    LOCAL_CERTIFICATE := platform  # 该APK完成一些系统的核心功能,这种方式编译出来的APK所在进程的UID为system
    LOCAL_CERTIFICATE := shared    # 该APK需要和home/contacts进程共享数据。
    LOCAL_CERTIFICATE := media     # 该APK是media/download系统中的一环

如果不指定，默认的话就是使用 testkey

而再往深入点说，实际上，这个 LOCAL_CERTIFICATE 和 Android 权限有关系，设置 LOCAL_CERTIFICATE 和 UID 来使得程序有特定的访问权限

参照
 > [mk中的android:sharedUserId和LOCAL_CERTIFICATE作用
](http://www.voidcn.com/article/p-vvguhunm-bhu.html)
 > [Android权限之sharedUserId和签名
](http://www.voidcn.com/article/p-svbbjtas-bhb.html)

一开始我用的 LOCAL_CERTIFICATE 是 Platform，后面又更改成 Media，两种情况下，网易云音乐都没法正常运行，会闪退，应用被安装为系统应用,最后哪怕换成了 testkey 也依然会闪退

然后怀疑是因为权限问题，安装成为系统应用导致无法运行，于是按照 [How do I add APKs in an AOSP build?](https://stackoverflow.com/questions/10579827/how-do-i-add-apks-in-an-aosp-build) 上面所以的，在最后添加一个 `LOCAL_MODULE_PATH := $(TARGET_OUT_DATA)`，使得配置文件变为

```
    LOCAL_PATH := $(call my-dir)
    include $(CLEAR_VARS)
    LOCAL_MODULE_TAGS := optional
    LOCAL_MODULE := CloudMusic
    LOCAL_CERTIFICATE := testkey
    LOCAL_SRC_FILES := CloudMusic.apk
    LOCAL_MODULE_CLASS := APPS
    LOCAL_MODULE_SUFFIX := $(COMMON_ANDROID_PACKAGE_SUFFIX)
    # install the APK in /data/app
    LOCAL_MODULE_PATH := $(TARGET_OUT_DATA)
    include $(BUILD_PREBUILT)
```

**然而还是翻车了，原因不明...**

## 改用其他的方法植入 APP
将上面的修改删除之后，从头开始

然后又搜索到了 [编译Android源码添加apk文件的三种方式](https://blog.csdn.net/tx422/article/details/77081050)
里面提供了三种方法

 - 修改 device\mstar\common\app\Android.mk
 - 修改 device\mstar\mstarcedric3\full_mstarcedric3.mk
 - 直接将 apk 文件放入到 out\target\product\mstarcedric3\system\app 当中

然而我在我的 AOSP 源码当中，并没有找到 common 文件夹...，所以只能直接尝试第三种方式

    