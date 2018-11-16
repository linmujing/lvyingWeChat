// pages/personCenter/myCoupon/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //  可用屏幕高度
    windowHeight: '',

    /* 优惠券数据对象 */
    couponData: {
      // 优惠券类型下标
      couponTypeIndex: 0,
      // 优惠券类型
      couponType: [
        { text: '全部', value: '' },
        { text: '可使用', value: '1' },
        { text: '已使用', value: '2' },
        { text: '已过期', value: '0' },
      ],
      // 优惠券列表
      couponList: [],

    },
    
    // 滚动距离
    scrollWidth: 200 * app.GO.rpxValue ,
    // 选项下标
    scrollIndex: 0,

    // 分页
    pageData: {
      total: 0,
      pageSize: 10,
      current: 1,
      loading: false,
      finished: false
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取屏幕高度
    wx.getSystemInfo({
      success: res => {
        console.log(res.screenHeight)
        this.setData({
          windowHeight: res.screenHeight - 91 * app.GO.rpxValue
        })
      }
    })
  },

  // 切换选项
  changeNav: function (e){
    
    if (e.target.dataset.index == this.data.scrollIndex){ return ;}

    this.setData({
      scrollIndex: e.target.dataset.index
    })

  }

})