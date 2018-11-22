// pages/shopCart/shoppingCart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    //  可用屏幕高度
    windowHeight:  100,

    /*购物车数据*/
    // 全部列表状态
    listState: false,
    // 全部删除状态
    listDeleteState: false,
    // 总价格
    listTotal: '0.00',


    //购物车数据列表大列表
    cartList: [],
    // 购物车删除多个商品存值
    cartId: '',

    /*购物车列表参数*/
    pageNo: 1,
    pageSize: 30,
    dataSize: 0,

    /*删除提示弹框对象*/
    // 删除类型  删除单个 = a  删除选中 = b
    deleteType: 'a',
    // 下标
    index1: 0,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
  * 功能函数 *
  */
  // 设置checkbox 全选或取消全选
  setAllCheckboxChange(e){
    console.log(e)
    this.setData({
      listState: e.detail
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