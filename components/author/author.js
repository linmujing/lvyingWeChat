// components/mydist/author.js
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
    // 组件显示
    authorShow: true
  },
  ready(){
    console.log('ready')
    console.log(app.GO)
  },
  /**
 * 生命周期函数--监听页面显示
 */
  show: function () {
    console.log('show')
    console.log(app.GO)

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取用户信息
    onGotUserInfo(res) {
      
      console.log(res)

      wx.showLoading({ title: '获取授权中...', mask: true })

      let that = this;
      // 小程序接口参数
      let url = app.GO.api + 'wechat/login/mp/customer/userInfo';
      let param = {
        encryptedData: res.detail.encryptedData,
        iv: res.detail.iv
      };

      //调用登录接口
      wx.login({
        success: function (res) {
          console.log(res)
          param.code = res.code;

          wx.request({
            url: url,
            method: 'get',
            data: param,
            success: function (res) {
              console.log(res.data);
              wx.hideLoading()
              wx.showToast({ title: '获取授权成功！' })
              that.setData({
                authorShow: false
              })
              // 登录设置用户参数
              app.GO.recommend_customer_id = res.data.ciCode;
              app.GO.recommend_customer_name = res.data.ciName;
              app.GO.recommend_customer_img = res.data.ciProfileUrl; 
              app.GO.unionLongId = res.data.unionLongId;
            },
            fail: function (err) {
              errFun(err);
              wx.showToast({ title: '获取授权失败，请重新检查网络是否正常！', icon: 'none' })
            }
          })

        },
        fail: function (res) {
          wx.hideLoading()
          wx.showToast({ title: '获取授权失败，请重新检查网络是否正常！', icon: 'none' })
        }
      })
    },
  }
})
