// pages/personCenter/myCourse/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 课程数据
    courseData: [],
    // 分页
    pageData: {
      total: 0,
      pageSize: 10,
      current: 1,
      loading: false,
      finished: false
    },
    // 视口高度
    windowHeight: '',
  },
  /**
   * 普通事件
  */
  // 页面跳转
  jump: function (e) {

    let index = e.target.dataset.index;
    console.log(this.data.personNavData[index].url)

    // wx.navigateTo({
    //   url: ''
    // })

  },
  /**
   * 数据加载
  */
  // 获取我的课程数据 （上拉加载更多）
  getData() {

    // 没有更多数据了
    if (this.data.pageData.finished){
      wx.showToast({ title: '没有更多了！', icon: 'none' });
      return ;
    }

    wx.showLoading({title: '加载中'})

    // 课程接口参数
    let url = app.GO.api + 'customer/course/getCourseList' ;
    let param = {
      pageNo: this.data.pageData.current,
      pageSize: this.data.pageData.pageSize,
      ciCode: app.GO.recommend_customer_id, //获取用户code
    }; 

    app.appRequest('post', url, param, {}, (res) => {
      wx.hideLoading()
      console.log(res)
      if(res.code == 200){

        let data = res.content.list;
        let courseData = this.data.courseData;
        let pageData = this.data.pageData;

        pageData.total = res.content.count;
        pageData.current = pageData.current + 1;

        for (let item of data) {
          courseData.push({
            title: item.productName,
            productCode: item.productCode,
            source: item.merchantNm,
            imgSrc: item.productProfileUrl,
          })
        }

        // 数据全部加载完成
        if (courseData.length >= pageData.total) {

          pageData.finished = true;
          wx.showToast({ title: '没有更多了！', icon: 'none'})

        }

        this.setData({
          courseData: courseData,
          pageData: pageData
        })
        console.log(this.data.courseData)

      }else{

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