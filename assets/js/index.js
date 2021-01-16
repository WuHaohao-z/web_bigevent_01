$(function () {
    // 调用getUserInfo获取用户的基本信息,并渲染用户名和头像
    getUserInfo()

    var layer = layui.layer

    // 点击按钮实现退出功能
    $("#btnLogout").on("click",function () {
        // 提示用户是否确认退出
        layer.confirm('是否确认退出?', {icon: 3, title:'提示'}, function(index){
            // 点击确定后要什么事情
            // 1.清空本地存储中的token
            localStorage.removeItem("token")
            // 2.重新跳转到登录页面
            location.href = '/login.html'
            
            // 关闭询问框
            layer.close(index);
          });
    })


})
// 要在其他页面引这个函数，所以必须是全局函数!!!
// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        // 请求头配置对象
        /* headers:{
            // 获取身份认证
            Authorization:localStorage.getItem("token") || ""
        }, */
        success: function (res) {
            // 判断是否获取成功
            if(res.status !== 0){
                return layui.layer.msg("获取用户信息失败!")
            }
            // 调用renderAvatar渲染用户的头像
            renderAvatar(res.data)
        },
        // 不论成功还是失败，最终都会调用complete回调函数
        /* complete:function (res) {
            // 在complete回调函数中，可以使用拿到服务器响应回来的数据
            if(res.responseJSON)
            // 1.强制清空token
            // 2.强制跳转到登陆页面
        } */
    });
}
// 渲染用户头像
function renderAvatar(user) {
    //1.获取用户的名称
    var name = user.nickname || user.username
    // 2.设置欢迎的文本
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name)
    // 3.按需渲染用户的头像
    if(user.user_pic !== null){
        // 3.1渲染图片头像
        $(".layui-nav-img").attr("src",user.user_pic).show()
        $(".text-avatar").hide()
    }else{
        // 3.2渲染文本头像
        $(".layui-nav-img").hide()
        // 把首字母转成大写字母，对汉字和特殊符号没有影响
        var first = name[0].toUpperCase()
        $(".text-avatar").html(first).show()
    }
}