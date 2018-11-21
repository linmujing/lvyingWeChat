/* 
 * --湖南大业创展科技有限公司--
 * title:常用公共函数库
 * author:空哥 277409083@qq.com 15307319570
 * createDate: 2017/2/28
 */
var md5 = require('md5.js')

/*
 * @:title:获取当前unix时间戳 
 */
function timeStamp() {
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  return timestamp.toString()
}


function formatTime(date, ydmhis = true) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  if (ydmhis == true) {
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  } else {
    return [year, month, day].map(formatNumber).join('-')
  }


}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/* 
 *@:title:统一缓存操作入口 
 *@:params: action set设置/get获取/remove清空,key必须在 storegeList允许范围内,
 *          data字符串,默认sync操作
 *@:return: 查询操作 false/result  修改操作 true/false
 *@:author: 空哥 277409083@qq.com 15307319570
 */
function storage(action, key, data, sync = true) {
  var result = false           //返回值
  var record = false           //当前操作记录
  var error = ''
  //缓存注册列表
  var storeageList = [
    'login_auth',               /* 认证状态 */
    'user_info',                /* 用户信息 */
    'store_info',               /* 店铺信息 */
    'store_id',                 /* 当前访问店铺 */
    'shopping_cart',            /* 购物车缓存 */
    'foot_print',               /* 我逛过的店铺 */
    'default_user_address',     /* 默认地址对象 */
    'store_config',             /* 商铺配置 */
    'tmp_address',              /* 用户在收货地址列表中选择的收货地址信息 */
    'pay_info',                 /* 当前店铺商户支付信息 */
    'card_info',                /*会员卡信息*/
    'recommend_customer_id'              /*第二次进入*/
  ]
  for (var k in storeageList) {
    if (storeageList[k] == key) {
      switch (action) {
        case 'set':
          try {
            wx.setStorageSync(key, data)
            result = true
            record = true
          } catch (e) {

          }
          break;
        case 'get':
          try {
            result = wx.getStorageSync(key, data)
            record = true
          } catch (e) {

          }
          break;
        case 'remove':
          try {
            wx.removeStorageSync(key)
            result = true
            record = true
          } catch (e) {

          }
          break;
      }
    }
  }
  if (record == false) console.log('本次缓存操作' + action + ',不符合条件 错误值key=' + key)
  //if (error != '') logUpload(error)
  return result
}

/* 
 *@:title:log统一上传 (包括抛出异常)
 *@:params: 
 *@:author: 空哥 277409083@qq.com 15307319570
 */

function logUpload(data) {

  wx.request({
    url: 'https://URL',
    data: {},
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // header: {}, // 设置请求的 header
    success: function (res) {
      // success
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    }
  })


}

/* 
 *@:title:参数正则表达式(通用提交输入验证)
 *@:params: 
 *@:author: 空哥 277409083@qq.com 15307319570
 */
function paramsReg(data, t = 'string') {
  var reg = {
    url: '正则规则',
    mobile: '手机',
    real_card: '身份证',
    qq: '',
    email: '',
  }

}



/* 
 *@:title:随机字符串
 *@:params: len 长度
 *@:author: 空哥 277409083@qq.com 15307319570
 */
