/**
 * 简化写法
 * @param domId document id 参数
 */
function domId(domId) {
    return document.getElementById(domId)
}

/**
 * 获取url中的参数
 */
function getUrlParam(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    let r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return decodeURI(r[2]);
    return null; //返回参数值
}

/**
 * 将 Article 对象数据库数据与 index 页面卡片试图绑定
 * @param article
 * @returns {string}
 */
function bindIndexArticleCard(article) {
    let tags = article.tag;
    let tagHtml = bindArticleTags(tags,true);
    let head =
        `<div class="mdui-card mdui-typo mdui-m-t-2 mdui-m-b-2 mdui-hoverable">
        <div class="mdui-card-primary">
            <div class="mdui-card-primary-title ">
                <a href="blog.html?title=${article.title}">${article.title}</a>
            </div>
            <div class="mdui-card-primary-subtitle">${article.create}</div>
        </div>
        <div class="mdui-card-content">
            ${article.mini} ......
        </div>
        <div class="mdui-card-actions mdui-m-t-2 mdui-m-b-2">
            ${tagHtml}
            <button class="mdui-btn mdui-btn-icon mdui-float-right"><i
                    class="mdui-icon material-icons">expand_more</i></button>
        </div>
    </div>`;

    return head;
}

/**
 * 传入文章的标签，返回绑定好的视图
 * 输入的数据如下
 *  tag1,tag2,tag3,
 *
 * @param randomColor 是否开启随机颜色
 * @param tags
 */
function bindArticleTags(tags,randomColor) {
    let temp = tags.split(",");
    let tagHtml = "";
    let colors = [
        "mdui-color-deep-orange-400",
        "mdui-color-teal-400",
        "mdui-color-red-400",
        "mdui-color-lime",
        "mdui-color-pink-400",
        "mdui-color-blue-grey-400"
    ];
    let colorClass = "mdui-color-theme-accent";
    let ran = getRandom(0,colors.length-1);
    for (let i=0;i<temp.length;i++){
        if (randomColor){
            colorClass = colors[(ran+i)%temp.length];
        }
        tagHtml += `<button class="mdui-btn mdui-ripple ${colorClass} mdui-text-color-white mdui-shadow-1 mdui-m-x-1">
                ${temp[i]}
            </button>`;
    }
    return tagHtml;
}

/**
 * 载入侧边导航栏
 * @param dom 载入的位置
 * @param close 是否默认关闭
 */
function loadNavigation(dom,close) {
    let closeClass = "";
    if (close){
        closeClass="mdui-drawer-close";
    }
    domId(dom).innerHTML +=
        `<div class="mdui-container mdui-appbar-with-toolbar">
            <div class="mdui-drawer	mdui-drawer-full-height mdui-color-white ${closeClass}" id="drawer">
                <div style="height: 30%;background: #3F51B5 url('img/brand.png');">
                    <img class="mdui-img-circle logo mdui-m-l-3 mdui-m-t-4" src="img/logo.jpg"/>
                    <div class="mdui-typo mdui-m-l-4">
                        <h4 class="mdui-text-color-white mdui-m-t-2 name-mail-line-height"><strong>Norcia
                            Blog</strong></h4>
                        <p class="mdui-text-color-white mdui-m-t-0 name-mail-line-height">test@test.com</p>
                    </div>
                </div>
                <ul class="mdui-list">
                    <br>
                    <li class="mdui-list-item mdui-ripple" onclick="" ocument.body.scrollTop=0;">
                        <i class="mdui-list-item-icon mdui-icon material-icons mdui-text-color-grey">&#xe88a;</i>
                        <div class="mdui-list-item-content" onclick="gotoIndex()">首页 Home</div>
                    </li>
                    
                    <br>
                    <li class="mdui-list-item mdui-ripple" onclick="">
                        <i class="mdui-list-item-icon mdui-icon material-icons mdui-text-color-grey">&#xe865;</i>
                        <div class="mdui-list-item-content">归档 Archives</div>
                    </li>
        
                    <br>
                    <li class="mdui-list-item mdui-ripple" onclick="">
                        <i class="mdui-list-item-icon mdui-icon material-icons mdui-text-color-grey">&#xe865;</i>
                        <div class="mdui-list-item-content">标签 Tag</div>
                    </li>
        
                    <br>
                    <li class="mdui-list-item mdui-ripple" onclick="">
                        <i class="mdui-list-item-icon mdui-icon material-icons mdui-text-color-grey">&#xe865;</i>
                        <div class="mdui-list-item-content">Github</div>
                    </li>
        
                    <br>
                    <li class="mdui-list-item mdui-ripple" onclick="">
                        <i class="mdui-list-item-icon mdui-icon material-icons mdui-text-color-grey">&#xe865;</i>
                        <div class="mdui-list-item-content">Weibo</div>
                    </li>
                </ul>
            </div>
        </div>
        `;
}

function getRandom(begin,end){
    return Math.floor(Math.random()*(end-begin + 1)) + begin;
}

function gotoIndex() {
    window.location.href="index.html";
}