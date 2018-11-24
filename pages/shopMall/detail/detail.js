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
    merchantCode: '',
    productCode: '',
    // 优惠券
    cuponList: [],
    couponModel: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getDetailData(options.code)
    // this.setData({
    //   productCode: options.code
    // })
    this.getDetailData('P154044842843250')
    this.setData({
      productCode: 'P154044842843250'
    })
  },
  // 获取详情
  getDetailData(code) {
    wx.showLoading({ title: '加载中' })
    var that = this;
    // 接口参数
    let url = app.GO.api + 'product/info/getProductInfo';
    let param = { productCode: code, ciCode: app.GO.recommend_customer_id };
    app.appRequest('post', url, param, {}, (res) => {
      wx.hideLoading()
      // console.log(res)
      if (res.code == 200) {
        var result = res.content
        // 获取商户信息
        that.getMerchantInfo(result.merchantCode)
        // 获取优惠券
        that.getProductCoupon(code, result.merchantCode)
        that.setData({
          detailData: result,
          merchantCode: result.merchantCode
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
      // console.log(res)
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
  // 获取优惠券
  getProductCoupon(pcode, mcode) {
    var that = this;
    // 接口参数
    let url = app.GO.api + 'coupon/info/getCouponList';
    let param = { pageNo: 1, pageSize: 1000, productCode: pcode, merchantCode: mcode };
    app.appRequest('post', url, param, {}, (res) => {
      console.log(res)
      if (res.code == 200) {
        var list = res.content.list
        for(var i=0;i<list.length;i++){
          list[i].couponEndTime = that.dateFormat(list[i].couponEndTime)
          list[i].couponStartTime = that.dateFormat(list[i].couponStartTime)
        }
        that.setData({
          cuponList: list
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
  showCoupon(){
    this.setData({
      couponModel: false
    })
  },
  hideCoupon() {
    this.setData({
      couponModel: true
    })
  },
  // 选择优惠券
  selectCoupon(e){
    var code = e.currentTarget.dataset.code;
    var form = e.currentTarget.dataset.form;
    var ciCode = app.GO.recommend_customer_id;
    var that = this;
    if (ciCode == null || ciCode == "null" || ciCode == undefined) {
      wx.showToast('您还没有登录，请登录后再尝试！');
      return;
    }
    // 接口参数
    let url = app.GO.api + 'customer/coupon/addCoupon';
    let param = { ciCode: ciCode, couponCode: code, couponForm: form };
    app.appRequest('post', url, param, {}, (res) => {
      console.log(res)
      if (res.code == 200) {
        wx.showToast({ title: '领取成功', icon: 'success' })
        // 刷新优惠券列表
        that.getProductCoupon(that.data.productCode, that.data.merchantCode)
      } else {

        wx.showToast({ title: res.message, icon: 'none' })

      }
    }, (err) => {
      wx.showToast({ title: '领取失败', icon: 'none' })
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  //时间格式化函数，此处仅针对yyyy-MM-dd hh:mm:ss 的格式进行格式化
  dateFormat: function (time) {
    var date = new Date(time);
    var year = date.getFullYear();
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    // 拼接
    return year + "-" + month + "-" + day;
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