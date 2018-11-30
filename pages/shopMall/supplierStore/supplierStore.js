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
  // 跳转到详情
  toDetail(e) {
    // console.log(e)
    var code = e.currentTarget.dataset.code;
    wx.navigateTo({
      url: '../../shopMall/detail/detail?code=' + code,
    })
  },
  // 加载更多
  clickMore() {
    var that = this
    var pageSize = that.data.pageSize
    that.setData({
      pageSize: pageSize + 6
    })
    if (pageSize >= that.data.count) {
      wx.showToast({ title: '没有更多了', icon: 'none' })
      that.setData({
        more: '没有更多了~'
      })
    } else {
      that.getListData(that.data.pageSize)
    }
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
  // 立即购买  data-productCode="{{商品编码}}"  bindtap="goBuy"
  goBuy(e) {
    let productCode = e.currentTarget.dataset.productcode;
    wx.navigateTo({
      url: '../../shopCart/submitOrder/index?productCode=' + productCode
    })
  },
  // 添加到购物车 data-productCode="{{商品编码}}" data-productCount="{{商品数量}}"  bindtap="addCart"
  addCart(e) {

    wx.showLoading({ title: '加载中' })

    // 接口参数
    let url = app.GO.api + 'customer/cart/addCart';
    let param = {
      productCode: e.currentTarget.dataset.productcode, // 商品编码 
      productCount: 1, //加入购物车数量
      ciCode: app.GO.recommend_customer_id, //获取用户code
    };

    app.appRequest('post', url, param, {}, (res) => {
      // console.log(res)
      wx.hideLoading()
      wx.showToast({ title: res.message, icon: 'none' })
      // 添加商品成功时, 修改购物车状态
      let cartState = wx.getStorageSync('cartState');
      wx.setStorageSync('cartState', parseFloat(cartState) + 1)

    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
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