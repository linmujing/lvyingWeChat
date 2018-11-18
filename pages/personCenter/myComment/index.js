// pages/personCenter/myComment/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 我的评论
    commentData: [],
    // 分页
    pageData: {
      total: 0,
      pageSize: 10,
      current: 1,
      loading: false,
      finished: false
    },
    userName: '',
    userHeadUrl: '' ,
    // 视口高度
    windowHeight: '',
  },
  /**
     * 数据加载
    */
  // 获取我的评论数据 （上拉加载更多）
  getData() {

    // 没有更多数据了
    if (this.data.pageData.finished) {
      wx.showToast({ title: '没有更多了！', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '加载中' })

    // 评论接口参数
    let url = app.GO.api + 'order/comment/getProductCommentList';
    let param = {
      pageNo: this.data.pageData.current,
      pageSize: this.data.pageData.pageSize,
      ciCode: app.GO.recommend_customer_id, //获取用户code
      productScore: '',
      searchKey: ''
    };

    app.appRequest('post', url, param, {}, (res) => {
      wx.hideLoading()
      console.log(res)
      if (res.code == 200) {

        let data = res.content.list;
        let commentData = this.data.commentData;
        let pageData = this.data.pageData;

        pageData.total = res.content.count;
        pageData.current++;

        for (let item of data) {
          commentData.push({
            createDate: item.createDate,
            commentDesc: item.commentDesc,
            productWxProfileUrl: item.productInfo.productProfileUrl,
            productCode: item.productInfo.productCode,
            productTitle: item.productInfo.productTitle,
            productOrgPrice: item.productInfo.productOrgPrice,
          })
        }

        // 数据全部加载完成
        if (commentData.length >= pageData.total) {

          pageData.finished = true;
          wx.showToast({ title: '没有更多了！', icon: 'none' })

        }

        this.setData({
          commentData: commentData,
          pageData: pageData
        })
        console.log(this.data.commentData)

      } else {

        wx.showToast({ title: res.message })

      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取屏幕高度
    wx.getSystemInfo({
      success: res => {
        this.setData({
          windowHeight: res.screenHeight
        })
      }
    })

    this.getData();
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