function randomString(len = 32) {
  var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = chars.length;
  var pwd = '';
  for (var i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}


/*
 *@: 生成微信支付签名
 *@: params 
 *@: return sign
 */
function getPaySign(signData) {
  // var ext_data = wx.getExtConfigSync();
  // console.log("获取ext.json配置:");
  // console.log(ext_data);
  var key = storage('get', 'pay_info').pay_key;         //动态获取ext.json微信支付商户指定key
  console.log("支付密钥: " + key);
  var str = "appId=" + signData.appId + "&nonceStr=" + signData.noncestr + "&package=prepay_id=" + signData.prepay_id + "&signType=MD5&timeStamp=" + signData.timeStamp;
  //var str = str.sort()  //按ascii 排序
  var str = str + "&key=" + key
  console.log('str:' + str)
  var sign = md5.hexMD5(str).toUpperCase()

  console.log('sign:' + sign)

  return sign
}
/*
 *@: title: 用户登录Login
 *@: params 
 *@: return void
 */
function login(thatt, source = 1) {

  var that = thatt
  that.GO.user_info = storage('get', 'user_info')  //调整
  var code = ''
  var userInfo = ''
  //调用登录接口
  wx.login({
    success: function (res) {
      console.log(res)
      storage('set', 'login_auth', 1)
      code = res.code
      getLoginAuthor(thatt, code)
    },
    fail: function (res) {
      console.log(res)
      storage('set', 'login_auth', -1)
      console.log('login失败');
      getLoginAuthor(thatt, code)
    }
  })

}
/*
 *@: title: 获取用户微信登录授权
 *@: params 
 *@: return void
 */
function getLoginAuthor(thatt, code, iv, encryptedData){
  var that = thatt;
  var url = that.GO.api + "wechat/login/mp/customer/userInfo"
  var param = {
    'code': code,
  }
  if (iv != null || encryptedData != null) {
    param.encrypted_info = {
      iv: iv,
      encryptedData: encryptedData
    }
  }

  that.appRequest('post', url, param, {}, (res) => {
    console.log(res)
    if (res.code == 200) {
      
    }
  }, (err) => {
    console.log('请求错误信息：  ' + err.errMsg);
  });

}

/*
 *@: title: 鉴权API访问
 *@: params 
 *@: return void
 */
function requestSignin( thatt, code, iv, encryptedData) {
  console.log(code)
  var that = thatt;
  var url = that.GO.api + "wechat/login/mp/customer/userInfo"
  var param = {
    'app_id': that.GO.app_id,
    'client_code': code,
    'scene': that.GO.scene,
    'recommend_customer_id': that.GO.recommend_customer_id
  }
  if (iv != null || encryptedData != null) {
    param.encrypted_info = {
      cert: iv,
      data: encryptedData
    }
  }
  var data = {
    app_id: param.app_id,
    client_code: param.client_code,
    scene: param.scene,
    encrypted_info: param.encrypted_info,
    recommend_customer_id:param.recommend_customer_id
  }
  console.log(data);
  wx.request({
    url: url,
    data: data,
    method: 'POST',
    success: function (res) {
      if (res.data.status == 'success') {
        that.GO.user_info = res.data.data
        that.GO.store_id = res.data.data.store_id
        that.GO.mch_id = res.data.data.mch_id               //支付商户号
        console.log("鉴权成功!店铺ID: " + res.data.data.store_id);
        var pay_info = {
          'mch_id': res.data.data.mch_id,
          'pay_key': res.data.data.pay_key
        }
        storage('set', 'pay_info', pay_info)                //当前店铺支付信息
        storage('set', 'store_id', res.data.data.store_id)  //识别当前店铺
        storage('set', 'user_info', res.data.data)          //存储用户信息
      } else {
        console.log("鉴权返回失败!");
        console.log(res.data);
      }
    },
    fail: function (res) {
      console.log('鉴权API访问失败!')
      console.log(res);
      storage('set', 'login_auth', -1)
    }
  })
}

/*
* @:title:统一调用wx.showToast() 
* @:param: title: 提示文字
*          icon: 'success'或者'loading'
*          duration: 延迟时间,默认10000(最大)
* @:author: ghl guhongliang@e2862.com
*/
function showToast(title = '', icon = 'loading', duration = 60000, img) {
  if (img != null && img != '') {
    wx.showToast({
      title: title,
      mask: true,
      icon: icon,
      image: img,
      duration: duration
    })
  } else {
    wx.showToast({
      title: title,
      mask: true,
      icon: icon,
      duration: duration
    })
  }

}

/*
 *@: 系统提醒
 *@: params str
 *@: return void
 */
function systemAlert(str = '', doFunction = null,) {
  if (str == '') {
    str = ''
  }
  wx.showModal({
    title: '系统提醒',
    content: str,
    showCancel: false,
    confirmColor: "#ef3939",
    success: function (res) {
        if (doFunction != null) doFunction();
      }
  })
}




/*
* @:title:统一调用wx.showModal()
* @:param: title: 提示标题
*          content: 提示内容
*          showCancel: 是否显示取消按钮
*          trueFunction: 用户点击 回调函数         
*          falseFunction 用户取消 回调函数
* @:author: ghl guhongliang@e2862.com
*/
function getUserInfo(that) {
  var user_info = that.GO.user_info;
  if (user_info) {
    return user_info;
  } else {
    return storage('get', 'user_info');
  }
}

/*
* @:title:统一调用wx.showModal()
* @:param: title: 提示标题
*          content: 提示内容
*          showCancel: 是否显示取消按钮
*          trueFunction: 用户点击 回调函数         
*          falseFunction 用户取消 回调函数
* @:author: ghl guhongliang@e2862.com
*/
function showModal(title, content, showCancel, trueFunction, falseFunction) {
  wx.showModal({
    title: title,
    content: content,
    showCancel: showCancel,
    confirmColor: "#ef3939",
    success: function (res) {
      if (res.confirm) {
        console.log("User click confirm");
        if (trueFunction != null) trueFunction();
      } else {
        console.log("User click cancel");
        if (falseFunction != null) falseFunction();
      }
    }
  })
}
/*
* @:title:统一调用wx.openLocation(),打开微信内置地图
* @:param: latitude: 纬度
*          longitude: 经度
*          scale: 缩放比例,默认18
*          name: 位置名      
*          address: 详细的地址说明
* @:author: ghl guhongliang@e2862.com
*/
function openLocation(latitude, longitude, name, address, scale) {
  console.log('带地图');
  if (typeof scale != 'number' || scale == null)
    scale = 18
  wx.openLocation({
    latitude: latitude,
    longitude: longitude,
    scale: scale,
    name: name,
    address: address
  })

}
/*
* @:title:统一调用wx.navigateBack() ,回退操作
* @:param: delta: int 回退数,默认 1
* @:author: ghl guhongliang@e2862.com
*/
function navigateBack(delta) {
  if (typeof delta != 'number' || delta == null) delta = 1;
  return function (delta) {
    wx.navigateBack({
      delta: delta, // 回退前 delta(默认为1) 页面
    })
  }
}
/**
 * 统一HTTP请求入口
 * @author 格纳尔<BlizzardCarnival@gmail.com>
 * @param String api_url API地址
 * @param Object api_param API参数
 * @param Function callback_name 回调名称
 */
function httpRequest(api_url, api_param, success_callback_name, fail_callback_name) {
  wx.request({
    url: api_url,
    data: api_param,
    method: 'POST',
    success: function (response_data) {
      success_callback_name(response_data);
    },
    fail: function (error_data) {
      fail_callback_name(error_data);
    }
  })
}
/**
 * @title 判断用户是否登录
 * @param obj 不同的登录判断  shopping: '我的'  ,common: 其他各处
 * @author ghl<guhongliang@e2862.com>
 * @return void
 */
function isLogin(obj) {
  var session_id = storage('get', 'user_info').session_id;
  var result = true;
  switch (obj) {
    case 'shopping':
      var store_id = storage('get', 'store_id');
      if (session_id == null || session_id == '' || typeof (session_id) == "undefined" || store_id == null || typeof (store_id) == "undefined") {
        result = false;
      }
      break;
    case 'common':
      if (session_id == null || session_id == '' || typeof (session_id) == "undefined") {
        result = false;
      }
      break;
  }
  return result;
}
/**
 * @title 字符串转年月日日期
 * @author ghl<guhongliang@e2862.com>
 * @return date
 */
function stringToDate(str) {
  var temper = str;
  str = new Date(temper.replace(/-/, "/"))
  var d = new Date(str);
  str = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  return str;
}


/**
* @title 加载中的统一样式
* @author lpf<lipeifeng@e2862.com>
  @param number loadingStatus：1 加载中
  @param number loadingStatus：2   上拉加载中
  @param number loadingStatus：3   网络错误 
  @param number loadingStatus：4   数据申请中                
*/
function loading(app, loadingStatus, page_this) {
  var loading = {};
  loading.windowHeight = app.GO.windowHeight + 50;
  loading.windowWidth = app.GO.windowWidth;
  switch (loadingStatus) {
    case 1:
      loading.loadingStatus = 1
      break;
    case 2:
      loading.loadingStatus = 2
      break;
    case 3:
      loading.loadingStatus = 3
      break;
    case 4:
      loading.loadingStatus = 4
      break;

    case '':
      loading.loadingStatus = ''
      console.log('----------loading() 方法说您没有传入值  不显示状态----------------')
      break;
  }
  page_this.setData({
    loading: loading
  })
}

/**
* @title 加载中的统一样式
* @author lpf<lipeifeng@e2862.com>
  @param string content_type：content       商品详情页无详情 
  @param string content_type：comment       商品详情页无评价             
  @param string content_type：closeComment  商品详情页关闭评价  
  @param string content_type：store         转到选择店铺的显示  
  @param string content_type：address       我的地址页面无收货地址的显示  
  @param string content_type：shop          购买首页，购物车无内容的显示 
  @param string content_type：order         购买首页，订单无内容的显示 
*/
function emptyContent(app, content_type, page_this) {

  var emptyContent = {};
  switch (content_type) {
    case 'content':
      emptyContent.content_type = 'content'
      break;
    case 'comment':
      emptyContent.content_type = 'comment'
      break;
    case 'closeComment':
      emptyContent.content_type = 'closeComment'
      break;
    case 'store':
      emptyContent.content_type = 'store'
      break;
    case 'address':
      emptyContent.content_type = 'address'
      break;
    case 'shop':
      emptyContent.content_type = 'shop'
      break;
    case 'order':
      emptyContent.content_type = 'order'
      break;
    case 'coupon':
      emptyContent.content_type = 'coupon'
      break;
    case 'dynamic':
      emptyContent.content_type = 'dynamic'
      break;
    case 'no':
      emptyContent.content_type = 'no'
      break;
    case 'index':
      emptyContent.content_type = 'index'
      break;
    case '':
      emptyContent.content_type = ''
      console.log('----------noContent() 方法说您没有传入值  不显示状态----------------')
      break;
  }

  page_this.setData({
    emptyContent: emptyContent
  })
}
/**
 * @title: rpx 转换 px值
 * @author: 空哥<277409083@qq.com>
 * @params: rpx值
 * @return: px值 
 */

function rpxTopx(rpx) {
  var res = wx.getSystemInfoSync()
  var weight = res.windowWidth
  var transform = 750 / weight
  var transform = transform.toFixed()
  return (rpx * transform)
}

/**
 * 选择图片
 * @author ghl
 * @param Object api_param  图片选择条件参数
 * @param Function callback_name 回调名称
 */
function chooseImage(api_param, callback_name, index) {
  wx.chooseImage({
    count: (api_param.count) ? api_param.count : 3, // 最多可以选择的图片张数，默认3
    sizeType: (api_param.size_type) ? api_param.size_type : ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
    sourceType: (api_param.source_type) ? api_param.source_type : ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
    success: function (response_data) {
      chooseImageSuccess(callback_name, response_data, index);
    },
    fail: function (error_data) {
      console.log(error_data);
    }
  });
}
/**
 * 处理选择的图片
 * @author ghl
 * @param Object api_param  图片选择条件参数
 * @param Function callback_name 回调名称
 */
function chooseImageSuccess(callback_name, response_data, index) {
  callback_name(response_data, index);
}
/**
 * 上传请求
 * @author 格纳尔<BlizzardCarnival@gmail.com>
 * @param String api_url API地址
 * @param Object api_param API参数
 * @param Function callback_name 回调名称
 */
function httpUpload(api_url, api_param, callback_name, index) {
  wx.uploadFile({
    url: api_url,
    filePath: api_param.respurce_data,
    name: api_param.resource_key,
    formData: api_param.form_data,
    success: function (response_data) {
      if (typeof (response_data.data) == 'object') {
        uploadSuccess(callback_name, response_data.data, index);
      } else {
        uploadSuccess(callback_name, JSON.parse(response_data.data), index);
      }
    },
    fail: function (error_data) {
      uploadFail(error_data, index);
    }
  });
}
function uploadSuccess(callback_name, response_data, index) {
  if (response_data.status == 'success') {
    callback_name(response_data.data, index);
  } else
    if (response_data.status == 'failure') {
      systemAlert(response_data.info);
    } else {
      systemAlert('服务器异常，请与系统管理员联系');
    }
}
/**
 * 四舍五入函数
 * @author 空哥<lzkandlt@qq.com>
 * @param src 表示要转换的值
 * @param pos 保留几位小数
 * @return 转换处理之后的值
 */
function round(src, pos) {

  return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);

}

