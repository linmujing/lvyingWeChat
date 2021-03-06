//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    // 轮播数据
    indicatorDots: true,
    cindicatorColor: '#00AA88',
    autoplay: true,
    interval: 5000,
    duration: 1000,
    winWidth: app.GO.windowHeight,
    currentTab: 0,
    titleData: [
      { title: '推荐', pageLocat: 1 },
      { title: '行业动态管控', pageLocat: 2 },
      { title: '法律动态管控', pageLocat: 3 },
      { title: '视频课程', pageLocat: 4 },
      { title: '音频课程', pageLocat: 5 }
    ],
    videoArr: [],
    musicArr: [],
    careerArr: [],
    logicArr: [],
    lvyingArr: [],
    banner: [],
    bgUrl: '',
    pagelocat:1,
    searchval: '',
    // 绑定手机号弹框控制
    bindShow: false, 
  },
  houseChange(e) {
    console.log(e)
    var that = this;
    that.setData({
      currentTab: e.detail.current
    })
  },
  // 点击导航切换
  switchNav(e) {
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false
    } else {
      that.getCasePro(e.target.dataset.pagelocat)
      that.setData({
        currentTab: e.target.dataset.current,
        pagelocat: e.target.dataset.pagelocat
      })
    }
  },
  // 获取橱窗对象
  getCasePro(pagelocat){
    wx.showLoading({ title: '加载中' })
    // 接口参数
    let url = app.GO.api + 'system/showCase/getShowCaseList';
    let param = {
      appType: 1,
      pageLocat: pagelocat,
    }; 
    var that = this;
    app.appRequest('post', url, param, {}, (res) => {
      wx.hideLoading()
      // console.log(res)
      if (res.code == 200) {
        var content = res.content;
        switch (pagelocat){
          case 1:
            for (var i = 0; i < content.length; i++) {
              if (content[i].caseName == "视频推荐") {
                that.getProductShowCase(content[i].productCode, content[i].productSortBy, 1)
              } else if (content[i].caseName == "音频推荐") {
                that.getProductShowCase(content[i].productCode, content[i].productSortBy, 2)
              } else if (content[i].caseName == "行业动态管控") {
                that.getProductShowCase(content[i].productCode, content[i].productSortBy, 3)
              } else if (content[i].caseName == "法律动态管控") {
                that.getProductShowCase(content[i].productCode, content[i].productSortBy, 4)
              } else if (content[i].caseName == "律赢商城" || content[i].caseName == "律瀛商城") {
                that.getProductShowCase(content[i].productCode, content[i].productSortBy, 5)
              } else if (content[i].caseName == "轮播图banner") {
                that.setData({
                  banner: JSON.parse(content[i].caseUrl)
                })
                // 储存轮播数据
                wx.setStorage({
                  key: "banner",
                  data: JSON.parse(content[i].caseUrl)
                })
              } else if (content[i].caseName == "banner") {
                that.setData({
                  bgUrl: JSON.parse(content[i].caseUrl)[0].src
                })
              }
            }
            break
          case 2:
          case 3:
            for (var i = 0; i < content.length; i++) {
              if (content[i].caseName == "劳动推荐") {
                this.getProductShowCase(content[i].productCode, content[i].productSortBy, 4)
              } else if (content[i].caseName == "热门推荐") {
                this.getProductShowCase(content[i].productCode, content[i].productSortBy, 3)
              } else if (content[i].caseName == "轮播图banner") {
                that.setData({
                  banner: JSON.parse(content[i].caseUrl)
                })
              } 
            }
            break
          case 4:
          case 5:
            that.setData({
              banner: JSON.parse(content[2].caseUrl)
            })
            for (var i = 0; i < content.length; i++) {
              if (content[i].caseName == "音频推荐" || content[i].caseName == "视频推荐") {
                this.getProductShowCase(content[i].productCode, content[i].productSortBy, 2)
              } else if (content[i].caseName == "热门推荐") {
                this.getProductShowCase(content[i].productCode, content[i].productSortBy, 1)
              } else if (content[i].caseName == "轮播图banner") {
                that.setData({
                  banner: JSON.parse(content[i].caseUrl)
                })
              } 
            }
            break
        }
      } else {

        wx.showToast({ title: res.message, icon: 'none'})

      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  //获取推荐商品
  getProductShowCase(code, sort, type){
    var that = this;
    // 接口参数
    let url = app.GO.api + 'product/info/getShowCaseProduct';
    let param = {
      productCode: code,
      productSortBy: sort,
    };
    app.appRequest('post', url, param, {}, (res) => {
      // console.log(res)
      if (res.code == 200) {
        switch (type) {
          case 1:
            that.setData({
              videoArr: res.content
            })
            break
          case 2:
            that.setData({
              musicArr: res.content
            })
            break
          case 3:
            that.setData({
              careerArr: res.content
            })
            break
          case 4:
            that.setData({
              logicArr: res.content
            })
            break
          case 5:
            that.setData({
              lvyingArr: res.content
            })
            break
        }
      } else {

        wx.showToast({ title: res.message, icon: 'none' })

      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  // 跳转到详情
  toDetail(e){
    // console.log(e)
    var code = e.currentTarget.dataset.code;
    var typeid = e.currentTarget.dataset.typeid;
    wx.navigateTo({
      url: '../../shopMall/detail/detail?code=' + code + '&typeid=' + typeid
    })
  },
  // 跳转到列表
  toList(e) {
    // console.log(this.data.pagelocat)
    var locat = e.currentTarget.dataset.locat;
    // console.log(locat)
    var name,typeid
    switch (this.data.pagelocat){
      case 1:
        switch (locat) {
          case 1:
            name = '视频课程'
            typeid = 3
            break
          case 2:
            name = '音频课程'
            typeid = 4
            break
          case 3:
            name = '行业动态管控'
            typeid = 1
            break
          case 4:
            name = '法律动态管控'
            typeid = 2
            break
          case 5:
            name = '律瀛商城'
            typeid = 5
            break
        }
        break
      case 2:
        name = '行业动态管控'
        typeid = 1
        break
      case 3:
        name = '法律动态管控'
        typeid = 2
        break
      case 4:
        name = '视频课程'
        typeid = 3
        break
      case 5:
        name = '音频课程'
        typeid = 4
        break
    }
    wx.navigateTo({
      url: '../list/list?id=' + typeid + '&name=' + name + '&typeid=' + typeid
    })
  },
  // 搜索
  onSearch() {
    wx.navigateTo({
      url: '../searchList/searchList?val=' + this.data.searchval
    })
  },
  // input值改变
  updateVal(e) {
    var that = this
    that.setData({
      searchval: e.detail.value
    })
  },
  // 立即购买  data-productCode="{{商品编码}}"  bindtap="goBuy"
  goBuy(e) {
    let productCode = e.currentTarget.dataset.productcode ;
    wx.navigateTo({
      url: '../../shopCart/submitOrder/index?productCode=' + productCode 
    })
  },
  // 添加到购物车 data-productCode="{{商品编码}}" data-productCount="{{商品数量}}"  bindtap="addCart"
  addCart(e){

    wx.showLoading({ title: '加载中' })

    // 接口参数
    let url = app.GO.api + 'customer/cart/addCart';
    let param = {
      productCode: e.currentTarget.dataset.productcode , // 商品编码 
      productCount: 1, //加入购物车数量
      ciCode: app.GO.recommend_customer_id, //获取用户code
    };

    app.appRequest('post', url, param, {}, (res) => {
      // console.log(res)
      wx.hideLoading()
      wx.showToast({ title: res.message , icon:'none' })
      // 添加商品成功时, 修改购物车状态
      let cartState = wx.getStorageSync('cartState');
      wx.setStorageSync('cartState', parseFloat(cartState) + 1)

    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    })
  },
  // 获取用户信息
  getCustomerInfo() {

    // 判断是否已经登录
    if (app.GO.recommend_customer_phone == ""){
      this.setData({
        bindShow: true
      })
      return;
    }

    // 判断手机号是否已被注册
    // 接口参数
    let url = app.GO.api + 'customer/info/getCustomerInfo';
    let param = {
      ciCode: app.GO.recommend_customer_id, //获取用户code
    };

    app.appRequest('post', url, param, {}, (res) => {
        console.log(res)
        if (res.code == 200) {

          // 判断是否有电话号码
          if (res.content.ciPhone != "" && res.content.ciPhone != null) {
            app.GO.recommend_customer_phone = res.content.ciPhone ;
            wx.setStorageSync("recommend_customer_phone", res.content.ciPhone);
            this.setData({
              bindShow: false
            })
          }

        }else{
          //用户失效时，需要进入授权
          wx.navigateTo({
            url: '../../author/author'
          })
        }

      })

  },
  /**
* 生命周期函数--监听页面加载
*/
  onLoad: function (options) {
    this.getCasePro(1)
  },
  /**
    * 生命周期函数--监听页面显示
    */
  onShow: function () {

    // 获取用户信息，判断用户是否已经绑定手机号
    this.getCustomerInfo();
    
    wx.showLoading({ title: '加载中' })
    setTimeout(()=>{
      wx.hideLoading();
      this.getCustomerInfo();   
      // 判断是否登录
      if (!app.GO.isLogin) {
        wx.navigateTo({
          url: '../../author/author'
        })
      }
    },500)

  },
})