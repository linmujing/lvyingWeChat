// pages/shopMall/supplierStore/supplierStore.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播数据
    indicatorDots: true,
    cindicatorColor: '#00AA88',
    autoplay: true,
    interval: 5000,
    duration: 1000,
    banner: [],
    merchantCode: '',
    merchantInfo: {},
    lists: [],
    count: 0,
    pageSize: 6,
    more: '点击加载更多~',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    that.setData({
      merchantCode: options.code
    })
    that.getMerchantInfo(options.code)
    that.getListData(this.data.pageSize)
    // 获取轮播数据
    wx.getStorage({
      key: 'banner',
      success(res) {
        console.log(res.data)
        that.setData({
          banner: res.data
        })
      }
    })
  },
  // 获取商户详细信息
  getMerchantInfo(code) {
    wx.showLoading({ title: '加载中' })
    var that = this;
    // 接口参数
    let url = app.GO.api + 'merchant/info/getMerchantInfo';
    let param = { merchantCode: code };
    app.appRequest('post', url, param, {}, (res) => {
      console.log(res)
      if (res.code == 200) {
        wx.hideLoading()
        that.setData({
          merchantInfo: res.content
        })
      } else {
        wx.hideLoading()
        wx.showToast({ title: res.message, icon: 'none' })

      }
    }, (err) => {
      wx.hideLoading()
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  //获取列表
  getListData(pageSize) {
    wx.showLoading({ title: '加载中' })
    var that = this;
    // 接口参数
    let url = app.GO.api + 'product/info/getProductList';
    let param = { 'pageNo': 1, 'pageSize': pageSize, 'merchantCode': this.data.merchantCode, 'orderByStr': 10 };
    app.appRequest('post', url, param, {}, (res) => {
      wx.hideLoading()
      console.log(res)
      if (res.code == 200) {
        that.setData({
          lists: res.content.list,
          count: res.content.count
        })
      } else {

        wx.showToast({ title: res.message, icon: 'none' })

      }
    }, (err) => {
      wx.hideLoading()
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