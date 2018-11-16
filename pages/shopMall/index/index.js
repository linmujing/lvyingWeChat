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
    pagelocat:1
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
    console.log(e)
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false
    } else {
      that.getCasePro(e.target.dataset.pagelocat)
      that.setData({
        currentTab: e.target.dataset.current,
        pagelocat: e.target.dataset.pagelocat
      })
      console.log(e.target.dataset.pagelocat)
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
            that.setData({
              banner: JSON.parse(content[6].caseUrl),
              bgUrl: JSON.parse(content[3].caseUrl)[0].src
            })
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
              }
            }
            break
          case 2:
          case 3:
            that.setData({
              banner: JSON.parse(content[2].caseUrl)
            })
            for (var i = 0; i < content.length; i++) {
              if (content[i].caseName == "劳动推荐") {
                this.getProductShowCase(content[i].productCode, content[i].productSortBy, 4)
              } else if (content[i].caseName == "热门推荐") {
                this.getProductShowCase(content[i].productCode, content[i].productSortBy, 3)
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
              }
            }
            break
        }
      } else {

        wx.showToast({ title: res.message })

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

        wx.showToast({ title: res.message })

      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  // 跳转到详情
  toDetail(e){
    console.log(e)
    var code = e.currentTarget.dataset.code;
    wx.navigateTo({
      url: '../../shopMall/detail/detail?code=' + code,
    })
  },
  // 跳转到列表
  toList(e) {
    var code = e.currentTarget.dataset.code;
    wx.navigateTo({
      url: '../../shopMall/list/list?code=' + code,
    })
  },
  /**
* 生命周期函数--监听页面加载
*/
  onLoad: function (options) {
    this.getCasePro(1)
  },

})