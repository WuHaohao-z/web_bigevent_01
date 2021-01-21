$(function () {
    var layer = layui.layer
    var form = layui.form
    
    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    
    // 美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        var dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds())
        
        return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss 
    }
    

    // 定义一个查询的参数对象，将来请求数据的时候，需要将请求的参数对象提交到服务器
    var q = {
        pagenum:1,
        pagesize:2,
        cate_id: '',
        state:'' 
    }


    // 获取文章列表数据的方法
    initTable()
    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if(res.status !== 0 ){
                    return layer.msg(res.message)
                }
                // 使用模板引擎渲染页面数据
                var str = template("tpl-table",res)
                $("tbody").html(str)
                //调用渲染分页的方法
                renderPage(res.total)
            }
        });
    }


    // 初始化文章分类的方法
    initCate()
    function initCate() {
        $.ajax({
            url: "/my/article/cates",
            success: function (res) {
                if(res.status !== 0 ){
                    return layer.msg(res.message)
                }
                // 调用模板引擎的渲染分类的可选项
                var str = template("tpl-cate",res)
                $("[name=cate_id]").html(str)
                // 通知layui重新渲染表单区域的ui结构
                // 如果赋值之后，发现数据没有同步出来，就可以调用form.rander
                form.render()
            }
        });
    }


    //为筛选表单绑定submit时间
    $("#form-search").on("submit",function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var state = $("[name=state]").val()
        var cate_id = $("[name=cate_id]").val()
        // 为查询参数对象q中对应的属性赋值
        q.state = state;
        q.cate_id = cate_id
        // 根据最新的筛选条件,重新渲染表格的数据
        initTable()
    })


    // 定义渲染分页的方法
    var laypage = layui.laypage
    function renderPage(total) {
        // console.log(total);
        laypage.render({
            // 分页容器的Id
            elem:"pageBox",
            // 总数据条数
            count:total,
            // 每页显示几条数据
            limit:q.pagesize,
            // 设置默认被选中的分页
            curr:q.pagenum,
            layout:['count','limit','prev','page','next','skip'],
            limits:[2,3,5,10],
            // 分页发生切换的时候，触发jump回调
           /*  触发jump回调的方式有两种
            1.页面切换的时候
            2.调用了 laypage.render方法 */
            jump: function(obj, first){
                //obj包含了当前分页的所有参数
                //console.log(obj.curr); 得到当前页，以便向服务端请求对应页的数据。
                // 把最新的页码值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr;
                //console.log(obj.limit); 得到每页显示的条数
                // 把最新的条目数，赋值到q这个查询参数对象的pagesize属性中
                q.pagesize = obj.limit;
                //首次不执行
                if(!first){
                    // 根据最新的q获取对应的数据列表，并渲染表格
                    initTable()
                }
              }
        })
    }


    // 删除
    $("tbody").on("click",".btn-delete",function () {
        // 获取当前页面删除按钮的个数
        var len = $(".btn-delete").length
        // 获取当前id
        var id = $(this).attr("data-id")
        // 询问用户是否删除
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if(res.status !== 0 ){
                        return layer.msg(res.message)
                    }
                    layer.msg("删除成功！！！")
                    // 当数据删除完成后，需要判断当前这一页中否还有剩余的数据
                    if(len === 1){
                        // 如果没有剩余的数据了，则让页码值-1之后
                        // 页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    // 在重新调用initTable方法
                    initTable()
                }
            });
            layer.close(index);
            
          });
    })


})