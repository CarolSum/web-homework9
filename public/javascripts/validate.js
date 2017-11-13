var flags;
var errMsg = ['6-18位数字、字母或下划线，必须以字母开头', '8位数字，不能以0开头','11位数字，不能以0开头',
  '请输入合法邮箱','6-12位数字、字母、中划线或下划线','两次密码输入不一致']

$(function(){
  flags = $('.flag');
  inputs = $('.input');
  post_btn = $('.button')[0];
  $('.input').blur(function(){
    var id;
    if(this.value != ''){
      var flag = false;
      console.log(this.name);
      switch(this.name){
        case 'username':
          flag =/^[a-zA-Z][a-zA-Z0-9_]{5,17}$/.test(this.value);
          id = 0;
          break;
        case 'id':
          flag =/^[1-9][0-9]{7}$/.test(this.value);
          id = 1;
          break;
        case 'phone':
          flag =/^[1-9][0-9]{10}$/.test(this.value);
          id = 2;
          break;
        case 'email':
             flag = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)$/.test(this.value);
             id = 3;
             break;
           case 'password':
             flag =/^[a-zA-Z0-9_\-]{6,12}$/.test(this.value);
          id = 4;
             break;
           case 're_password':
             console.log(inputs[4].value);
             flag = this.value == inputs[4].value;
             id=5;
             break;
      }
      console.log(id);
      if(!flag){
        //show err msg
        flags[id].innerHTML = errMsg[id];
        flags[id].style.opacity = 1;
      }else{
        flags[id].innerHTML = '';
        flags[id].style.opacity = 0;
      }
      post_btn.disabled = "";
      for (var i = 0; i < flags.length; i++) {
        if(flags[i].innerHTML != '') {
          post_btn.disabled = "disabled";
          break;
        }
      }
    }
  });
});


