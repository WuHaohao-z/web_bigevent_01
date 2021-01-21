$(function () {
    var layer = layui.layer;
    // 获取文章分类的列表
    initArtCateList()
    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if(res.status !== 0){
                    return console.log(res.message);
                }
                console.log(res);
                var htmlStr = template("tpl-table",res);
                $("tbody").html(htmlStr) 
            }
        });
    }


    // 为添加类别按钮绑定点击事件
    // 弹框创建和删除不在一个函数中，所以要设置成全局变量
    var indexAdd = null;
    $("#btnAddCate").on("click",function () {
        indexAdd = layer.open({
            // 把确定按钮干掉
            type:1,
            // 设置宽和高
            area:["500px","250px"],
            title: '添加文章分类',
            content: $("#dialog-add").html()
          });
    })


    // 提交添加文章分类
    // 通过代理的形式，为form-add表单绑定submit事件
    $("body").on("submit","#form-add",function (e) {
        // 阻止默认行为
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                // 判断状态码
                if(res.status !== 0){
                    return layer.msg(res.message);
                }
                // 弹出提示
                layer.msg("恭喜你！新增分类成功!")
                // 刷新列表
                initArtCateList()
                // 根据索引关闭对应的弹出层
                layer.close(indexAdd)
            }
        });
    })


    // 显示修改form表单
    // 通过代理形式，为btn-edit绑定点击事件
    var indexEdit = null
    var form = layui.form;
    $("tbody").on("click",".btn-edit",function () {
        // 弹出修改文章信息的层
        indexEdit = layer.open({
            // 把确定按钮干掉
            type:1,
            // 设置宽和高
            area:["500px","250px"],
            title: '修改文章分类',
            content: $("#dialog-edit").html()
          });
          // 获取自定属性和发送ajax都要写在ajax里面
          var id = $(this).attr("data-id");
        //   console.log(id);
          // 发起请求获取对应分类的数据
          $.ajax({
              method: "GET",
              // /:id是动态参数，/:都不可以删除
              url: "/my/article/cates/" + id,
              success: function (res) {
                  if(res.status !== 0){
                      return layer.msg(res.message)
                  }
                //   赋值
                  form.val("form-edit",res.data)
                  console.log(res);
                  console.log(id);
              }
          });
    })


    // 修改:监听表单的提交事件
    // 通过代理的形式，为修改心扉的表单绑定submit事件
    $("body").on("submit","#form-edit",function (e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                // 成功提示
                layer.msg("修改成功！！")
                // 关闭弹出层
                layer.close(indexEdit)
                // 刷新页面
                initArtCateList()
            }
        });
    })


    // 通过代理的形式，未删除按钮绑定点击事件
    $("tbody").on("click",".btn-delete",function() {
        var id = $(this).attr("data-id");
        // 弹出询问框
        layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
            //发起请求
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    if(res.status !== 0){
                        return layer.msg(res.message)
                    }
                    initArtCateList()
                    layer.msg("删除分类成功！！")
                    layer.close(index);
                }
            });
          });
    })
})