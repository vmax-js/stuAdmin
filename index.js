//存储学生数据
var tableData = [];
//当前页
var nowPage = 1;
//每页存储的学生数据条数
var pageSize = 10;
//一共有多少页
var allPage = 1;
var editForm = document.getElementById('student-edit-form');
var model = document.getElementsByClassName('model')[0];
var tBody = document.getElementById('tBody');
//为页面添加事件
function bindEvent() {
    var menu = document.getElementsByClassName('menu')[0];
    menu.onclick = function (e) {
        //nodeName tagName
        // console.log(e.target.nodeName);
        if (e.target.tagName == 'DD') {
            // siblingsMenu = getSiblings(e.target);
            // for (var i = 0; i < siblingsMenu.length; i++) {
            //     siblingsMenu[i].classList.remove('active');
            // }
            // e.target.classList.add('active');
            changeStyle(e.target);
            var id = e.target.getAttribute('data-id');
            var showContent = document.getElementById(id);
            changeStyle(showContent);
        } else {
            return false;
        }
        //console.log(e.target.dataset)
        /*
        //隐藏
        var siblingsContent = getSiblings(showContent);
        for (var j = 0; j < siblingsContent.length; j++) {
            siblingsContent[j].style.display = 'none';
        }
        //显示
        showContent.style.display = 'block';
        */

    }
    //表单提交按钮
    var studentAddBtn = document.getElementById('student-add-submit');
    studentAddBtn.onclick = function () {
        //获取学生信息
        var form = document.getElementById('student-add-form');
        var data = getFormData(form);

        if (data) {
            // data.appkey = "tscn_1591154769158";
            //向后台发送学生数据进行存储   
            // var data = saveData('http://open.duyiedu.com/api/student/addStudent', data);
            //保存成功 
            // if(data.status == 'success'){
            // alert('添加成功');
            // var form = document.getElementById('student-add-form');
            //重制表单中的数据
            // form.reset();
            // var studentListDom = menu.getElementsByTagName('dd')[0];
            //回到学生列表中
            // studentListDom.click();
            // } else {
            //失败之后显示详细信息
            // alert(data.msg);
            // }
            //添加学生数据
            transferData('/api/student/addStudent', data, function () {
                alert('添加成功');
                var form = document.getElementById('student-add-form');
                form.reset();
                getTableData();
                var studentListDom = menu.getElementsByTagName('dd')[0];
                studentListDom.click();
                //添加学生数据之后显示到学生表格中
                renderTable(data.findByPage);

            })
        }
        //阻止默认行为 form表单按钮input点击提交
        return false;
    }
    
    tBody.onclick = function(e){
        // console.log(e.target.classList.contains('edit'));
        //判断当前点击按钮是不是编辑按钮
        //contains方法是classList特有的
        if(e.target.classList.contains('edit')){
            var model = document.getElementsByClassName('model')[0];
            model.style.display = 'block';
            // console.log(e.target.dataset.index);
            //看当前点击的按钮是什么
            var index = e.target.dataset.index;
            // console.log(tableData[index]); 
            //数据回填
            renderForm(tableData[index]);
        //判断当前点击按钮是不是删除按钮
        } else if(e.target.classList.contains('del')){ //是删除按钮
            //确认弹框
            var isDel = confirm("确认删除吗？");
            if(isDel){ //确定删除
                var index = e.target.dataset.index;
                transferData("/api/student/delBySno",{
                    sNo: tableData[index].sNo
                },function(){
                    alert("删除成功");
                    // 更新数据 
                    getTableData();
                })
            }

        }
    }
    /*
        编辑窗口确定
    */
    var studentEditBtn = document.getElementById('student-edit-submit');
    studentEditBtn.onclick = function(e){
        //return false; 阻止的是后续操作 如果是点击之前或者点击过程中
        //触发就不能阻止
        //如果用return false 就必须确定默认行为是在当前事件之后触发
        e.preventDefault(); 
        var data = getFormData(editForm);
        if(data){ //data是正常的数据对象
            transferData('/api/student/updateStudent',data,function(){
                alert('修改成功');
                model.style.display = 'none';
                getTableData();
            })
        }
        // console.log(data);
        
    }

    /*
        点击空白编辑表单页面其它地方，编辑表单页面消失
        有事件冒泡
        解决方法1，为子元素添加点击事件然后阻止冒泡

    */
   model.onclick = function(e){
       // 解决方法2 如果点击的是自己也就是编辑表单区域（model-content）之外的地方 model
        if (e.target == this){
            model.style.display = 'none';
        }
       
        
   }
    // 解决方法1，为子元素添加点击事件然后阻止冒泡    
    //    var modelContent = model.getElementsByClassName('model-content')[0];
    //    modelContent.onclick = function(e){
    //         e.stopPropagation(); //阻止冒泡
    //    }

    /*
        上一页和下一页定义事件
    */
   var turnPage = document.getElementsByClassName('turn-page')[0];
   turnPage.onclick = function(e){
    //    console.log(e.target.id);
        if (e.target.id == 'next-btn'){
            nowPage++;
            getTableData();
        } else if(e.target.id == 'prev-btn'){
            nowPage--;
            getTableData();
        }
   }
}

