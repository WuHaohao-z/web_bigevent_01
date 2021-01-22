$(function () {
    
    // 初始化分类
    var layer = layui.layer
    var form = layui.form
    // 用等号切割，然后使用后面的值
    // alert(location.search.split("=")[1])
    function initForm() {
        var id = location.search.split("=")[1];
        $.ajax({
            method: "GET",
            url: "/my/article/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val("form-edit",res.data);
                // 赋值
                tinyMCE.activeEditor.setContent(res.data.content);
                if (!res.data.cover_img) {
                    return layer.msg("用户未曾上传照片！")
                }
                var newImgURL = baseURL + res.data.cover_img
                // 为裁剪区域重新设置图片
                $image
                .cropper('destroy')      // 销毁旧的裁剪区域
                .attr('src', newImgURL)  // 重新设置图片路径
                .cropper(options)        // 重新初始化裁剪区域
            }
        });
    }
    
    
    // 定义文章分类的
    initCate()
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var str = template("tpl-cate", res)
                $("[name=cate_id]").html(str)
                // 调用form.render()渲染
                form.render()
                // 渲染完毕再初始化form
                initForm()
                
            }
        });
    }

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 4.选择封面的按钮 
    $("#btnChooseImage").on("click", function () {
        $("#coverFile").click()
    })


    // 5.获取用户选择的文件列表
    $("#coverFile").on("change", function (e) {
        var file = e.target.files[0]
        // 判断用户是否选择了文件
        if (file === undefined) {
            return;
        }
        // 根据文件，创建对应的URL地址
        var newImgURL = URL.createObjectURL(file)
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 6.修改状态
    // 定义文章的发布状态
    var art_state = "已发布"
    $("#btnSave2").on("click"), function () {
        art_state = "草稿"
    }


    // 7.提交
    $("#form-edit").on("submit", function (e) {
        // 7.1 阻止默认行为
        e.preventDefault()
        // 7.2 基于表单，快速创建一个FormData对象
        var fd = new FormData(this);
        // 7.3 将文章的发布状态，存到fd中
        fd.append("state", art_state)

        // 7.5 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 7.6 将文件对象，存储到fd中
                fd.append("cover_img", blob)
                // 7.4 扩展字符串
                console.log(...fd);
                // 7.7 发起ajax请求
                publishArticlie(fd)
            })
    })

    // 8.定义一个发布文章的方法
    function publishArticlie(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/edit",
            data: fd,
            // 如果向服务器提交的是formdata格式的数据，必须添加一下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg("恭喜你，修改成功！！！")
                // 跳转
                // location.href = "/article/art_list.html"
                // window.parent.$("#art_list").click()
                setTimeout(function () {
                    window.parent.document.getElementById("art_list").click()
                },1500)
            }
        });
    }

})