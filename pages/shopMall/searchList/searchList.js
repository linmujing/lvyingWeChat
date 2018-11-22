// pages/shopMall/searchList/searchList.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchval: '',
    pageSize: 6,
    lists: [],
    count: 0,
    more: '点击加载更多~',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    that.setData({
      searchval: options.val
    })
    that.getProductList(6)
  },
  // input值改变
  updateVal(e) {
    var that = this
    that.setData({
      searchval: e.detail.value
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
  // 搜索
  onSearch() {
    this.getProductList(6)
    this.setData({
      pageSize: 6,
      more: '点击加载更多~'
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
      that.getProductList(that.data.pageSize)
    }
  },
  getProductList(pageSize){
    wx.showLoading({ title: '加载中' })
    var that = this;
    // 接口参数
    let url = app.GO.api + 'product/info/getProductList';
    let param = { pageNo: 1, pageSize: pageSize, searchKey: this.data.searchval };
    app.appRequest('post', url, param, {}, (res) => {
      console.log(res)
      if (res.code == 200) {
        wx.hideLoading()
        that.setData({
          lists: res.content.list,
          count: res.content.count
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