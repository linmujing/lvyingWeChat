// pages/shopCart/submitOrder/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 总价格
    listTotal: 0.00,
    // 商品列表
    cartList: [],

    // 是否为组合包
    isGroup: false,
    // 是否从购物车下单
    sourceType: '',

    /*收货地址数据*/
    addressList: {
      addressCode: '',
      name: '',
      phone: '',
      province: { value: '', label: '' },
      city: { value: '', label: '' },
      county: { value: '', label: '' },
      addressDetail: '',
    },

    // 是否存在实物商品
    hasStore: false ,
    

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户地址列表
    this.getAddressData();

    // 判断是否为从购物车来的商品
    if (options.sourceType = 'cart'){
      this.setData({
        sourceType : 'cart'
      })
    }
  
    // 获取页面数据来源
    if (options.productCode.split(',').length == 1) {
      this.getProductDetailData(options.productCode);
    } else {
      this.getProductCartData(options.productCode);
    }
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
  // 跳转到地址页面
  goAddress(){
    wx.navigateTo({
      url: '../../personCenter/myAddress/index?value=a'
    })
  },
  // 计算小计与合计
  calculatePrice() {

    let cartList = this.data.cartList;
    let listTotal = this.data.listTotal;
    console.log(listTotal)

    // 获取商品个数
    let m = cartList.length;

    if (!this.data.isGroup) {

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

      // 重置合计
      listTotal = 0;

      // 计算合计
      for (let i = 0; i < m; i++) {

        let item = cartList[i];

        listTotal += item.itemTotal * 10000;

      }
      listTotal = (listTotal / 10000).toFixed(2);

    } else {

      // 组合包
      for (let i = 0; i < m; i++) {

        cartList[i].itemTotal = (cartList[i].price ).toFixed(2);

      }

      listTotal = cartList[0].itemTotal;
    }


    this.setData({
      cartList: cartList,
      listTotal: listTotal,
    })

    wx.hideLoading()

  },
  // 修改商品数量
  changeNunmber(e) {

    let cartList = this.data.cartList;
    let index1 = e.target.dataset.index1, index2 = e.target.dataset.index2;
    cartList[index1].items[index2].num = e.detail;

    this.setData({
      cartList: cartList
    });

    this.calculatePrice();
  },

  /** 
  * 获取数据函数 *
  */
  // 获取我的地址
  getAddressData(){

    // 地址接口参数
    let url = app.GO.api + 'customer/address/getAddressList';
    let param = {
      pageNo: 1,
      pageSize: 10,
      ciCode: app.GO.recommend_customer_id, //获取用户code
    };

    app.appRequest('post', url, param, {}, (res) => {
      // console.log(res)
      if (res.code == 200) {

        let data = res.content.list;
        let addressList = {};
        // 判断是否有地址
        if (data.length == 0 ) { return }

        addressList = {
          addressCode: data[0].addressCode,
          name: data[0].addressPersonName,
          phone: data[0].addressPhone,
          province: { value: data[0].province, label: data[0].province },
          city: { value: data[0].city, label: data[0].city },
          county: { value: data[0].zone, label: data[0].zone },
          addressDetail: data[0].address,
          isDefalut: data[0].isDefalut,
        }

        this.setData({
          addressList: addressList,
        })
        console.log(this.data.addressList)

      } else {

        wx.showToast({ title: res.message })

      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    })
  },

  /*订单提交 生成订单*/
  submitOrderClick() {

    if (this.data.hasStore && this.data.addressList.addressCode == '') {
      wx.showToast({title: "请先填写好订单地址！", icon: 'none'});
      return;
    }

    wx.showLoading({ title: '加载中', mask: true })

    // 接口参数
    let url = app.GO.api + 'order/info/addOrderInfo';
    let param = this.getOrderParam();
    console.log(param)

    app.appRequest('post', url, param, {}, (res) => {
      console.log(res)
      if (res.code == 200) {

        // 创建订单成功时, 修改购物车状态
        let cartState = wx.getStorageSync('cartState') ; 
        wx.setStorageSync('cartState', parseFloat(cartState)+1 )

        // 去结算页面
        wx.navigateTo({
          url: '../confirmOrder/index?orderCode=' + res.content 
        })
      } else {
        wx.showToast({title: res.message, icon: 'none'});
      }
      wx.hideLoading()
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });

  },
  // 获取创建订单参数
  getOrderParam() {

    let productCodeAndCount = '';
    let cartList = this.data.cartList ;

    if (!this.data.isGroup) {

      for (let lists of cartList) {

        for (let items of lists.items) {

          productCodeAndCount += productCodeAndCount == '' ? items.productCode + '-' + items.num : ',' + items.productCode + '-' + items.num;

        }

      }
    } else {

      productCodeAndCount = cartList[0].productCode + '-1';

    }

    // 如果没有实物商品，则不需要写地址
    let addressCode = this.data.hasStore ? this.data.addressList.addressCode : '';

    // orderForm 下单入口 0-购物车 1-非购物车
    // orderSource 订单来源 1 - PC商城 2 - 公众号 3 - 小程序
    let param = {
      ciCode: app.GO.recommend_customer_id, //获取用户code,
      ciName: app.GO.recommend_customer_name , //获取用户name
      orderSource: 3,
      orderForm: this.data.sourceType != 'cart' ? 1 : 0,
      productCodeAndCount: productCodeAndCount,
      addressCode: addressCode,
    }

    return param;

  },

  /**获取产品的数据**/
  // 获取产品详情数据
  getProductDetailData(productCode) {

    let isCart = productCode.indexOf('-'), cartCode = productCode, cartNun = 1;

    // 如果是从购物车来的数据
    if (isCart != -1) {

      cartCode = productCode.split('-')[0];
      cartNun = productCode.split('-')[1];

    }

    wx.showLoading({ title: '加载中', mask: true })

    // 接口参数
    let url = app.GO.api + 'product/info/getProductInfo';
    let param = { 'productCode': cartCode }

    app.appRequest('post', url, param, {}, (res) => {

      console.log(res)

      if (res.code == 200) {

        let data = res.content, arr = [];

        // productProperty为1时，商品存在实物，实物才有地址选择
        if (data.productProperty.indexOf('1') != -1) {
          this.setData({
            hasStore: true
          }) ;
        }

        // 单个商品
        if (data.productType != '2') {

          // 压入商户
          arr.push({
            id: '',
            itemType: data.productType,
            itemState: false,
            itemTitle: data.merchantNm,
            itemCode: data.merchantCode,
            itemTotal: 0.00,
            //小列表
            items: []
          });

          // 压入商品
          arr[0].items.push({
            id: data.id,
            productCode: data.productCode,
            state: false,
            price: data.productPrice,
            num: parseFloat(cartNun),
            productTitle: data.productTitle,
            describe: data.productDesc,
            imgSrc: data.productProfileUrl
          })

        } else {

          // 组合包商品
          // 压入组合包
          arr.push({
            id: '',
            itemType: data.productType,
            itemState: false,
            itemTitle: data.productTitle,
            price: data.productPrice,
            imgSrc: data.productProfileUrl,
            itemsShow: false,
            itemTotal: 0.00,
            productCode: data.productCode,
            num: parseFloat(cartNun),
            productSubCode: data.productSubCode,
            //小列表
            items: []
          });

          // 是否为组合包
          this.setData({
            isGroup: true,
            listTotal: data.productPrice
          })

        }
        console.log(arr)
        // 压入到商品列表
        this.setData({
          cartList: arr
        })

        // 判断是否为组合包
        this.data.isGroup ? this.getGroupCartItem() : this.calculatePrice();

        wx.hideLoading()

      } else {

        wx.hideLoading()
        wx.showToast({title: res.message, icon: 'none'});

      }
      console.log(this.data.cartList)
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  // 获取多个产品数据
  getProductCartData(productCode) {

    let cartString = productCode.split(','), cartCode = [], cartNun = [], codeStr = '';

    for (let item of cartString) {

      cartCode.push(item.split('-')[0]);
      cartNun.push(parseFloat(item.split('-')[1]));
      codeStr += codeStr == '' ? item.split('-')[0] : ',' + item.split('-')[0];
    }

    wx.showLoading({ title: '加载中', mask: true })

    // 接口参数
    let url = app.GO.api + 'product/info/getShowCaseProduct';
    let param = { 'productCode': codeStr }

    app.appRequest('post', url, param, {}, (res) => {

      console.log(res)

      if (res.code == 200) {

        let Data = res.content;

        // 对组合包里的商品进行商户分类
        let arr2 = [], merchantArr2 = [];

        for (let i = 0; i < Data.length; i++) {

          let child = Data[i];

          // productProperty为1时，商品存在实物，实物才有地址选择
          if (child.productProperty.indexOf('1') != -1) {
            this.setData({
              hasStore: true
            })
          }

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
              num: cartNun[i], //child.productNum,
              productTitle: child.productTitle,
              describe: child.productDesc,
              imgSrc: child.productProfileUrl
            })

          } else {

            // 压入商品
            arr2[childIndex].items.push({
              productCode: child.productCode,
              price: child.productPrice,
              num: cartNun[i],//child.productNum,
              productTitle: child.productTitle,
              describe: child.productDesc,
              imgSrc: child.productProfileUrl
            })

          }

        }
        // 压入到商品列表
        this.setData({
          cartList : arr2
        })

        this.calculatePrice();

      } else {

        wx.showToast({title: res.message, icon: 'none'});

      }

      wx.hideLoading()
      console.log(this.data.cartList)

    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });

  },
  // 组合包数据加载
  getGroupCartItem() {

    // 获取商品列表一次加载列表
    let CartList = this.data.cartList;

    for (let i = 0; i < CartList.length; i++) {

      if (CartList[i].itemType == '2') {

        // 接口参数
        let url = app.GO.api + 'product/info/getShowCaseProduct';
        let param = { 'productCode': CartList[i].productSubCode };

        app.appRequest('post', url, param, {}, (res) => {

          console.log(res)

          if (res.code == 200) {

            let Data = res.content;

            // 对组合包里的商品进行商户分类
            let arr2 = [], merchantArr2 = [];

            for (let child of Data) {

              // productProperty为1时，商品存在实物，实物才有地址选择
              if (child.productProperty.indexOf('1') != -1) {
                this.setData({
                  hasStore: true
                });
              }

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

            CartList[i].items = arr2;
            
            this.setData({
              cartList : CartList
            })

            this.calculatePrice();

          } else {

            wx.hideLoading()
            wx.showToast({title: res.message, icon: 'none'});

          }

        })

      }

    }
    console.log(this.data.cartList)

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