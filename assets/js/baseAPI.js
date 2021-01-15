// 开发环境:开发时用这个路径
var baseURL = 'http://api-breakingnews-web.itheima.net';
// 测试环境
// 生产环境


// 不需要入口函数
// 在发送ajax()get()post()方法之前会触发这个函数
$.ajaxPrefilter(function (options) {
    // options获取到ajax所有参数信息
    // alert(options.url);
    options.url = baseURL + options.url;
    // alert(options.url);
})