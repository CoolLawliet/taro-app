import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'

import './app.css'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  config = {
    pages: [
      "pages/index/index",
      "pages/category/index",
      "pages/goods_list/index",
      "pages/goods_detail/main",
      "pages/cart/index",
      "pages/collect/index",
      "pages/order/index",
      "pages/search/index",
      "pages/user/index",
      "pages/feedback/index",
      "pages/login/index",
      "pages/auth/index",
      "pages/pay/index"
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#eb4450',
      navigationBarTitleText: 'L商城',
      navigationBarTextStyle: 'white'
    },
    "tabBar": {
      "color": "#999",
      "selectedColor": "#ff2d4a",
      "backgroundColor": "#fafafa",
      "list": [{
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "icons/home.png",
        "selectedIconPath": "icons/home-o.png"
      },
        {
          "pagePath": "pages/category/index",
          "text": "分类",
          "iconPath": "icons/category.png",
          "selectedIconPath": "icons/category-o.png"
        },
        {
          "pagePath": "pages/cart/index",
          "text": "购物车",
          "iconPath": "icons/cart.png",
          "selectedIconPath": "icons/cart-o.png"
        },
        {
          "pagePath": "pages/user/index",
          "text": "我的",
          "iconPath": "icons/my.png",
          "selectedIconPath": "icons/my-o.png"
        }
      ]
    },
    "style": "v2",
    "sitemapLocation": "sitemap.json"
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
