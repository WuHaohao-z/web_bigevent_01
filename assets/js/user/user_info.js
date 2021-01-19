// 入口函数
$(function () {
    // 1.定义昵称校验规则
    var form = layui.form;
    var layer = layui.layer;

    // 验证规则
    form.verify({
        // 属性是规则性，值可以是函数，也可以是数组
        nickname:function (value) {
            if(value.length > 6){
                return '用户昵称字符在1 ~ 6 之间'
            }
        }
    });


    // 2.初始化用户的基本信息
    initUserInfo();
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                console.log(res);
                // 利用 layui 调用 form.val()方法 快速为表单赋值
                form.val("formUserInfo",res.data)
            }
        });
    };
    // console 看ajax请求 看resopen


    // 3.重置表单的数据
    // 如果是给form表单绑定的话，就是reset重置事件，给重置按钮绑的是click事件。注意，不要绑定返了
    $("#btnReset").on("click",function (e) {
        // 阻止表单的默认重置行为
        e.preventDefault();
        // 在调用一下这个函数
        initUserInfo();

    });


    // 4.提交用户信息
    $(".layui-form").on("submit",function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 发起ajax数据请求
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            // 快速获取表单中的数据
            data:$(this).serialize(),
            success: function (res) {
                // 判断返回值状态
                if(res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg("更新用户信息成功!")
                // 调用父页面的方法，重新渲染用户的信息和头像 
                // window.parent获取的是iframe的父页面对应的window对象,全局函数才会挂载到父级
                window.parent.getUserInfo()
            }
        });
    })
})