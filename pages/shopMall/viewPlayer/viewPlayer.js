// index/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    controls: false,
    isPlay: true,
    currentPlay: 0,
    productSection: [],
    code: 'P154036292431224',
    typeid: 3
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.palyer = wx.createVideoContext('player')
    this.setData({
      // source: this.data.productSection[options.index].videoUrl
      code: options.code,
      typeid: options.typeid,
      currentPlay: options.index
    })
    this.getDetailData(this.data.code)
    
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
        that.setData({
          // 课程目录
          productSection: JSON.parse(result.productSection),
          source: JSON.parse(result.productSection)[that.data.currentPlay].videoUrl,
          isPlay: false
          // 动态管控列表
          // sectionNav: result.productSectionIndexList,
          // sectionIndex: result.productSectionIndexList.length > 0 ? result.productSectionIndexList[0].sectionIndex : 0,
          // sectionList: result.productSectionList
        })
        that.palyer.play()
      } else {

        wx.showToast({ title: res.message, icon: 'none' })

      }
    }, (err) => {
      wx.hideLoading()
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  /**
  * 点击开始播放
  */
  btn_play: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    console.log(that.data.productSection[index].videoUrl)
    if (that.data.productSection[index].videoUrl == '') {
      wx.showToast({ title: '对不起，课程' + that.data.productSection[index].sectionName + '暂无数据！', icon: 'none' })
      return false;
    }
    that.setData({
      source: that.data.productSection[index].videoUrl,
      isPlay: true,
      currentPlay: index
    })
    setTimeout(() => {
      if (that.data.isPlay) {
        that.palyer.play();
        that.setData({
          isPlay: false
        })
      } else {
        that.palyer.pause();
        that.setData({
          isPlay: true
        })
      }
    }, 300)
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