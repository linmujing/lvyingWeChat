// index/index.js
var app = getApp();
const AUDIOMANAGER = wx.getBackgroundAudioManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData: {},
    controls: false,
    isPlay: false,
    currentPlay: 0,
    productSection: [],
    controls: 'true',
    current_process: '00:00',
    total_process: '00:00',
    slider_max: 0,
    slider_value: 0,
    // current: 0,
    code: 'P154036292431224',
    typeid: 3
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.palyer = wx.createVideoContext('player')
    this.setData({
      code: options.code,
      typeid: options.typeid,
      currentPlay: options.index
    })
    this.getDetailData(this.data.code)
    // console.log(AUDIOMANAGER)
  },
  // 获取详情
  getDetailData(code) {
    wx.showLoading({ title: '加载中' })
    var that = this;
    // 接口参数
    let url = app.GO.api + 'product/info/getProductInfo';
    let param = { productCode: code, ciCode: app.GO.recommend_customer_id };
    app.appRequest('post', url, param, {}, (res) => {
      wx.hideLoading()
      // console.log(res)
      if (res.code == 200) {
        var result = res.content
        that.setData({
          detailData: result,
          // 课程目录
          productSection: JSON.parse(result.productSection)
          // 动态管控列表
          // sectionNav: result.productSectionIndexList,
          // sectionIndex: result.productSectionIndexList.length > 0 ? result.productSectionIndexList[0].sectionIndex : 0,
          // sectionList: result.productSectionList
        })
        if(that.data.typeid == 3){
          that.setData({
            source: JSON.parse(result.productSection)[that.data.currentPlay].videoUrl,
            isPlay: false
          })
          that.palyer.play()
        }else{
          that.setAudioSrc(that.data.productSection[that.data.currentPlay].voiceUrl, that.data.productSection[that.data.currentPlay].sectionName)
        }
      } else {

        wx.showToast({ title: res.message, icon: 'none' })

      }
    }, (err) => {
      wx.hideLoading()
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  /**
  * 点击开始播放视频
  */
  btn_playVideo: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    console.log(that.data.productSection[index].videoUrl)
    if (that.data.productSection[index].videoUrl == '') {
      wx.showToast({ title: '对不起，课程' + that.data.productSection[index].sectionName + '暂无数据！', icon: 'none' })
      return false;
    }
    that.setData({
      source: that.data.productSection[index].videoUrl,
      isPlay: true,
      currentPlay: index
    })
    setTimeout(() => {
      if (that.data.isPlay) {
        that.palyer.play();
        that.setData({
          isPlay: false
        })
      } else {
        that.palyer.pause();
        that.setData({
          isPlay: true
        })
      }
    }, 300)
  },
  /**
    * 点击开始播放音频
    */
  btn_playAudio: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    that.setData({
      currentPlay: index,
      is_play: true
    })
    //console.log(index)
    // autoPlay(this.data.audioList[index]);
    that.setAudioSrc(that.data.productSection[index].voiceUrl, that.data.productSection[index].sectionName)
  },
  /**
            * 点击开始播放按钮
            */
  audio_play: function (e) {
    var that = this
    console.log(that.data.is_play);
    var process = that.data.current_process
    if (that.data.is_play) {
      // wx.pauseBackgroundAudio()
      AUDIOMANAGER.pause();
      that.setData({
        is_play: false
      })
    } else {
      AUDIOMANAGER.play();
      that.setData({
        current_process: process,
        is_play: true
      })
      // autoPlay(that.data.audioList[that.data.current]);
    }
  },
  // 设置音频资源
  setAudioSrc(src, title){
    var that = this
    AUDIOMANAGER.src = src
    AUDIOMANAGER.title = title
    that.setData({
      total_process: that.changeTimeBox(AUDIOMANAGER.duration)
    })
    //背景音频播放进度更新事件
    AUDIOMANAGER.onTimeUpdate(() => {
      that.setData({
        current_process: that.changeTimeBox(AUDIOMANAGER.currentTime),
        slider_value: Math.floor(AUDIOMANAGER.currentTime),
        total_process: that.changeTimeBox(AUDIOMANAGER.duration),
        slider_max: Math.floor(AUDIOMANAGER.duration)
      })
      // AUDIO.time = AUDIOMANAGER.currentTime
    })
  },
  // 拖动进度条，到指定位置
  hanle_slider_change(e) {
    const position = e.detail.value
    this.seekCurrentAudio(position)
  },
  // 拖动进度条控件
  seekCurrentAudio(position) {
    // 更新进度条
    let that = this

    wx.seekBackgroundAudio({
      position: Math.floor(position),
      success: function () {
        AUDIOMANAGER.currentTime = position
        that.setData({
          is_play: true,
          current_process: that.changeTimeBox(position),
          slider_value: Math.floor(position)
        })
      }
    })
  },

  // 进度条滑动
  handle_slider_move_start() {
    this.setData({
      is_moving_slider: true
    });
  },
  handle_slider_move_end() {
    this.setData({
      is_moving_slider: false
    });
  },
  // 时间格式化
  changeTimeBox(timer) {

    function p(s) { return s < 10 ? '0' + s : s };
    function ps(s) { return s == 0 ? '' : s + ':' };

    var h = timer > 3600 ? parseInt(timer / 3600) : 0;

    var m = (timer - h * 3600) > 60 ? parseInt((timer - h * 3600) / 60) : 0;

    var s = parseInt(timer - h * 3600 - m * 60);

    var now = ps(h) + p(m) + ":" + p(s);

    return now;

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