import Taro, { Component } from '@tarojs/taro'
import {View,Navigator} from "@tarojs/components";
import './SearchInput.css'

class SearchInput extends Component {
  render() {
    return (
      <View class='search_input'>
        <Navigator url='/pages/search/index' open-type='navigate'>
          搜索
        </Navigator>
      </View>
    );
  }
}

export default SearchInput;
