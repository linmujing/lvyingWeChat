//app.js
var util = require('utils/util.js')  //引用公共函数类库
var common = require('utils/common.js')  
App({
  
  config : {
      master: {  /* 正式环境配置 */
          api:'http://www.luyingjiaoyu.com/law-web-api/',
          pay:'http://www.luyingjiaoyu.com/law-web-api/',
          img_path:'http://e2862-V2.img-cn-hangzhou.aliyuncs.com/'
      },
      debug: {   /* 测试环境配置 */
          api:'http://114.115.133.96:8899/law-web-api/',
          pay:'http://114.115.133.96:8899/law-web-api/',
          img_path:'http://e2862-test.img-cn-hangzhou.aliyuncs.com/'
      }
  },
  
  //全局可用变量
  GO : {
    app_id: 'wxb6be4529a4f7a306', 
    mch_id: '',  /* 微信支付商户号 */
    scene: '',             /* 场景值 */
    api:'',                /* 当前使用api接口地址 */
    pay_api:'',            /* 当前支付api接口地址 */
    img_path:'',           /* 当前使用图片地址 */
    util:'',               /* 通用工具类库 */
    user_info:[],           /* 鉴权成功返回的数据 */
    store_id: 0,           /*当前店铺ID */
    store_info: [],         /*当前店铺信息 */
    system_info: [],        /* 手机系统信息 */
    windowHeight:0,         /* 当前设备的屏幕高 */
    windowWidth:0,          /* 当前设备的屏幕宽 */
    rpxValue: '',           /* rpx真实值 */
    recommend_customer_id: 'C154044832616974' /*用户id*/

  },
  
  onLaunch: function (options) {
    console.log(options)
      // let recommend_customer_id=options.query.recommend_customer_id!=undefined?options.query.recommend_customer_id:''
      // this.GO.recommend_customer_id=recommend_customer_id
    /* 根据分支自动识别为正式或者是测试版本 */
    if(common.defaultBranch() == 'master'){
        this.GO.api = this.config.master.api;
        this.GO.pay_api = this.config.master.pay;
        this.GO.img_path = this.config.master.img_path;
    }else{
        this.GO.api = this.config.debug.api;
        this.GO.pay_api = this.config.debug.pay;
        this.GO.img_path = this.config.debug.img_path;
    }
    //动态获取ext.json配置信息
    // 获取第三方平台信息
    var ext_data = wx.getExtConfigSync();
    this.GO.app_id = ext_data.extAppid;
    /*获取系统信息 包括手机型号 像素比*/ 
    var res = wx.getSystemInfoSync()
    this.GO.windowHeight = res.windowHeight;
    this.GO.windowWidth = res.windowWidth; 
    this.GO.rpxValue = res.windowWidth/750;
    this.GO.scene = options.scene;  //场景值
    this.GO.util = util
    this.getSystemInfo();
    //鉴权
    if(util.storage('get','login_auth') == 1){
      this.GO.util.login(this)
    }else{
      this.GO.util.login(this,2)  
    }
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