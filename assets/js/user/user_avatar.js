$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    var options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    // 2.选择图片
    // 为上传按钮绑定点击事件
    $("#btnChooseImage").on("click", function () {
        $("#file").click()
    })


    // 3.修改裁剪区域
    // 为文件选择框绑定change事件
    var layer = layui.layer;
    $("#file").on("change", function (e) {
        // console.log(e);
        // 3.1获取用户选择的文件
        // e.target是为事件冒泡做预防的
        var filelist = e.target.files[0];
        // 3.4 非空校验，预判断
        /* if(filelist == undefined){
            return layer.msg("请选择照片！！")
        } */
        if (filelist.length == 0) {
            return layer.msg("请选择照片！！")
        }
        // 3.2将文件，转化为路径，在内存当中生成地址
        var imgURL = URL.createObjectURL(filelist)
        // 3.3重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    // 4.修改头像
    // 为确定按钮，绑定点击事件
    $("#btnUpload").on("click", function () {
        // 4.1拿到用户裁剪之后的图片,获取base64位的字符串
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')
            console.log(dataURL);
            console.log(typeof dataURL);
        // 4.2调用接口，吧头像上传到服务器
        $.ajax({
            method: "POST",
            url: "/my/update/avatar",
            data: {
                avatar:dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                } 
                // 成功提示
                layer.msg("恭喜，更换头像成功!")
                // 重新渲染父页面
                window.parent.getUserInfo()
            }
        });
    })


})