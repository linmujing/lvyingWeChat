// pages/sort/sort.js
//获取应用实例
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabData: [],
    currentTab: 0,
    winHeight: app.GO.windowHeight,
  },
  //获取推荐商品
  getSortData() {
    wx.showLoading({ title: '加载中' })
    var that = this;
    // 接口参数
    let url = app.GO.api + 'product/cat/getProductCatWxInitList';
    let param = {};
    app.appRequest('post', url, param, {}, (res) => {
      wx.hideLoading()
      console.log(res)
      if (res.code == 200) {
        that.setData({
          tabData: res.content
        })
      } else {

        wx.showToast({ title: res.message })

      }
    }, (err) => {
      wx.hideLoading()
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  // 切换tab
  switchNav(e) {
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  houseChange(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    })
  },
  // 跳转到列表
  toList(e) {
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    console.log(name)
    var typeid = this.data.currentTab + 1
    wx.navigateTo({
      url: '../shopMall/list/list?id=' + id + '&name=' + name + '&typeid=' + typeid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSortData()
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

    if (!app.GO.isLogin) {
      wx.navigateTo({
        url: '../../author/author'
      })
    }
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