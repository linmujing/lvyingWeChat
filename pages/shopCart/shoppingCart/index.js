// pages/shopCart/shoppingCart/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    //  可用屏幕高度
    windowHeight: app.GO.windowHeight - 200 * app.GO.rpxValue,

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

    // 测试
    num:100,

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

     // 获取购物车列表
    this.getCartListData()

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
  /*checkbox监听*/
  //商品选择
  //@param index1 购物车大列表下标
  checkboxChange(index1, index2) {

    let cartList = this.data.cartList ;

    if (index2 == undefined) {

      // 监听商户下所有商品是否选中
      let states = cartList[index1].itemState;

      for (let i = 0; i < cartList[index1].items.length; i++) {

        cartList[index1].items[i].state = states;

      }

    } else {

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

    for (let i = 0; i < All.length; i++) {

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
      cartDate: cartDate,
      listState: AllStates

    })

    //计算小计与合计
    this.calculatePrice();

  },

  // 设置checkbox 全选或取消全选
  setAllCheckboxChange() {

    this.listState = !this.cartDate.listState;

    // 获取全选大列表状态
    let isAll = this.cartDate.listState;

    let n = this.cartList.length;

    for (let i = 0; i < n; i++) {

      this.cartList[i].itemState = isAll;

      if (this.cartList[i].itemType == '1') {

        for (let x = 0; x < this.cartList[i].items.length; x++) {

          this.cartList[i].items[x].state = isAll;

        }

      }
    }

    // 计算小计与合计
    this.calculatePrice();

  },

  /*购物车数据计算*/
  // 计算小计与合计
  calculatePrice() {

    //获取商品个数
    let m = this.cartList.length;

    //计算小计
    for (let x = 0; x < m; x++) {

      let n = this.cartList[x].items.length;

      if (this.cartList[x].itemType == '1') {

        //重置小计
        this.cartList[x].itemTotal = 0;

        for (let i = 0; i < n; i++) {

          let item = this.cartList[x].items[i];

          //判断是否选中
          if (item.state) {

            this.cartList[x].itemTotal += item.num * (item.price * 10000);

          }

        }

        this.cartList[x].itemTotal = (this.cartList[x].itemTotal / 10000).toFixed(2);

      } else {

        //重置小计
        this.cartList[x].itemTotal = 0;

        if (this.cartList[x].itemState) {

          for (let i = 0; i < n; i++) {

            let item = this.cartList[x].items[i];

            for (let child of item.items) {

              this.cartList[x].itemTotal += child.num * (child.price * 10000);

            }

          }

          this.cartList[x].itemTotal = (this.cartList[x].itemTotal / 10000).toFixed(2);
        }

      }

    }

    //重置合计
    this.cartDate.listTotal = 0;

    //计算合计
    for (let i = 0; i < m; i++) {

      let item = this.cartList[i];

      //判断是否选中
      this.cartDate.listTotal += item.itemTotal * 10000;

    }

    this.cartDate.listTotal = (this.cartDate.listTotal / 10000).toFixed(2);

  },

  /**
  * 获取数据 *
  */
  // 获取购物车列表
  getCartListData() {

    wx.showLoading({ title: '加载中' })

    // 购物车接口参数
    let url = app.GO.api + 'customer/cart/getCartList';
    let param = { 'pageNo': this.data.pageNo, 'pageSize': this.data.pageSize, 'ciCode': app.GO.recommend_customer_id };

    app.appRequest('post', url, param, {}, (res) => {
      console.log(res)
      if (res.code == 200) {

        if (res.code == 200) {

          let data = res.content.list;
          // 购物车商品商户分类
          let arr = [], merchantArr = [];

          for (let i = 0; i < data.length; i++) {

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
          wx.showToast(res.data.message);

        }

      }
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

            wx.showToast(res.data.message);

          }
          
        }, (err) => {
          console.log('请求错误信息：  ' + err.errMsg);
        });

      }
    }
    wx.hideLoading();
  },

  // 删除购物车商品
  //@param cartId string 购物车商品编号
  deleteCartItemData(cartId) {

    wx.showLoading({ title: '加载中' })

    let param = this.$Qs.stringify({ 'recordId': cartId });

    this.$api.deleteCart(param)

      .then((res) => {

        console.log(res)

        wx.hideLoading();

        if (res.data.code == 200) {

          wx.showToast(res.data.message);

          // 获取购物车列表
          this.getCartListData();

          this.setAllCheckboxChange();

        } else {

          wx.showToast(res.data.message);

        }

      })
      .catch((error) => {


        console.log('发生错误！', error);

      });

    this.modelDate.deleteModelValue = false;

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