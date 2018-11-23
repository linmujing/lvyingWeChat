// pages/personCenter/myCoupon/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 优惠券类型
    couponType: [
      { text: '全部', value: '' },
      { text: '可使用', value: '1' },
      { text: '已使用', value: '2' },
      { text: '已过期', value: '0' },
    ],

    // 滚动距离
    scrollWidth: 0 ,
    // 选项下标
    scrollIndex: 0,

    json:[
      {
        a:[
          {
            b:[1,2,3]
          }
        ]
      }
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success:  (res) => {

        // 200 是选项的rpx
        this.setData({
          scrollWidth: 200 * (res.windowWidth / 750)
        })
      
      }
    })
  },

  // 切换选项
  changeNav: function (e) {

    if (e.target.dataset.index == this.data.scrollIndex) { return; }

    this.setData({
      scrollIndex: e.target.dataset.index
    })

  }

})