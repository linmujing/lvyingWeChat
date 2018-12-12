// components/bindphone/bindphone.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    group:{
      userPhone: '',
      password: '',
      password2: '',
      sms: '', 
    },

    // 是否已注册 假如未注册，则需要输入密码，反之
    passwordShow: false,

    // 弹框状态 false 关闭 true 打开
    bindStateModel: true,

    //验证码按钮
    isSend: false,
    isSendText: '获取验证码'
  },
  // 页面渲染
  ready() {
    console.log(1)
    console.log(wx.getStorageSync("recommend_customer_phone"))
    // 判断是否有电话号码
    if (wx.getStorageSync("recommend_customer_phone") != null &&
        wx.getStorageSync("recommend_customer_phone") != 'null' &&
        wx.getStorageSync("recommend_customer_phone") != '') {
      app.GO.recommend_customer_phone = wx.getStorageSync("recommend_customer_phone") ;
      this.setData({
        bindStateModel: false
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

    // 绑定input数据
    bindInput(e) {

      let key = e.target.dataset.key;
      // 获取输入框对象数据
      let data = this.data.group;

      data[key] = e.detail.value;

      this.setData({
        group: data
      })

    },

    // 发送短信
    bingPhone() {

      let reg1 = new RegExp(/^1(3|4|5|7|8)\d{9}$/);

      // 正则验证手机号
      if (!reg1.test(this.data.group.userPhone)) {

        wx.showToast({ title:'请填写正确的手机号', icon: 'none'});
        return;

      }

      if (this.data.group.sms == '') {

        wx.showToast({ title: '请输入验证码', icon: 'none'});
        return;

      }

      wx.showLoading({ title: '加载中', mask: true });

      // 接口参数
      let url = app.GO.api + 'customer/info/bindingCustomerInfo';
      let param = { 'ciPhone': this.data.group.userPhone, 'smsCode': this.data.group.sms, 'unionId': app.GO.unionLongId };

      // 假如需要输入密码，则需要做个密码验证
      if (this.data.passwordShow) {

        if (this.data.group.password != this.data.group.password2) {

          wx.showToast({ title: '请输入正确的密码', icon: 'none'});
          return;

        }

        if (this.data.group.password == '') {

          wx.showToast({ title: '请输入密码', icon: 'none'});
          return;

        }

        param.passWord = this.data.group.password
      }

      // 绑定手机号
      app.appRequest('post', url, param, {}, (res) => {
        console.log(res)
        if (res.code == 200) {

          //console.log(res)
          wx.hideLoading();

          if (res.code == 200) {

            wx.showToast({ title:'绑定成功', icon: 'none'});

            app.GO.recommend_customer_phone = 1;
            this.setData({
              bindStateModel: false
            })

            return;

          }

        }
      }, (err) => {
        console.log('请求错误信息：  ' + err.errMsg);
      });
    },
    // 发送验证码
    sendSms() {

      let reg = new RegExp(/^1(3|4|5|7|8)\d{9}$/);

      // 正则验证手机号
      if (!reg.test(this.data.group.userPhone)) {

        wx.showToast({ title:'请填写正确的手机号', icon: 'none'});
        return;

      }

      // 接口参数
      let url = app.GO.api + 'customer/info/verifyCiPhone';
      let param = { 'ciPhone': this.data.group.userPhone };

      // 判断手机号是否已被注册
      app.appRequest('post', url, param, {}, (res) => {

          console.log(res)

          if (res.code == 500) {

            this.setData({
              passwordShow : true
            }) 

          } else if (res.code == 200) {

            this.setData({
              passwordShow: false
            }) 

          }

      })

      // 接口参数
      let url2 = app.GO.api + 'system/sms/sendSms';
      let param2 = { 'phoneNo': this.data.group.userPhone, 'type': '1' };
      // 发送绑定验证短信
      app.appRequest('post', url2, param2, {}, (res) => {

          console.log(res)

          if (res.code == 200) {

            wx.showToast({ title: '发送成功', icon: 'none'});

            this.sendTimeOut();

          }

        })
    },
    // 发送短信计时器
    sendTimeOut() {

      let timer = 60;

      let t = null;

      this.setData({
        isSend : true
      }) 

      t = setInterval(() => {

        if (timer > 0) {

          timer--;
          this.setData({
            isSendText : timer + 'S'
          })

        } else {

          this.setData({
            isSendText : '重新获取',
            isSend : false
          })
          clearInterval(t);
          return;

        }

      }, 1000)

    },

    // 关闭绑定框
    closeBind() {
      app.GO.recommend_customer_phone = 1;
      this.setData({
        bindStateModel: false
      })
    }
  }
})
