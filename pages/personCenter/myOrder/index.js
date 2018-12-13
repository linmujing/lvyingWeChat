// pages/personCenter/myOrder/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 订单类型
    orderType: [
      { text: '全部', value: '' },
      { text: '待付款', value: 0 },
      { text: '已付款', value: 1 },
      { text: '已发货', value: 2 },
      { text: '交易成功', value: 3 },
      { text: '交易取消', value: 4 },
      { text: '交易关闭', value: 5 },
    ],
    // 订单列表
    orderList:[],

    // 视口高度
    windowHeight: '',
    // 滚动距离
    scrollWidth: 200 * app.GO.rpxValue,
    // 选项下标 亦为订单类型下标
    scrollIndex: 0,

    // 分页
    pageData: {
      total: 0,
      pageSize: 10,
      current: 1,
      finished: false
    },

    /*一个订单里可能存在多个商品需要评论，或者存在多个需要物流配送的商品 需要以弹框的形式展示*/
    // 商品弹框开关
    showList: false ,
    // 商品弹框数据
    productList: [],
    // 弹框订单状态
    productOrderState: 0,
    // 弹框类型
    productType: 0,
    

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.screenHeight - 91 * app.GO.rpxValue
        })
      }
    })

    this.getData();
  },

  /**
  * 功能函数
  */
  // 切换选项
  changeNav: function (e) {

    let index = e.target.dataset.index;
    if (index == this.data.scrollIndex) { return; }

    this.setData({
      scrollIndex: index,
    })    

    this.resetOrderList();

  },
  // 重置订单数据
  resetOrderList(){

    let pageData = this.data.pageData;
    pageData.current = 1;
    pageData.finished = false;

    this.setData({
      pageData: pageData,
      orderList: []
    })

    this.getData();

  },
  // 去支付
  goPay(e){
    wx.navigateTo({
      url: '../../shopCart/confirmOrder/index?orderCode=' + e.target.dataset.ordercode
    })
  },
  // 重新购买
  againBuy(e){
    var codestr = this.returnCode(e.target.dataset.ordercode);
    wx.navigateTo({
      url: '../../shopCart/submitOrder/index?orderCode=' + codestr
    })
  },
  // 重新购买 获取返回订单商品编码
  // @param code string 获取当前点击的订单单号
  returnCode(code) {

    let codeStr = '';
    let orderList = this.data.orderList;

    for (let lists of orderList) {

      if (code == lists.orderCode) {

        for (let items of lists.orderItem) {

          for (let childs of items.childItem) {

            codeStr = codeStr == '' ? childs.productCode + '-1' : ',' + childs.productCode + '-1';

          }
        }
      }
    }

    return codeStr;
  },

  /* 商品弹框 */
  // 开关
  toggleList() {
    this.setData({
      showList: !this.data.showList
    })
  },
  //待评价 打开弹框
  checkOrder(e){
     
    let orderList = this.data.orderList;
    // 订单下标
    let index = e.target.dataset.index;
    // 按钮类型 <!-- 评价(a)/换货(b)/查看物流(c) -->
    let productType = e.target.dataset.producttype;
    // 当前订单状态
    let productOrderState = orderList[index].orderStatus2;
    let productList = [];
    console.log(productType)
    switch (productType) {
      case 'a':
        // 组合包评论只能针对某一个组合包评论  
        // isCombination (string, optional): 是否是组合包 0- 不是 1-是 
        if ( orderList[index].isCombination == 0) {
          for (let item of  orderList[index].orderItem) {
            for (let child of item.childItem) {
              // if( child.commetStatus == '0' ){
               productList.push(child);
              // }
            }
          }
        } else {
          // 组合包评价
          wx.navigateTo({
            url: '../../personCenter/goComment/index?orderCode=' + orderList[index].orderCode + '&productCode=' + orderList[index].orderItem[0].childItem[0].productcode
          })
          this.goComment(orderCode,  orderList[index].orderItem[0].childItem.productCode)
        }

        break;
      case 'b':
        for (let item of  orderList[index].orderItem) {
          for (let child of item.childItem) {
            if (child.productProperty == '1') {
               productList.push(child);
            }
          }
        }
        break;
      case 'c':
        for (let item of  orderList[index].orderItem) {
          for (let child of item.childItem) {
            if (child.productProperty == '1') {
               productList.push(child);
            }
          }
        }
        break;
    }

    this.setData({
      productList: productList,
      productType: productType,
      productOrderState: productOrderState,

    })

    this.toggleList(); 

  },
  /* 物流 */
  // 查看物流
  // @param orderCode string 获取当前点击的订单单号
  // @param trackNo string 获取当前点击的子订单运单单号
  // @param productCode string 商品编号
  // @param orderMerchantCode string 订单子订单号
  goLogistics(e) {
    let index = e.target.dataset.index;
    let productList = this.data.productList;
    wx.navigateTo({
      url: '../../personCenter/checkLogistics/index?orderCode=' + productList[index].orderCode + '&productCode=' + productList[index].productCode + '&trackNo=' + productList[index].trackNo + '&orderMerchantCode=' + productList[index].orderMerchantCode
    })
  },

  /* 评论 */
  // 去评论
  // @param orderCode string 获取当前点击的订单子单号
  // @param productCode string 获取当前点击的商品编号
  goComment(e) {
    let index = e.target.dataset.index;
    let productList = this.data.productList ;
    wx.navigateTo({
      url: '../../personCenter/goComment/index?orderCode=' + productList[index].orderCode + '&productCode=' + productList[index].productCode
    })
  },

  /**
  * 数据加载
  *
  */
  // 获取订单
  getData() {

    // 没有更多数据了
    if (this.data.pageData.finished) {
      wx.showToast({ title: '没有更多了！', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '加载中', mask: true })

    // 订单接口参数
    let url = app.GO.api + 'order/info/getOrderList';
    let param = {
      pageNo: this.data.pageData.current,
      pageSize: this.data.pageData.pageSize,
      ciCode: app.GO.recommend_customer_id, //获取用户code
      searchKey:''
    };
    if (this.data.orderType[this.data.scrollIndex].value != '') {
      param.orderStatus = this.data.orderType[this.data.scrollIndex].value;
    }

    app.appRequest('post', url, param, {}, (res) => {
      wx.hideLoading()
      console.log(res)
      if (res.code == 200) {

        let data = res.content.list;
        let pageData = this.data.pageData;
        let arr = [], merchantArr = [];

        pageData.total = res.content.count;
        pageData.current++;

        for (let i = 0; i < data.length; i++) {

          let orderItem = [];
          let lists = data[i];

          // isCombination (string, optional): 是否是组合包 0- 不是 1-是 
          // isShow (string, optional): 前端显示 0-显示 1-不显示 ,
          // returnLogisticsShow 控制 物流/换货 按钮显示与隐藏 
          // returnCommentShow 控制评价按钮显示与隐藏 
          arr.push({
            orderTime: lists.createDate,
            orderCode: lists.orderCode,
            isCombination: lists.isCombination,
            orderAmount: lists.orderAmount,
            orderPayAmount: (lists.orderPayAmount).toFixed(2),
            orderStatus2: parseFloat(lists.orderStatus) + 1,
            orderStatus: parseFloat(lists.orderStatus),
            orderCommetStatus: lists.orderCommetStatus,
            isShow: lists.isShow,
            returnLogisticsShow: false,
            returnCommentShow: false,
            orderItem: []
          })



          // 子订单
          for (let x = 0; x < lists.orderMerchantList.length; x++) {

            let childItem = [];
            let items = lists.orderMerchantList[x];

            orderItem.push({
              itemTime: items.createDate,
              itemCode: items.orderMerchantCode,
              itemAmount: items.orderAmount,
              itemName: items.orderProductList[0].merchantInfo.merchantNm,
              itemTrackNo: items.trackNo,
              childItem: []
            })

            // 子订单商品
            for (let z = 0; z < items.orderProductList.length; z++) {

              let child = items.orderProductList[z];
              // commetStatus (string, optional): 订单评价 1-已评价 2-未评价 
              // isExchange (string, optional): 换货状态 0-不需要换货 1-申请换货 2-同意换货 ,
              // orderSource (string, optional): 订单来源 1-PC商城 2-公众号 3-小程序 ,
              childItem.push({
                title: child.productInfo.productTitle,
                name: child.productName,
                desc: child.descConsist,
                productCode: child.productCode,
                price: (child.productPrice).toFixed(2),
                num: child.productCount,
                productProperty: child.productProperty,
                commetStatus: child.commetStatus,
                isExchange: child.isExchange,
                itemTrackNo: items.trackNo,
                orderCode: lists.orderCode,
                orderMerchantCode: items.orderMerchantCode,
                productProfileUrl: child.productInfo.productProfileUrl,
                total: (parseFloat(child.productPrice * 10000) * child.productCount) / 10000
              })
              
              // 评价按钮
              if (arr[i].orderStatus == 3 ){
                child.commetStatus == '0' ? arr[i].returnCommentShow = true : '';
              }
              // 物流/换货按钮
              if (arr[i].orderStatus == 2) {
                child.productProperty == '1' ? arr[i].returnLogisticsShow = true : '';
              }

            }

            orderItem[x].childItem = childItem;

          }

          arr[i].orderItem = orderItem;
        }

        let orderList = [];
        for (let item of this.data.orderList) { orderList.push(item) }

        orderList = orderList.concat(arr);

        // 没有任何订单终止执行
        if (orderList.length == 0){ return }

        // 数据全部加载完成
        if (orderList.length >= pageData.total) {

          pageData.finished = true;
          if (pageData.current != 2){
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
  // 取消订单
  cancelOrderItem(e) {

    let that = this;
    // 订单接口参数
    let url = app.GO.api + 'order/info/cancleOrder';
    let param = {
      'orderCode': e.target.dataset.ordercode
    };

    wx.showModal({
      content: '确定取消该订单吗？',
      success(res) {
        if (res.confirm) {

          app.appRequest('post', url, param, {}, (res) => {
            console.log(res)
            if (res.code == 200) {
              
              wx.showToast({ title: '取消成功' })
              // 重置数据
              setTimeout(() => { that.resetOrderList(); },1000)
              
            }
          }, (err) => {
            console.log('请求错误信息：  ' + err.errMsg);
          });

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  // 删除订单
  deleteOrderItem(e){

    let that = this;
    // 订单接口参数
    let url = app.GO.api + 'order/info/hideOrder';
    let param = {
      'orderCode': e.target.dataset.ordercode
    };

    wx.showModal({
      content: '确定删除该订单吗？',
      success(res) {
        if (res.confirm) {

          app.appRequest('post', url, param, {}, (res) => {
            console.log(res)
            if (res.code == 200) {

              wx.showToast({ title: '删除成功' })
              // 重置数据
              setTimeout(() => { that.resetOrderList(); }, 1000)

            }
          }, (err) => {
            console.log('请求错误信息：  ' + err.errMsg);
          });

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 换货
  // @param orderCode string 获取当前点击的订单单号
  // @param productCode string 获取当前点击的商品编号
  productChange(e) {
    let index = e.target.dataset.index;
    let productList = this.data.productList;
    let that = this;
    let url = app.GO.api + 'order/product/orderProductExchange';
    let param = {
      'ciCode': app.GO.recommend_customer_id, //获取用户code
      'orderCode': productList[index].orderCode,
      'productCode': productList[index].productCode,
    };

    app.appRequest('post', url, param, {}, (res) => {
      console.log(res)
      if (res.code == 200) {

        wx.showToast({ title: '申请换货成功' })
        // 重置数据
        setTimeout(() => { that.resetOrderList(); }, 1000)

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