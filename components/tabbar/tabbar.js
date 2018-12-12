// components/tabbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 当前选项下标
    current: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 选项
    list: [
      {
        "pagePath": "shopMall/index/index",
        "iconPath": "../../images/icon/home.png",
        "selectedIconPath": "../../images/icon/_home.png",
        "text": "首页"
      },
      {
        "pagePath": "sort/sort",
        "iconPath": "../../images/icon/sort.png",
        "selectedIconPath": "../../images/icon/_sort.png",
        "text": "分类"
      },
      {
        "pagePath": "shopCart/shoppingCart/index",
        "iconPath": "../../images/icon/cart.png",
        "selectedIconPath": "../../images/icon/_cart.png",
        "text": "购物车"
      },
      {
        "pagePath": "personCenter/personCenter/index",
        "iconPath": "../../images/icon/user.png",
        "selectedIconPath": "../../images/icon/_user.png",
        "text": "我的"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转页面
    jump(e){
      console.log(e)
      console.log(this.data.current)
      let index = e.currentTarget.dataset.index;
      if (index == this.data.current){
        return;
      }
      
      let str = this.data.current == 1 ? '../' : '../../' ;
      wx.redirectTo({
        url:  str + this.data.list[index].pagePath
      })
    }
  },

  ready(){
    // console.log(this.data.current)
  }
})
