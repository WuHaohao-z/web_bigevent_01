$(function () {
    // 点击去注册
    $("#link_reg").on("click",function () {
        $(".login_box").hide();
        $(".reg_box").show();
    })
    // 点击去登录的链接
    $("#link_login").on("click",function () {
        $(".reg_box").hide();
        $(".login_box").show();
    })

    // 自定义校验对象
    // 只要引入了layui.js就会多出一个
    var form = layui.form;
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 属性就是定义的规则名称
        // 密码规则
        pwd:[
            // 数组中第一个元素是正则
            /^[\S]{6,12}$/,
            // 数组中第二个元素是报错信息
            '密码为6-12位且不能为空'
        ],
        // 用户名规则
        unm:[
            /^[\S][a-z0-9]{2,}$/,
            '用户名包括小写字母数字且必须超过两位,不能有空格'
        ],
        // 确认密码规则,两次密码输入是否一致
        repwd:function(value) {
            // 通过形参拿到的是确认密码框中的内容，还需要拿到密码框中的内容
            var pwd = $(".reg_box [name=password]").val().trim();
            // 然后进行一次等于判断
            if(value !== pwd){
                // 如果判断失败，则return一个提示消息即可
                return '两次密码不一致'
            }
        }
    })

    // 注册
    var layer = layui.layer;
    // 监听注册表单的提交事件
    $("#form_reg").on("submit",function(e) {
        // 阻止默认的提交行为
        e.preventDefault();
        // 发起ajax的post请求
        var data = {username:$(".reg_box [name=username]").val(),
            password:$(".reg_box [name=password]").val()};
        $.post("/api/reguser", 
            data,
            function (res) {
                if(res.status != 0){
                    return layer.msg(res.message);
                }
                layer.msg('注册成功!');
                // 模拟人的点击行为
                $("#link_login").click();
                // 重置form表单
                $("#form_reg")[0].reset();
            },
        );
    })

    // 监听登录表单的提交事件
    $("#form_login").on("submit",function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            method: "POST",
            url: "/api/login",
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                // 判断
                if(res.status != 0){
                   return layer.msg(res.message) 
                }
                // 打印登录的结果
                console.log(res);
                // 将登陆成功得到token的字符串保存到localstorage中
                localStorage.setItem("token",res.token)
                // 登录成功后跳转到后台主页
                location.href = "/index.html"
            }
        });
    })
    
})