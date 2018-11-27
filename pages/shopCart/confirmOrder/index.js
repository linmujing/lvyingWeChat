// pages/shopCart/confirmOrder/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 高度
    windowHeight: 0,

    // 总价格
    listTotal: 0.00,
    // 商品列表
    cartList: [],
    // 总价格
    listTotal: 0.00,
    allTotal: 0.00,
    // 优惠价格
    discount:'',

    // 订单编号
    orderCode: '',

    /*优惠券弹框*/
    showList: false,
    chosenCoupon: -1,
    coupons: [],
    couponName: '去选择',
    couponCode: 0,

  },

  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    
    this.setData({
      orderCode: options.orderCode
    })

    // 获取订单详情商品数据
    this.getOrderProduct();
  },

  /*订单数据计算*/
  // 计算小计与合计
  calculatePrice() {

    // 获取商品个数
    let m = this.data.cartList.length;
    // 获取商品列表
    let cartList = this.data.cartList;

    // 计算小计
    for (let x = 0; x < m; x++) {

      let n = cartList[x].items.length;

      // 重置小计
      cartList[x].itemTotal = 0;

      for (let i = 0; i < n; i++) {

        let item = cartList[x].items[i];

        cartList[x].itemTotal += item.num * (item.price * 10000);

      }

      cartList[x].itemTotal = (cartList[x].itemTotal / 10000).toFixed(2);

    }

    this.setData({
      cartList: cartList
    })

    wx.hideLoading()

  },  
  // 优惠计算
  discountPrice(){
    let discount = (parseFloat(this.data.allTotal) - parseFloat(this.data.listTotal)).toFixed(2) ;
    this.setData({
      discount: discount
    })
  },

  /* 优惠券 */
  // 打开优惠券
  openCoupon(){
    // 没有优惠券禁止弹出
    if ( this.data.coupons.length == 0){
      return 
    }
    this.setData({
      showList: true
    })
  },
  // 关闭优惠券
  closeCoupon() {
    this.setData({
      showList: false
    })
  },
  // 选择优惠券
  changeCoupon(e){
    this.setData({
      chosenCoupon: e.target.dataset.index,
      couponCode: e.target.dataset.couponcode
    })
    this.closeCoupon();
    this.getOrderCouponTotal();

  },

  /**数据**/
  // 获取订单详情商品数据
  getOrderProduct() {

    wx.showLoading({ title: '加载中', mask: true });

    // 接口参数
    let url = app.GO.api + 'order/product/getOrderProductList';
    let param ={
      'pageNo': 1,
      'pageSize': 20,
      'orderCode': this.data.orderCode 
      };

    app.appRequest('post', url, param, {}, (res) => {
      console.log(res)
      if (res.code == 200) {

        let data = res.content.list, arr = [], merchantArr = [];
        
        for (let i = 0; i < data.length; i++) {

          let index = merchantArr.indexOf(data[i].merchantInfo.merchantNm);
          console.log(index)

          if (index == -1) {

            merchantArr.push(data[i].merchantInfo.merchantNm);

            // 压入商户
            arr.push({
              id: '',
              itemState: false,
              itemTitle: data[i].merchantInfo.merchantNm,
              itemCode: data[i].merchantInfo.merchantCode,
              itemTotal: 0.00,
              //小列表
              items: []
            });

            index = merchantArr.indexOf(data[i].merchantInfo.merchantNm);

            // 压入商品
            arr[index].items.push({
              cartId: data[i].id,
              productCode: data[i].productCode,
              state: false,
              price: data[i].productPrice,
              num: data[i].productCount,
              productTitle: data[i].productInfo.productTitle,
              describe: data[i].productInfo.productDesc,
              imgSrc: data[i].productInfo.productProfileUrl
            })

          } else {

            // 压入商品
            arr[index].items.push({
              cartId: data[i].id,
              productCode: data[i].productCode,
              state: false,
              price: data[i].productPrice,
              num: data[i].productCount,
              productTitle: data[i].productInfo.productTitle,
              describe: data[i].productInfo.productDesc,
              imgSrc: data[i].productInfo.productProfileUrl
            })

          }

        }
        console.log(arr)
        // 压入到购物车
        this.setData({
          cartList : arr
        })
        
        // 计算小计与合计
        this.calculatePrice();
        // 获取订单详情 获取订单金额
        this.getOrderDetail();
        // 获取订单可用优惠券
        this.getOrderCoupon();

      } else {
          wx.showToast({title: res.message, icon: 'none'});
      }

      wx.hideLoading();

    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });

  },
  // 获取订单金额
  getOrderDetail() {

    // 接口参数
    let url = app.GO.api + 'order/info/getOrderInfo';
    let param = { 'orderCode': this.data.orderCode }

    app.appRequest('post', url, param, {}, (res) => {
      console.log(res)
      if (res.code == 200) {
        this.setData({
          listTotal: (res.content.orderPayAmount).toFixed(2) ,
          allTotal: (res.content.orderPayAmount).toFixed(2)
        })
        // 计算优惠金额
        this.discountPrice()
      } else {
        wx.showToast({title: res.message, icon: 'none'});
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });

  },
  // 获取订单可用优惠券
  getOrderCoupon() {
    // 接口参数
    let url = app.GO.api + 'order/info/getOrderCoupon';
    let param = { 'ciCode': app.GO.recommend_customer_id, 'orderCode': this.data.orderCode, 'orderAmount': this.data.listTotal}

    app.appRequest('post', url, param, {}, (res) => {
      console.log(res)
      if (res.code == 200) {
        let data = res.content, arr = [];
        for (let item of data) {

          arr.push({
            couponCode: item.couponCode,
            available: 1,
            discount: 0,
            denominations: item.couponInfo.couponValuePrice ,
            originCondition: item.couponInfo.couponDoorPrice ,
            reason: '',
            value: item.couponInfo.couponValuePrice ,
            name: item.couponInfo.couponTitle,
            startAt: item.couponInfo.couponStartTime,
            endAt: item.couponInfo.couponEndTime
          })
        }

        this.setData({
          coupons : arr,
          couponName: arr.length == 0 ? '没有可用优惠券' : '请选择'
        })
        console.log(arr)

      } else {
        wx.showToast({title: res.message, icon: 'none'});
      }

    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });

  },
  // 获取选择优惠券后的价格
  getOrderCouponTotal() {
    // 接口参数
    let url = app.GO.api + 'order/info/getOrderCouponAmount';
    let param = { 'couponCode': this.data.couponCode, 'orderCode': this.data.orderCode, 'orderAmount': this.data.allTotal}

    app.appRequest('post', url, param, {}, (res) => {
      console.log(res)
      if (res.code == 200) {
        let data = res.content;
        this.setData({
          listTotal: (res.content.orderPayAmount).toFixed(2),
          couponName: this.data.coupons[this.data.chosenCoupon].name
        })
      }else{
        this.setData({
          chosenCoupon: -1
        })
      }
        wx.showToast({title: res.message, icon: 'none'});
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