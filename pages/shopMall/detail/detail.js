// pages/shopMall/detail/detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData: {},
    // 商户信息对象
    merchantInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetailData()
  },
  // 获取详情
  getDetailData() {
    wx.showLoading({ title: '加载中' })
    var that = this;
    // 接口参数
    let url = app.GO.api + 'product/info/getProductInfo';
    // let param = { productCode: 1, ciCode: app.GO.recommend_customer_id };
    let param = { productCode: 'P154043959943866', ciCode: app.GO.recommend_customer_id };
    app.appRequest('post', url, param, {}, (res) => {
      wx.hideLoading()
      console.log(res)
      if (res.code == 200) {
        var result = res.content
        // 获取商户信息
        that.getMerchantInfo(result.merchantCode)
        that.setData({
          detailData: result
        })
      } else {

        wx.showToast({ title: res.message, icon: 'none' })

      }
    }, (err) => {
      wx.hideLoading()
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  // 获取商户详细信息
  getMerchantInfo(code) {
    var that = this;
    // 接口参数
    let url = app.GO.api + 'merchant/info/getMerchantInfo';
    let param = { merchantCode: code };
    app.appRequest('post', url, param, {}, (res) => {
      console.log(res)
      if (res.code == 200) {
        that.setData({
          merchantInfo: res.content
        })
      } else {

        wx.showToast({ title: res.message, icon: 'none' })

      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  // 跳转到提供商店铺
  goStore(){
    wx.navigateTo({
      url: '../../shopMall/supplierStore/supplierStore?code=' + this.data.detailData.merchantCode,
    })
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