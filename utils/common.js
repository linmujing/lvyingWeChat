/* 
 * title:公共配置文件
 */

/*
 * @:title:服务器切换
 */
function defaultBranch()
{
  return 'master' //正式版
  // return 'debug' //测试版
}

/*
 * @:title:模板切换
 */
function defaultTemplate(){

} 

/*
 * @:title:设置购物车初始状态 0
 * @ 当状态发生改变 刷新购物车
 */
function setCartState()
{
  wx.setStorageSync('cartState', 0)
}


module.exports = {
  defaultBranch: defaultBranch,
  setCartState: setCartState
}