//获取所有的兄弟节点
function getSiblings(node) {
    var parent = node.parentElement;
    var children = parent.children;
    var result = [];
    for (var i = 0; i < children.length; i++) {
        if (children[i] != node) {
            result.push(children[i]);
        }
    }
    return result;
}

//左右两边切换
function changeStyle(node) {
    siblingsMenu = getSiblings(node);
    for (var i = 0; i < siblingsMenu.length; i++) {
        siblingsMenu[i].classList.remove('active');
    }
    node.classList.add('active');

}

//获取表单数据
function getFormData(form) {
    //form表单的特点   form下input input的id值或是name值
    //先找id值为name的，再找name值为name的
    var name = form.name.value;
    var sex = form.sex.value;
    var sNo = form.sNo.value;
    //邮箱
    var email = form.email.value;
    var birth = form.birth.value;
    //手机号
    var phone = form.phone.value;
    //住址
    var address = form.address.value;
    // console.log(form,name,sex,sno,syx,syear,sph,szz);
    if (!name || !sNo || !email || !birth || !phone || !address) {
        alert('信息填写不完全');
        return false;
    }
    //数据校验
    if(!(/^\d{4,16}$/.test(sNo))){
        alert("学号为4-16位数字");
        return false;
    }
    if(!(/^(19|20)\d{2}$/.test(birth))){
        alert("出生年份应该在1900-2099年");
        return false;
    }
    if(!(/^\d{11}$/.test(phone))){
        alert("手机号为11数字");
        return false;
    }
    if(!(/^\w+@\w+\.com$/.test(email))){
        alert("邮箱格式不正确");
        return false;
    }
    return {
        sNo: sNo,
        name: name,
        sex: sex,
        birth: birth,
        phone: phone,
        address: address,
        email: email
    }
}

//数据交互
function transferData(url, data, success) {
    data.appkey = "tscn_1591154769158";
    var result = saveData('http://open.duyiedu.com' + url, data);
    if (result.status == 'success') {
        //成功之后处理的方式不一样 
        success(result.data);
    } else {
        //失败之后 显示信息
        alert(result.msg);
    }

}

//获取学生数据列表
function getTableData() {
    transferData('/api/student/findByPage', {
        page: nowPage,
        size: pageSize
    }, function (data) {
        console.log(data);
        //空数组指向数据的数组
        tableData = data.findByPage;

        //向上取整
        allPage = Math.ceil(data.cont / pageSize);


        renderTable(data.findByPage);
    })
}

//渲染学生表格数据
function renderTable(data) {
    //拼接到一起
    var str = "";
    //获取当前年份
    var year = new Date().getFullYear();
    //循环学生信息
    data.forEach(function (ele,index) {
        // data-index自定义属性，做一个标记，后面点击的时候就知道谁点击的
        str += `
        <tr>
           <th>${ele.sNo}</th>
           <th>${ele.name}</th>
           <th>${ele.sex == '0' ? '男' : '女'}</th>
           <th>${ele.email}</th>
           <th>${year - ele.birth}</th>
           <th>${ele.phone}</th>
           <th>${ele.address}</th>
           <th>
               <button class="edit btn" data-index=${index}>编辑</button>
               <button class="del btn" data-index=${index}>删除</button>
           </th>
        </tr>
        `;
        
        var nextBtn = document.getElementById("next-btn");
        var preBtn = document.getElementById("prev-btn");
        tBody.innerHTML = str;

        /*
            判断显示上下页面
        */
        if (allPage > nowPage){ //总共页数大于当前的页数
            
            // block不行为独占一行 inline-block不独占一行
            nextBtn.style.display = "inline-block";
        } else {
            nextBtn.style.display = "none";
        }
        if(nowPage > 1){ //当前页码大于第一页
            preBtn.style.display = "inline-block";
        } else{
            preBtn.style.display = "none";
        }
    });
}
//数据回填
function renderForm(data){
    
    for( var prop in data){
        if(editForm[prop]){
            editForm[prop].value = data[prop];
        }
    }
}

bindEvent();

//获取学生数据列表
getTableData();

//手动触发点击事件 使一开始就显示学生列表
document.getElementsByClassName('active')[0].click();

// 向后端存储数据
function saveData(url, param) {
    var result = null;
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    if (typeof param == 'string') {
        xhr.open('GET', url + '?' + param, false);
    } else if (typeof param == 'object') {
        var str = "";
        for (var prop in param) {
            str += prop + '=' + param[prop] + '&';
        }
        xhr.open('GET', url + '?' + str, false);
    } else {
        xhr.open('GET', url + '?' + param.toString(), false);
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                result = JSON.parse(xhr.responseText);
            }
        }
    }
    xhr.send();
    return result;
}

//调用接口
// var data = saveData('http://open.duyiedu.com/api/student/findAll',{
//     appkey: 'tscn_1591154769158'
// });
// console.log(data);