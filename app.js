//app.js
var util = require('utils/util.js')  //引用公共函数类库
var common = require('utils/common.js')  
App({
  
  config : {
      master: {  /* 正式环境配置 */
        api: 'https://flgk.exqoo.com/law-web-api/', 
        app_id: 'wx23f86c338cd84ea1', 
      },
      debug: {   /* 测试环境配置 */
        api:'http://flgk.yohez.com/law-web-api/',
        app_id: 'wx3c04fa1bed4f0353',
      }
  },
  
  //全局可用变量
  GO : {
    app_id: '', /* appid */
    mch_id: '',  /* 微信支付商户号 */
    scene: '',             /* 场景值 */
    api:'',                /* 当前使用api接口地址 */
    pay_api:'',            /* 当前支付api接口地址 */
    img_path:'',           /* 当前使用图片地址 */
    util:'',               /* 通用工具类库 */
    user_info:[],           /* 鉴权成功返回的数据 */
    system_info: [],        /* 手机系统信息 */
    windowHeight:0,         /* 当前设备的屏幕高 */
    windowWidth:0,          /* 当前设备的屏幕宽 */
    rpxValue: '',           /* rpx真实值 */
    recommend_customer_id: '', /*用户id*/
    recommend_customer_name: '', /*用户名*/
    recommend_customer_img: '', /*用户头像*/
    recommend_customer_phone: '', /*用户手机号*/
    unionLongId: '', /*用户唯一标识*/
    isLogin: false, // 是否已登录登录
  },
  
  onLaunch: function (options) {
    console.log(options)

    /* 根据分支自动识别为正式或者是测试版本 */
    if(common.defaultBranch() == 'master'){
      this.GO.api = this.config.master.api;
      this.GO.app_id = this.config.master.app_id;

    }else{
      this.GO.api = this.config.debug.api;
      this.GO.app_id = this.config.debug.app_id;
    }

    // 首次进入初始化购物车状态
    common.setCartState();

    /*获取系统信息 包括手机型号 像素比*/ 
    var res = wx.getSystemInfoSync()
    this.GO.windowHeight = res.windowHeight;
    this.GO.windowWidth = res.windowWidth; 
    this.GO.rpxValue = res.windowWidth/750;
    this.GO.scene = options.scene;  //场景值
    this.GO.util = util
    this.getSystemInfo();

    // 鉴权
    this.GO.util.getStorageData(this);
  },

  /*
  * @:title:获取手机系统信息
  * @:author: ghl guhongliang@e2862.com
  */   
  getSystemInfo: function(){
      var that = this;
      wx.getSystemInfo({
          success: function(res){
              that.GO.system_info = res;
          }
      })
  },
  /**
  * methods： 请求方式
  * url: 请求地址
  * data： 要传递的参数
  * callback： 请求成功回调函数
  * errFun： 请求失败回调函数
  */
  appRequest: function(methods, url, params, data, callback, errFun) {

    let str = '?'; 
    for(let key in params){
      str += key + '=' + params[key] + '&';
    }
    str = str.substring(0, str.length - 1);
    console.log(str)

    wx.request({
      url: url + str,
      method: methods,
      header: {
        'content-type': methods == 'GET' ? 'application/json' : 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      data: data,
      success: function (res) {
        callback(res.data);
      },
      fail: function (err) {
        errFun(err);
      }
    })
  },


})