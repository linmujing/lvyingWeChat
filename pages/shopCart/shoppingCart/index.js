  // pages/shopCart/shoppingCart/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    //  可用屏幕高度
    windowHeight: app.GO.windowHeight - 294 * app.GO.rpxValue,

    /*购物车数据*/
    // 全部列表状态
    listState: false,
    // 总价格
    listTotal: '0.00',

    //购物车数据列表大列表
    cartList: [],
    // 购物车删除多个商品存值
    cartId: '',

    /*购物车列表参数*/
    pageNo: 1,
    pageSize: 30,

    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

     // 获取购物车列表
    this.getCartListData();

    // 设置监听购物车状态
    this.setData({
      cartState: wx.getStorageSync('cartState')
    })
    

  },
  /**
  * 功能函数 *
  */
  // 跳转到详情
  toDetail(e) {
    // console.log(e)
    var code = e.currentTarget.dataset.code;
    wx.navigateTo({
      url: '../../shopMall/detail/detail?code=' + code 
    })
  },
  // 组合包的展示与显示
  showCombination(e){

    let index = e.currentTarget.dataset.index1;
    let cartList = this.data.cartList;

    cartList[index].itemsShow = !cartList[index].itemsShow;

    this.setData({
      cartList: cartList
    })

  },
  // 去结算页面
  goBuy() {

    let cartList = this.data.cartList ;

    let CodeAndCount = '';

    // 限制组合包为单个下单
    let typeNum = 0, typeNum2 = 0;

    for (let item of cartList) {

      if (item.itemType == '2') {

        if (item.itemState) {

          CodeAndCount += CodeAndCount == '' ? `${item.productCode}-${item.num}` : `,${item.productCode}-${item.num}`;
          typeNum++;

        }

      } else {

        for (let item2 of item.items) {

          if (item2.state) {

            CodeAndCount += CodeAndCount == '' ? `${item2.productCode}-${item2.num}` : `,${item2.productCode}-${item2.num}`;
            typeNum2++;

          }
        }

      }

    }

    if (CodeAndCount == '') { wx.showToast({ title: '请选择商品！', icon: 'none' }); return; }

    if (typeNum > 1) { wx.showToast({ title: '组合包只能单独下单！', icon: 'none' }); return; }

    if (typeNum > 0 && typeNum2 > 0) { wx.showToast({ title: '组合包只能单独下单！', icon: 'none' }); return; }

    // 去结算页面
    wx.navigateTo({
      url: '../submitOrder/index?productCode='+ CodeAndCount + '&sourceType=cart'
    })

  },
  // 修改商品数量
  changeNunmber(e){

    let cartList = this.data.cartList;
    let index1 = e.target.dataset.index1, index2 = e.target.dataset.index2;
    cartList[index1].items[index2].num = e.detail ;

    this.setData({
      cartList: cartList
    });

    this.calculatePrice();
  },

  /*checkbox监听*/
  //商品选择
  //@param index1 购物车大列表下标
  checkboxChange(e) {
    // console.log(e)
    let index1 = e.target.dataset.index1, index2 = e.target.dataset.index2 ;

    let cartList = this.data.cartList ;

    if (index2 == undefined) {

      // 监听商户下所有商品是否选中
      cartList[index1].itemState = e.detail ;
      let states = cartList[index1].itemState;

      for (let i = 0; i < cartList[index1].items.length; i++) {

        cartList[index1].items[i].state = states;

      }

    } else {

      cartList[index1].items[index2].state = e.detail ;

      // 只有商户下有一个没有被选中，商户的就不选中
      let states = true;

      for (let i = 0; i < cartList[index1].items.length; i++) {

        if (!cartList[index1].items[i].state) {
          states = false;
        }

      }

      cartList[index1].itemState = states;

    }

    // 所有选项是否全部选中
    let AllStates = true;

    for (let i = 0; i < cartList.length; i++) {

      if (cartList[i].itemType == '1') {

        for (let x = 0; x < cartList[i].items.length; x++) {

          if (!cartList[i].items[x].state) {

            AllStates = false;

          }

        }

      } else {

        if (!cartList[i].itemState) {

          AllStates = false;

        }

      }

    }

    this.setData({
      cartList: cartList,
      listState: AllStates

    })

    //计算小计与合计
    this.calculatePrice();

  },

  // 设置checkbox 全选或取消全选
  setAllCheckboxChange(e) {

    this.setData({
      listState: e.detail
    });

    let cartList = this.data.cartList ;

    // 获取全选大列表状态
    let isAll = this.data.listState;

    let n = this.data.cartList.length;

    for (let i = 0; i < n; i++) {

      cartList[i].itemState = isAll;

      if (cartList[i].itemType == '1') {

        for (let x = 0; x < cartList[i].items.length; x++) {

          cartList[i].items[x].state = isAll;

        }

      }
    }

    this.setData({
      cartList: cartList
    })

    // 计算小计与合计
    this.calculatePrice()

  },

  /*购物车数据计算*/
  // 计算小计与合计
  calculatePrice() {

    //获取商品个数
    let m = this.data.cartList.length;
    let cartList = this.data.cartList ;

    //计算小计
    for (let x = 0; x < m; x++) {

      let n = cartList[x].items.length;

      if (cartList[x].itemType == '1') {

        //重置小计
        cartList[x].itemTotal = 0;

        for (let i = 0; i < n; i++) {

          let item = cartList[x].items[i];

          //判断是否选中
          if (item.state) {

            cartList[x].itemTotal += item.num * (item.price * 10000);

          }

        }

        cartList[x].itemTotal = (cartList[x].itemTotal / 10000).toFixed(2);

      } else {

        //重置小计
        cartList[x].itemTotal = 0;

        if (cartList[x].itemState) {
          cartList[x].itemTotal = (cartList[x].price).toFixed(2);
        }

      }

    }

    //重置合计
    let listTotal = 0;

    //计算合计
    for (let i = 0; i < m; i++) {

      let item = cartList[i];

      //判断是否选中
      listTotal += item.itemTotal * 10000;

    }

    listTotal = (listTotal / 10000).toFixed(2);

    this.setData({
      cartList: cartList,
      listTotal: listTotal
    })
  },

  //删除组合包商品
  deleteGroup(e){

    this.setData({
      cartId: e.target.dataset.cartId
    })

    let that = this;
    wx.showModal({
      content: '确定删除该商品吗？',
      success(res) {
        if (res.confirm) {
          that.deleteCartItemData();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //删除选中商品
  deleteChoose() {

    //获取商品个数
    let cartList = this.data.cartList;
    //购物车商品编码
    let cartId = '';

    //判断是否有选中
    for (let x = 0; x < cartList.length; x++) {

      let n = cartList[x].items.length;

      //判断是否选中 先判断组合包是否选中 
      if (cartList[x].itemType == '2' && cartList[x].itemState) {
        cartId == '' ? cartId = cartList[x].cartId : cartId += ',' + cartList[x].cartId;
      } else {
        for (let i = 0; i < n; i++) {
          let item = cartList[x].items[i];
          //判断是否选中
          if (item.state) {
            cartId == '' ? cartId = item.cartId : cartId += ',' + item.cartId;
          }
        }
      }

    }

    if (cartId == '') {
      wx.showToast({ title: '您还没有选择商品！',icon: 'none' })
      return;
    }

    this.setData({
      cartId: cartId
    })

    let that = this;
    wx.showModal({
      content: '确定删除选中的商品吗？',
      success(res) {
        if (res.confirm) {
          that.deleteCartItemData();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //清除购物车全选
  clearCart(){
    this.setData({
      listState: false,
      listTotal: '0.00',
    })
  },

  /**
  * 获取数据 *
  */
  // 获取购物车列表
  getCartListData() {

   wx.showLoading({ title: '加载中', mask: true })

    // 购物车接口参数
    let url = app.GO.api + 'customer/cart/getCartList';
    let param = { 'pageNo': this.data.pageNo, 'pageSize': this.data.pageSize, 'ciCode': app.GO.recommend_customer_id };

    app.appRequest('post', url, param, {}, (res) => {
       console.log(res)
      if (res.code == 200) {

        let data = res.content.list;
        // 购物车商品商户分类
        let arr = [], merchantArr = [];

        for (let i = 0; i < data.length; i++) {
          console.log(data[i].productInfo.productType)
          // productType 为1时，该商品为单个商品  为2时，商品为组合包
          if (data[i].productInfo.productType == '1') {

            // 单个商品
            let index = merchantArr.indexOf(data[i].merchantInfo.merchantNm);

            if (index == -1) {

              merchantArr.push(data[i].merchantInfo.merchantNm);

              // 压入商户
              arr.push({
                id: '',
                itemType: data[i].productInfo.productType,
                itemState: false,
                itemTitle: data[i].merchantInfo.merchantNm,
                itemTotal: '0.00',
                //小列表
                items: []
              });

              index = merchantArr.indexOf(data[i].merchantInfo.merchantNm);

              // 压入商品
              arr[index].items.push({
                cartId: data[i].id,
                productCode: data[i].productCode,
                state: false,
                price: data[i].productInfo.productPrice,
                num: 1,//data[i].productInfo.productNum,
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
                price: data[i].productInfo.productPrice,
                num: 1,//data[i].productCount,
                productTitle: data[i].productInfo.productTitle,
                describe: data[i].productInfo.productDesc,
                imgSrc: data[i].productInfo.productProfileUrl
              })

            }

          } else {

            // 组合包商品
            merchantArr.push(data[i].productCode);

            // 压入组合包
            arr.push({
              id: '',
              cartId: data[i].id,
              itemType: data[i].productInfo.productType,
              itemState: false,
              itemTitle: data[i].productInfo.productTitle,
              price: data[i].productInfo.productPrice,
              imgSrc: data[i].productInfo.productProfileUrl,
              itemsShow: false,
              itemTotal: 0.00,
              productCode: data[i].productCode,
              num: 1,
              productSubCode: data[i].productInfo.productSubCode,
              //小列表
              items: []
            });

          }

        }

        // 压入到购物车
        this.setData({
          cartList : arr
        })
        // 购物车二次加载 获取组合包的值
        this.getGroupCartItem()

      } else {

        wx.hideLoading();
        wx.showToast({title: res.data.message, icon: 'none'});

      }

      this.clearCart();


    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });

  },

  // 购物车二次加载 获取组合包的值
  getGroupCartItem() {
    let that = this ;
    // 获取购物车一次加载列表
    let CartList = [];
    for (let items of this.data.cartList ){ CartList.push(items)}

    for (let i = 0; i < CartList.length; i++) {

      if (CartList[i].itemType == '2') {
        
        // 接口参数 获取橱窗推荐商品接口 可以同时获取多个商品
        let url = app.GO.api + 'product/info/getShowCaseProduct';
        let param = {
          'productCode': CartList[i].productSubCode 
        };

        app.appRequest('post', url, param, {}, (res) => {
          // console.log(res)
          if (res.code == 200) {

            let Data = res.content;

            // 对组合包里的商品进行商户分类
            let arr2 = [], merchantArr2 = [];

            for (let child of Data) {

              let childIndex = merchantArr2.indexOf(child.merchantCode);

              if (childIndex == -1) {

                merchantArr2.push(child.merchantCode);

                arr2.push({
                  id: '',
                  itemTitle: child.merchantNm,
                  itemTotal: 0.00,
                  //小列表
                  items: []
                })

                childIndex = merchantArr2.indexOf(child.merchantCode);

                // 压入商品
                arr2[childIndex].items.push({
                  productCode: child.productCode,
                  price: child.productPrice,
                  num: 1, //child.productNum,
                  productTitle: child.productTitle,
                  describe: child.productDesc,
                  imgSrc: child.productProfileUrl
                })

              } else {

                // 压入商品
                arr2[childIndex].items.push({
                  productCode: child.productCode,
                  price: child.productPrice,
                  num: 1,//child.productNum,
                  productTitle: child.productTitle,
                  describe: child.productDesc,
                  imgSrc: child.productProfileUrl
                })

              }

            }
            // console.log(arr2)

            CartList[i].items = arr2;

            this.setData({
              cartList: CartList
            })

          } else {

            wx.showToast({title: res.data.message, icon: 'none'});

          }
          
        }, (err) => {
          console.log('请求错误信息：  ' + err.errMsg);
        });

      }
    }
    wx.hideLoading();
  },

  // 删除订单
  deleteCartItemData() {

    let cartId = this.data.cartId ;

    let that = this;
    // 接口参数
    let url = app.GO.api + 'customer/cart/deleteCart';
    let param = { 'recordId': cartId }

    app.appRequest('post', url, param, {}, (res) => {
        console.log(res)
        if (res.code == 200) {

          wx.showToast({ title: '删除成功' })
          // 重置数据
          setTimeout(() => { that.getCartListData(); }, 1000)

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

    // 监听购物车数据变化
    var cartState = wx.getStorageSync('cartState')
    if (cartState != this.data.cartState){
      // 重新加载页面数据
      this.getCartListData();
    }
    this.setData({
      cartState: cartState
    })  


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