// 入口函数
$(function() {
    // 1.定义密码规则
    // 从layui里导出form表单
    var form = layui.form;
    
    form.verify({
        // 原密码的校验规则
        pwd:[
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        // 新密码的校验规则
        samePwd:function (value) {
            // 如果新密码和旧密码一样，就提示9
            if(value === $("[name=oldPwd]").val()){
                return "新密码和旧密码不能相同"
            }
            
        },
        // 重置密码的校验规则
        rePwd:function (value) {
            // 判断跟新密码是否一致
            if(value !== $("[name=newPwd]").val()){
                return "两次输入的密码不一致！"
            }
        },
    })

    // 
    $(".layui-form").on("submit",function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data:$(this).serialize(),
            success: function (res) {
                if(res.status != 0){
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg("修改密码成功！")
                // 重置表单
                // form有reset方法，必须转成原生的DOM对象调用
                $(".layui-form")[0].reset()
            },
        });
    })
})