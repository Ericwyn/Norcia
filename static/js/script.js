/**
 * 简化写法
 * @param domId document id 参数
 */
function domId(domId) {
    return document.getElementById(domId)
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
        `<div class="mdui-card mdui-typo mdui-m-t-2 mdui-m-b-2 mdui-hoverable index-blog-card gradient-wrapper">
        <div class="mdui-card-primary">
            <div class="mdui-card-primary-title ">
                <a href="blog/${article.link}.html" target="_blank">${article.title}</a>
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
            colorClass = colors[(ran+i)%colors.length];
        }
        tagHtml +=
            `<div class="mdui-chip ${colorClass} mdui-m-x-1 none-text-transform mdui-text-color-white blog-tag" onclick="gotoTagPage('${temp[i]}')">
                <span class="mdui-chip-title">${temp[i]}</span>
            </div>`
    }
    return tagHtml;
}

//绑定归档页面和 tags 页面的卡片
function bindArchiveArticle(article){
    return `<div class="mdui-col-xs-12 mdui-col-md-6 mdui-col-sm-12 mdui-m-t-1 gradient-wrapper mdui-p-b-1">
            <div class="mdui-card mdui-typo">
                <div class="mdui-p-x-2">
                    <h4 class="mdui-typo">
                        <a href="/blog/${article.link}.html">${article.title}</a>
                    </h4>
                    <div class="mdui-card-primary-subtitle">${article.create}</div>
                </div>
                <div class="mdui-card-actions mdui-m-b-2">
                    ${bindArticleTags(article.tag,true)}
                </div>
            </div>
        </div>`
}

function getRandom(begin,end){
    return Math.floor(Math.random()*(end-begin + 1)) + begin;
}

function gotoSearch() {
    window.location.href = "search.html"
}

function loadTagsArticles(tagName) {
    domId("articles").innerHTML = "";
    norciaConfig.articles.forEach(function (article, index, array) {
        if (article.tag.indexOf(tagName)!==-1){
            domId("articles").innerHTML += bindArchiveArticle(article)
        }
    });
}

function gotoTagPage(tagName) {
    loadTagsArticles(tagName);
    window.location.href = "tags.html#" + tagName;
}

function showShareCode() {
    mdui.dialog({
        title: '',
        content: `<img class="mdui-center mdui-m-t-2" src = ${jrQrcode.getQrBase64(window.location.href)} style="height:150px;width:150px" >
                        <div class="mdui-text-center mdui-m-t-2">扫一扫二维码即可分享</div>`,
        buttons: [
            {
                text: '取消'
            }
        ]
    });
}

function showFeedFoodQR() {
    mdui.dialog({
        title: '',
        content: domId("feedFoodQE").innerHTML,
    });
}

//提醒用户更新浏览器
let $buoop = {required:{e:-4,f:-3,o:-3,s:-1,c:-3},insecure:true,style:"corner",api:2018.07 };
function $buo_f(){
    let e = document.createElement("script");
    e.src = "//browser-update.org/update.min.js";
    document.body.appendChild(e);
}

try {document.addEventListener("DOMContentLoaded", $buo_f,false)}
catch(e){window.attachEvent("onload", $buo_f)}

// 访问量
document.getElementById("visitCount").onclick = function () {
    let styleCount = document.getElementById("visitCount").style.opacity;
    if (styleCount < 1) {
        styleCount = parseFloat(styleCount) + 0.25;
    }
    document.getElementById("visitCount").style.opacity = styleCount
};