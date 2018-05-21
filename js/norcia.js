function NorciaConfig() {
    let head;
    let introduce;
    let github;
    let weibo;
    let articles;
    //解析 json文件，传入一大堆回调函数，来规避 ajax 无法同步运行的问题
    this.load = function (callback) {
        ajax_get(
            "config.json",
            null,
            function (responseText) {
                let json = JSON.parse(responseText);
                this.head = json['head'];
                this.introduce = json['introduce'];
                this.github = json['github'];
                this.weibo = json['weibo'];
                this.articles = [];
                let articlesJson = json['articles'];
                for (let i = 0; i < articlesJson.length; i++) {
                    let articleTemp = new Article();
                    articleTemp.parseArticleJson(articlesJson[i]);
                    this.articles[i] = articleTemp;
                }
                callback(this);

            },
            function (status) {
                console.log(status);
            }
        );
    }
}

function Article() {
    let title;
    let tag;
    let create;
    let update;
    let mini;
    let content;
    this.parseArticleJson = function (json) {
        this.title = json.title;
        this.tag = json.tag;
        this.create = json.create;
        this.update = json.update;
        this.mini = json.mini;
    };
    this.loadContent = function (callback) {
        ajax_get(
            "document/"+this.title+".md",
            null,
            function (mkDocument) {
                callback(mkDocument)
            },
            function (status) {
                console.log(status);
            }
        );
    }
}

/**
 * 调用示例
 *
 *          ajax_get(
 *              login_API,                      // 接口地址
 *              [                               // 接口参数
 *                  ["n",mail],
 *                  ["p",pw],
 *              ],
 *              function (responseText) {
 *                  //请求成功的回调方法
 *              },
 *              function (status) {
 *                  //请求失败成功的回调方法
 *              }
 *          );
 *
 *
 * @param url 接口的 URL
 * @param params 参数
 * @param success_callback  成功的回调方法
 * @param fail_callback     失败的回调方法
 */
function ajax_get(url, params, success_callback, fail_callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    if (params !== null) {
        let sendParams = "";
        for (let i = 0; i < params.length; i++) {
            if (i === 0) {
                sendParams = sendParams + params[i][0] + "=" + params[i][1];
            } else {
                sendParams = sendParams + "&" + params[i][0] + "=" + params[i][1];
            }
        }
        console.log(sendParams);
        xhr.send(sendParams);
    } else {
        xhr.send();
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                success_callback(xhr.responseText)
            } else {
                fail_callback(xhr.status)
            }
        }
    }
}