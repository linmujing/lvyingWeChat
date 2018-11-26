// pages/personCenter/goComment/index.js

// 获取上传文件接口地址 正式环境
const BASE_URL = 'http://www.luyingjiaoyu.com/law-web-api/system/file/upload'
// 获取上传文件接口地址 测试环境
// const BASE_URL = 'http://114.115.133.96:8899/law-web-api/system/file/upload';

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 评分
    star1: 5,
    star2: 5,
    // 评论
    comment: '',
    // 评论图片
    productInfo: '',

    productCode:'',
    orderCode:'',

    // 商品信息
    productPrice:'',
    productName:'',
    productProfileUrl:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderCode: options.orderCode,
      productCode: options.productCode,
    })
    // 获取商品详情
    this.getProductInfo();
  },

  /**
   * 星星评价
   */ 
  // 点击星星
  starClick1(e){
    this.setData({ star1: e.target.dataset.index })
  },
  starClick2(e) {
    this.setData({ star2: e.target.dataset.index })
  },
  // 绑定input数据 评论
  bindInput(e) {
    this.setData({
      comment: e.detail.value
    })
  },
  // 删除图片
  deleteImg(){
    this.setData({
      productInfo: ''
    })
  },

  //上传图片
  uploadImage: function () {
    var that = this;

    wx.chooseImage({
      count: 1,  //最多可以选择的图片总数
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有 camera/album
      success: function (res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        //启动上传等待中...
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
        })

        wx.uploadFile({
          url: BASE_URL,
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'image': tempFilePaths[0]
          },
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            that.setData({
              productInfo: data.content 
            })
            
          },
          fail: function (res) {
            wx.hideToast();
            wx.showModal({
              title: '错误提示',
              content: '上传图片失败',
              showCancel: false,
              success: function (res) { }
            })
          }
        });
      }
    });
  },

  // 新增地址
  addCommentData() {
    wx.showLoading({ title: '加载中' })

    // 地址接口参数
    let url = app.GO.api + 'order/comment/addComment';
    let param = {
      "ciCode": app.GO.recommend_customer_id, //获取用户code
      'productCode': this.data.productCode,
      'orderCode': this.data.orderCode,
      'commentPicUrl': this.data.productInfo,
      'commentDesc': this.data.comment,
      'helpConsist': this.data.star1,
      'desConsist': this.data.star2,
    };
    
    app.appRequest('post', url, param, {}, (res) => {
      // console.log(res)
      if (res.code == 200) {

        wx.showModal({
          content: '评价成功！',
          success(res) {
            if (res.confirm) {
              wx.navigateBack();
            } else if (res.cancel) {
              wx.navigateBack();
            }
          }

        })
      } else {
        wx.hideLoading()
      }
      wx.showToast({ title: res.message })
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
      wx.hideLoading()
    });

  },

  // 获取商品详情
  getProductInfo(){
    let that = this ;
    // 接口参数
    let url = app.GO.api + 'product/info/getProductInfo';
    let param = {
      'productCode': this.data.productCode 
    };

    app.appRequest('post', url, param, {}, (res) => {
      console.log(res)
      let data = res.content ;
      if (res.code == 200) {
        that.setData({
          productPrice: data.productPrice,
          productName: data.productName,
          productProfileUrl: data.productProfileUrl
        })
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