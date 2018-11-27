// pages/shopMall/detail/detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData: {},
    subTab: ['简介', '全程动态管控系统', '商品评价'],
    curSubTab: 0,
    typeId: 0,
    showCourse: false,
    // 商户信息对象
    merchantInfo: {},
    merchantCode: '',
    productCode: '',
    // 优惠券
    cuponList: [],
    couponModel: true,
    // 课程数据
    productSection: [],
    proSection: '',
    // 动态管控课程
    sectionNav: [],
    sectionList: [],
    sectionSize: 6,
    sectionCont: 0,
    sectionIndex: 0,
    classCur: 0,
    courseBtn: false,
    //星星数量
    star: 0,
    // 评价列表
    evaluateList: [],
    eTotal: 0,
    eSize: 3,
    // 推荐产品
    recommendList: [],
    showCourse: false,
    // 如果是实物
    typeBook: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetailData(options.code)
    this.setData({
      productCode: options.code,
      typeId: options.typeId
    })
    // this.getDetailData('P154056503511492')
    // this.setData({
    //   productCode: 'P154056503511492',
    //   typeId: 3
    // })
    this.getEvaluateList()
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
        // 获取商户信息
        that.getMerchantInfo(result.merchantCode)
        // 获取优惠券
        that.getProductCoupon(code, result.merchantCode)
        //获取推荐产品
        if (!result.productRecommendCode == '' || !result.productRecommendCode == null) {
          this.getProductShowCase(result.productRecommendCode)
        }
        
        that.setData({
          detailData: result,
          merchantCode: result.merchantCode,
          // 课程目录
          productSection: JSON.parse(result.productSection),
          proSection: result.productSection,
          // 动态管控列表
          sectionNav: result.productSectionIndexList,
          sectionIndex: result.productSectionIndexList.length > 0 ? result.productSectionIndexList[0].sectionIndex : 0,
          sectionList: result.productSectionList,
          // 星星评分
          star: result.productScore,
        })
      } else {

        wx.showToast({ title: res.message, icon: 'none' })

      }
    }, (err) => {
      wx.hideLoading()
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  // 获取商户详细信息
  getMerchantInfo(code) {
    var that = this;
    // 接口参数
    let url = app.GO.api + 'merchant/info/getMerchantInfo';
    let param = { merchantCode: code };
    app.appRequest('post', url, param, {}, (res) => {
      // console.log(res)
      if (res.code == 200) {
        that.setData({
          merchantInfo: res.content
        })
      } else {

        wx.showToast({ title: res.message, icon: 'none' })

      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  // 获取优惠券
  getProductCoupon(pcode, mcode) {
    var that = this;
    // 接口参数
    let url = app.GO.api + 'coupon/info/getCouponList';
    let param = { pageNo: 1, pageSize: 1000, productCode: pcode, merchantCode: mcode };
    app.appRequest('post', url, param, {}, (res) => {
      // console.log(res)
      if (res.code == 200) {
        var list = res.content.list
        for(var i=0;i<list.length;i++){
          list[i].couponEndTime = that.dateFormat(list[i].couponEndTime)
          list[i].couponStartTime = that.dateFormat(list[i].couponStartTime)
        }
        that.setData({
          cuponList: list
        })
      } else {

        wx.showToast({ title: res.message, icon: 'none' })

      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  // 跳转到提供商店铺
  goStore(){
    wx.navigateTo({
      url: '../../shopMall/supplierStore/supplierStore?code=' + this.data.detailData.merchantCode,
    })
  },
  showCoupon(){
    this.setData({
      couponModel: false
    })
  },
  hideCoupon() {
    this.setData({
      couponModel: true
    })
  },
  // 选择优惠券
  selectCoupon(e){
    var code = e.currentTarget.dataset.code;
    var form = e.currentTarget.dataset.form;
    var ciCode = app.GO.recommend_customer_id;
    var that = this;
    if (ciCode == null || ciCode == "null" || ciCode == undefined) {
      wx.showToast('您还没有登录，请登录后再尝试！');
      return;
    }
    // 接口参数
    let url = app.GO.api + 'customer/coupon/addCoupon';
    let param = { ciCode: ciCode, couponCode: code, couponForm: form };
    app.appRequest('post', url, param, {}, (res) => {
      // console.log(res)
      if (res.code == 200) {
        wx.showToast({ title: '领取成功', icon: 'success' })
        // 刷新优惠券列表
        that.getProductCoupon(that.data.productCode, that.data.merchantCode)
      } else {

        wx.showToast({ title: res.message, icon: 'none' })

      }
    }, (err) => {
      wx.showToast({ title: '领取失败', icon: 'none' })
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  // 切换在导航
  clickSubTab(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      curSubTab: index
    })
  },
  // 查看全程动态管控详情
  courseStates() {
    this.setData({
      courseBtn: true
    })
  },
  // 选择动态管控课程
  classBtn(e) {
    var index = e.currentTarget.dataset.index;
    var sectionIndex = e.currentTarget.dataset.sindex;
    this.setData({
      classCur: index,
      sectionIndex: sectionIndex
    })
    this.getSectionIndex()
  },
  // 获取动态管控列表
  getSectionIndex() {
    var that = this;
    // 接口参数
    let url = app.GO.api + 'product/info/getProductSectionIndexContent';
    let param = { pageNo: 1, pageSize: that.data.sectionSize, productSectionIndex: that.data.sectionIndex, productSection: that.data.proSection };
    app.appRequest('post', url, param, {}, (res) => {
      console.log(res)
      if (res.code == 200) {
        
      } else {

        wx.showToast({ title: 111, icon: 'none' })

      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  // 获取评价列表
  getEvaluateList() {
    var that = this;
    // 接口参数
    let url = app.GO.api + 'order/comment/getProductCommentList';
    let param = { pageNo: 1, pageSize: that.data.eSize, productSectionIndex: that.data.sectionIndex, productCode: that.data.productCode };
    app.appRequest('post', url, param, {}, (res) => {
      // console.log(res)
      if (res.code == 200) {
        that.setData({
          evaluateList: res.content.list,
          eTotal: res.content.count
        })
      } else {

        wx.showToast({ title: res.message, icon: 'none' })

      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  // 查看更多评价
  seeMore() {
    var that = this
    var pageSize = that.data.eSize
    if (pageSize >= that.data.eTotal) {
      wx.showToast({ title: '已经没有更多了', icon: 'none' })
      return
    }
    pageSize += 3
    that.setData({
      eSize: pageSize
    })
    that.getEvaluateList()
  },
  //获取推荐列表或猜你喜欢
  getProductShowCase(code) {
    var that = this;
    // 接口参数
    let url = app.GO.api + 'product/info/getShowCaseProduct';
    let param = { productCode: code };
    app.appRequest('post', url, param, {}, (res) => {
      console.log(res)
      if (res.code == 200) {
        var result = []
        if (res.content.length > 2) {
          for (var i = 0; i < 2; i++) {
            result.push(res.content[i])
          }
        } else {
          result = res.content
        }
        that.setData({
          recommendList: result
        })
      } else {

        wx.showToast({ title: res.message, icon: 'none' })

      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  // 跳转到详情
  toDetail(e) {
    // console.log(e)
    var code = e.currentTarget.dataset.code;
    wx.navigateTo({
      url: '../../shopMall/detail/detail?code=' + code,
    })
  },
  //时间格式化函数，此处仅针对yyyy-MM-dd hh:mm:ss 的格式进行格式化
  dateFormat: function (time) {
    var date = new Date(time);
    var year = date.getFullYear();
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    // 拼接
    return year + "-" + month + "-" + day;
  },
  // 图片预览
  clickPic(e){
    var url = e.currentTarget.dataset.url;
    var index = e.currentTarget.dataset.index;
    var arr = url.split(',')
    wx.previewImage({
      current: arr[index], // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
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