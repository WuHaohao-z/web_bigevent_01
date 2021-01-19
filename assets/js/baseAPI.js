// 开发环境:开发时用这个路径
var baseURL = 'http://api-breakingnews-web.itheima.net';
// 测试环境
// var baseURL = 'http://api-breakingnews-web.itheima.net';
// 生产环境
// var baseURL = 'http://api-breakingnews-web.itheima.net';


// 不需要入口函数
// 在发送ajax()get()post()方法之前会触发这个函数
$.ajaxPrefilter(function (options) {
    // options获取到ajax所有参数信息
    // alert(options.url);
    // 1.添加路径前缀
    options.url = baseURL + options.url;
    // alert(options.url);

    // 统一为有权限的接口，设置headers请求头
    // 如果options.url包含/my,那就拼接请求头
    // 2.给有权限的路径添加头信息
    if(options.url.indexOf('/my') !== -1){
        options.headers = {
            Authorization:localStorage.getItem("token") || ""
        }
    }

    // 登录拦截（不登陆，不允许访问其他页面）
    options.complete = function (res) {
        // console.log(res);
        var obj = res.responseJSON;
        if (obj.status === 1 && obj.message === "身份认证失败！") {
            // 销毁token
            localStorage.removeItem("token")
            // 跳转页面
            location.href = '/login.html'
        }
    } 
    /* options.complete = function (res) {
        console.log(res);
        var obj = res.responseJSON
        if (obj.status === 1 && obj.message === "身份认证失败！") {
            // 强制清空本地存储
            localStorage.removeItem('token');
            // 强制跳转到登录页面
            location.href = '/login.html'
        }
    } */
    
})