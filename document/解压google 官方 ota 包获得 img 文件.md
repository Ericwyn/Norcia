## 前言
下载了一个 Pixel2 的官方 ota 包, 但是却不知道怎么解压出 system.img 那一堆东西, 搜了一下发现 github 上面已经有了这样的工具了, 但是却是用 python 写的, 用起来有点麻烦, 记录一下

https://github.com/cyxx/extract_android_ota_payload

## git clone
下载两个文件
 
 - extract_android_ota_payload.py
 - update_metadata_pb2.py

## 添加依赖
    pip install protobuf

注意: 如果提示 pip 不存在的话, ubuntu 直接先安装 pip 就行了

    sudo apt install python-pip

## 解压

    python extract_android_ota_payload.py walleye-ota-pq2a.190205.002-f8793f98.zip tmp/
    
这样就可以了

py 用起来还是有点麻烦, 必须先安装环境, 或者什么时候考虑用 go 写一个解压软件吧