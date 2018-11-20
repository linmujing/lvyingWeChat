// pages/personCenter/myCoupon/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //  可用屏幕高度
    windowHeight: '',

    // 优惠券类型
    couponType: [
      { text: '全部', value: '' },
      { text: '可使用', value: '1' },
      { text: '已使用', value: '2' },
      { text: '已过期', value: '0' },
    ],
    
    // 优惠券列表
    couponList: [],
    
    // 滚动距离
    scrollWidth: 200 * app.GO.rpxValue ,
    // 选项下标
    scrollIndex: 0,

    // 分页
    pageData: {
      total: 0,
      pageSize: 10,
      current: 1,
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
  changeNav: function (e){
    
    if (e.target.dataset.index == this.data.scrollIndex){ return ;}

    this.setData({
      scrollIndex: e.target.dataset.index
    })

    let pageData = this.data.pageData;
    pageData.current = 1;
    pageData.finished = false;

    this.setData({
      pageData: pageData,
      couponList: []
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

    wx.showLoading({ title: '加载中' })

    // 课程接口参数
    let url = app.GO.api + 'customer/coupon/getCouponList';
    let param = {
      pageNo: this.data.pageData.current,
      pageSize: this.data.pageData.pageSize,
      ciCode: app.GO.recommend_customer_id, //获取用户code
      couponStatus: this.data.couponType[this.data.scrollIndex].value,
      couponForm: ''
    };

    app.appRequest('post', url, param, {}, (res) => {
      wx.hideLoading()
      console.log(res)
      if (res.code == 200) {

        let data = res.content.list;
        let couponList = this.data.couponList;
        let pageData = this.data.pageData;

        pageData.total = res.content.count;
        pageData.current++;

        for (let item of data) {

          let color = '', stateImg = '';

          // couponStatus (string, optional): 优惠券状态 0-未使用 1-已使用 2-已过期 3-使用中 
          switch (item.couponStatus) {
            case 0: 
              color = '#0a8'; 
              stateImg = '';
              break;
            case 1: 
              color = '#f09105'; 
              stateImg = '../../../images/image/coupon-icon_01.png'; 
              break;
            case 2: 
              color = '#f8cca4'; 
              stateImg = '../../../images/image/coupon-icon_02.png'; 
              break;
            case 3: 
              color = '#ccc'; 
              stateImg = '../../../images/image/coupon-icon_01.png'; 
              break;
          }

          couponList.push({
            price: item.couponInfo.couponValuePrice,
            content: item.couponInfo.couponTitle,
            time: this.dateFormat(item.couponInfo.couponStartTime) + '-' + this.dateFormat(item.couponInfo.couponEndTime),
            stateImg: stateImg,
            color: color,
            platform: ''
          })
        }

        // 数据全部加载完成
        if (couponList.length >= pageData.total) {

          pageData.finished = true;
          wx.showToast({ title: '没有更多了！', icon: 'none' })

        }

        this.setData({
          couponList: couponList,
          pageData: pageData
        })
        console.log(this.data.couponList)

      } else {

        wx.showToast({ title: res.message })

      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });

  },
  //时间格式化函数，此处仅针对yyyy-MM-dd hh:mm:ss 的格式进行格式化
  dateFormat(time) {
    var date = new Date(time);
    var year = date.getFullYear();
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    // 拼接
    return year + "/" + month + "/" + day;
  },

})