/**
 * 手机绑定提示
 * @author 顾宏亮<guhongliang@qq.com>
 * @return void
 */
function checkSigninId() {
  var user_info = storage('get', 'user_info');
  var signin_id = user_info.signin_id;
  if (signin_id == '') {
    return false;
  } else {
    console.log('已绑定手机:' + signin_id);
  }
}
/**
 * 跳转手机绑定界面
 * @author 顾宏亮<guhongliang@qq.com>
 * @return void
 */
function goBindPhone() {
  return function () {
    wx.navigateTo({
      url: '/pages/person/bindPhone'
    })
  }
}
/** 设置头部颜色的方法
  * @author 李沛峰 < 610466535@qq.com>
 * @param   fontColor  string 导航字体颜色
 * @param   background  string 导航背景颜色
 * @param   duration  number  延迟多少秒变化
 *  @param   duration  number  变化的方式 ease-in-out linear 等css3变化方法
 */ 
function setNaviTheme(fontColor, background, duration, timingFunc){
  wx.setNavigationBarColor({
    frontColor: fontColor,
    backgroundColor: background,
    animation: {
      duration: duration,
      timingFunc: timingFunc
    }
  })
}


module.exports = {
  formatTime: formatTime,
  storage: storage,
  logUpload: logUpload,
  paramsReg: paramsReg,
  randomString: randomString,
  timeStamp: timeStamp,
  getPaySign: getPaySign,
  login: login,
  showToast: showToast,
  systemAlert: systemAlert,
  showModal: showModal,
  openLocation: openLocation,
  navigateBack: navigateBack,
  isLogin: isLogin,
  httpRequest: httpRequest,
  //dataRequest:dataRequest
  loading: loading,
  chooseImage: chooseImage,
  httpUpload: httpUpload,
  getUserInfo: getUserInfo,
  round: round,
  emptyContent: emptyContent,
  stringToDate: stringToDate,
  checkSigninId: checkSigninId,
  goBindPhone: goBindPhone,
  setNaviTheme: setNaviTheme
}
