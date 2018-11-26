// pages/personCenter/checkLogistics/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //物流信息
    logisticsData: {},

    // 商品信息
    productPrice: '',
    productName: '',
    productProfileUrl: '',

    // 订单参数
    orderCode: '',
    productCode: '',
    trackNo: '',
    orderMerchantCode: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      orderCode: options.orderCode,
      productCode: options.productCode,
      trackNo: options.productCode,
      orderMerchantCode: options.orderMerchantCode,
    })

    // 获取商品详情
    this.getProductInfo();
    // 获取商品物流
    this.checkLogistics()

  },

  // 获取商品物流
  checkLogistics() {
    let that = this;
    // 接口参数
    let url = app.GO.api + 'order/track/getOrderTrack';
    let param = {
      'orderCode': this.data.orderCode,
      'orderMerchantCode': this.data.orderMerchantCode,
      'trackNo': this.data.trackNo,
    };

    app.appRequest('post', url, param, {}, (res) => {
      console.log(res)
      let data = res.content;
      if (res.code == 200) {
        let logisticsData = {
          orderCode: this.$route.query.orderCode,
          orderId: res.data.content.trackNo,
          deliveryAddress: res.data.content.sendAddressId,
          person: res.data.content.signName,
          collectAddress: res.data.content.signAddressId,
          date: res.data.content.createDate
        }
        this.setData({
          logisticsData: logisticsData
        })
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });

  },

  // 获取商品详情
  getProductInfo() {
    let that = this;
    // 接口参数
    let url = app.GO.api + 'product/info/getProductInfo';
    let param = {
      'productCode': this.data.productCode
    };

    app.appRequest('post', url, param, {}, (res) => {
      console.log(res)
      let data = res.content;
      if (res.code == 200) {
        that.setData({
          productPrice: data.productPrice,
          productName: data.productName,
          productProfileUrl: data.productProfileUrl
        })
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });

  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})