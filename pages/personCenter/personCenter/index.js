// pages/personCenter/personCenter/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 个人中心列表
    personNavData: [
      {
        text: '我的课程',
        imgSrc: '../../../images/icon/person_icon_1.png',
        url: '../myCourse/index'
      }, {
        text: '我的订单',
        imgSrc: '../../../images/icon/person_icon_2.png',
        url: '../myOrder/index'
      }, {
        text: '我的优惠券',
        imgSrc: '../../../images/icon/person_icon_3.png',
        url: '../myCoupon/index'
      }, {
        text: '我的评价',
        imgSrc: '../../../images/icon/person_icon_4.png',
        url: '../myComment/index'
      }, {
        text: '我的售后',
        imgSrc: '../../../images/icon/person_icon_5.png',
        url: '../myAfterService/index'
      }, {
        text: '我的地址',
        imgSrc: '../../../images/icon/person_icon_5.png',
        url: 'myAddress'
      },
    ],
    imgHeadUrl: '',
    wxName: '',
  },
  /**
   * 普通事件""
   */ 
  // 页面跳转
  jump: function (e){

    let index = e.target.dataset.index;
    console.log(this.data.personNavData[index].url)
    wx.navigateTo({
      url: this.data.personNavData[index].url
    })

  },
  
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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