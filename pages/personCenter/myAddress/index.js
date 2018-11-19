// pages/personCenter/myAddress/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 视口高度
    windowHeight: '',
    // 收货地址数据列表
    addressList: [],

    // 编辑时地址下标
    aditAddressIndex: 0,
    // 收货地址弹框绑定值
    addressModelData: {
      name: '',
      phone: '',
      province: { value: '', label: '' },
      city: { value: '', label: '' },
      county: { value: '', label: '' },
      addressDetail: '',
      default: '',
    },
    // 地址
    region: [],

    //  删除下标
    deleteModelIndex: 0,
    // 列表页面(true) 或 新增页面(false)
    pageState: true,
    // 收货地址新增或者编辑
    addOrAdit: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取屏幕高度
    wx.getSystemInfo({
      success: res => {
        this.setData({
          windowHeight: res.screenHeight
        })
      }
    })

    this.getData();
  },

  /**
  * 业务逻辑
  */ 
  // 地址选择
  bindRegionChange(e){
    this.setData({
      region: e.detail.value
    })
  },
  // 新增打开地址
  openAddressModel() {

    // 清空相关值
    let addressModelData = {
      name: '',
      phone: '',
      province: { value: '', label: '' },
      city: { value: '', label: '' },
      county: { value: '', label: '' },
      addressDetail: '',
      default: '',
    };
    this.setData({
      addressModelData: addressModelData,
      region: [],
      pageState: false
    })

  },
  // 编辑打开地址
  aditAddressItem(e) {

    let index = e.target.dataset.index;
    let item = this.data.addressList[index];

    let addressModelData = {
      name: item.name,
      phone: item.phone,
      province: item.province,
      city: item.city,
      county: item.county,
      addressDetail: item.addressDetail,
      addressCode: item.addressCode,
      default: item.default,
    };

    this.setData({
      // 切换页面状态
      pageState: false,
      // 设置编辑地址
      addOrAdit: false,
      // 编辑地址下标
      aditAddressIndex: index,
      addressModelData: addressModelData,
      region: [item.province.label, item.city.label, item.county.label]
    })

  },
  // 关闭编辑
  closeAdit(){
    this.setData({
      pageState : true
    })
  },
  // 绑定input数据
  bindInput(e){

    let key = e.target.dataset.key ;
    // 获取弹框数据
    let data = this.data.addressModelData;

    data[key] = e.detail.value;

    this.setData({
      addressModelData: data
    })

  },

  /**
  * 数据加载
  */
  // 获取我的地址数据 （上拉加载更多）
  getData() {

    wx.showLoading({ title: '加载中' })

    // 地址接口参数
    let url = app.GO.api + 'customer/address/getAddressList';
    let param = {
      pageNo: 1,
      pageSize: 10,
      ciCode: app.GO.recommend_customer_id, //获取用户code
    };

    app.appRequest('post', url, param, {}, (res) => {
      wx.hideLoading()
      console.log(res)
      if (res.code == 200) {

        let data = res.content.list;
        let addressList = [];

        for (let item of data) {
          console.log(item)
          addressList.push({
            addressCode: item.addressCode,
            name: item.addressPersonName,
            phone: item.addressPhone,
            province: { value: item.province, label: item.province },
            city: { value: item.city, label: item.city },
            county: { value: item.zone, label: item.zone },
            addressDetail: item.address,
            isDefalut: item.isDefalut,
          })
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
    });

  },
  //  删除地址
  deleteAddress(e) {

    let that = this;

    this.setData({
      deleteModelIndex: e.target.dataset.index
    })

    wx.showModal({
      content: '确定删除该地址吗？',
      success(res) {
        if (res.confirm) {

          // 地址接口参数
          let url = app.GO.api + 'customer/address/deleteAddress';
          let param = {
            "addressCode": that.data.addressList[that.data.deleteModelIndex].addressCode 
          };

          app.appRequest('post', url, param, {}, (res) => {
            console.log(res)
            if (res.code == 200) {
              // 更新数据
              that.getData();
            }
            wx.showToast({ title: res.message })
          }, (err) => {
            console.log('请求错误信息：  ' + err.errMsg);
          }); 
          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })


  },
  // 新增地址
  addAddressData() {
    wx.showLoading({ title: '加载中' })

    // 获取弹框数据
    let data = this.data.addressModelData;

    if (data.county.label == "") { this.$toast('地址填写不完整！'); return; };
    if (data.name == "") { this.$toast('收件人名不能为空'); return; }
    if (data.phone == "") { this.$toast('电话号码不能为空'); return; }
    if (data.addressDetail == "") { this.$toast('地址详情不能为空！'); return; }

    // 地址接口参数
    let url = app.GO.api + 'customer/address/saveAddress';
    let param = {
      "ciCode": app.GO.recommend_customer_id, //获取用户code
      "addressPersonName": data.name,
      "addressPhone": data.phone,
      "province": this.data.region[0],
      "zone": this.data.region[2],
      "city": this.data.region[1],
      "address": data.addressDetail,
    };

    // 判断是保存还是新增地址
    this.data.addOrAdit ? '' : param.addressCode = data.addressCode;

    console.log(param)

    app.appRequest('post', url, param, {}, (res) => {

      console.log(res)
      if (res.code == 200) {

        // 获取用户地址列表
        this.getData();

        this.setData({
          pageState: true,
          addOrAdit: true
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