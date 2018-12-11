// pages/personCenter/myAfterService/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //  可用屏幕高度
    windowHeight: '',

    // 优惠券类型
    orderType: [
      { text: '申请换货', value: '0' },
      { text: '换货成功', value: '1' },
    ],

    // 售后订单列表
    orderList: [],

    // 滚动距离
    scrollWidth: 1 / 2 * app.GO.windowWidth,
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

    // 获取数据
    this.getData();
  },
  // 切换选项
  changeNav: function (e) {

    if (e.target.dataset.index == this.data.scrollIndex) { return; }

    this.setData({
      scrollIndex: e.target.dataset.index
    })

    let pageData = this.data.pageData;
    pageData.current = 1;
    pageData.finished = false;

    this.setData({
      pageData: pageData,
      orderList: []
    })

    this.getData();
  }
  ,

  /**
  * 数据加载
  *（上拉加载更多）
  */
  getData() {

    // 没有更多数据了
    if (this.data.pageData.finished) {
      wx.showToast({ title: '没有更多了！', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '加载中', mask: true })

    // 课程接口参数
    let url = app.GO.api + 'order/product/getOrderProductList';
    let param = {
      pageNo: this.data.pageData.current,
      pageSize: this.data.pageData.pageSize,
      ciCode: app.GO.recommend_customer_id, //获取用户code
      isExchang: this.scrollIndex + 1
    };

    app.appRequest('post', url, param, {}, (res) => {
      wx.hideLoading()
      console.log(res)
      if (res.code == 200) {

        let data = res.content.list;
        let orderList = this.data.orderList;
        let pageData = this.data.pageData;

        pageData.total = res.content.count;
        pageData.current++;

        for (let item of data) {
          orderList.push({
            orderId: item.orderCode,
            createDate: item.createDate,
            isExchange: item.isExchange,
            productWxProfileUrl: item.productInfo.productProfileUrl, //item.productInfo.productWxProfileUrl,
            productCode: item.productInfo.productCode,
            productTitle: item.productInfo.productTitle,
            productOrgPrice: item.productInfo.productOrgPrice,
          })
        }

        // 数据全部加载完成
        if (orderList.length >= pageData.total) {

          pageData.finished = true;
          
          if (this.data.pageData.current != 2) {
            wx.showToast({ title: '没有更多了！', icon: 'none' })
          } 

        }

        this.setData({
          orderList: orderList,
          pageData: pageData
        })
        console.log(this.data.orderList)

      } else {

        wx.showToast({ title: res.message })

      }
    }, (err) => {
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