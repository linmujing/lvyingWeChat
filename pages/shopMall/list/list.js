// pages/shopMall/list/list.js
//获取应用实例
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabTitle: [
      { 'catName': '全部', 'id': 1 }
    ],
    lists: [],
    currentTab: 0,
    count: 0,
  },
  //获取tab
  getTabTitle(id) {
    var that = this;
    // 接口参数
    let url = app.GO.api + 'product/cat/getProductCatList';
    let param = {
      parentId: id
    };
    app.appRequest('post', url, param, {}, (res) => {
      console.log(res)
      if (res.code == 200) {
        var arr = []
        arr = res.content
        arr.unshift(that.data.tabTitle[0])
        that.setData({
          tabTitle: arr
        })
        that.getListData(6, id)
      } else {

        wx.showToast({ title: res.message })

      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  //获取列表
  getListData(pageSize, id) {
    wx.showLoading({ title: '加载中' })
    var that = this;
    // 接口参数
    let url = app.GO.api + 'product/info/getProductList';
    let param = { 'pageNo': 1, 'pageSize': pageSize, 'productCat': id, 'orderByStr': 10 };
    app.appRequest('post', url, param, {}, (res) => {
      wx.hideLoading()
      console.log(res)
      if (res.code == 200) {
        that.setData({
          lists: res.content.list,
          count: res.content.count
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTabTitle(1)
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