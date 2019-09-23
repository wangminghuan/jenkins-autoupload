<template>
    <div>
        <div class="yd-mask" v-show="show" ref="mask" :style="styles"></div>
        <div class="yd-cityselect" :class="show ? 'yd-cityselect-active' : ''">
            <div class="yd-cityselect-header">
                <p class="yd-cityselect-title">{{title}}<i class="close-icon" @click.stop="close"></i></p>
                <div v-show="ready" class="yd-cityselect-nav">
                    <a href="javascript:;"
                       :key="key"
                       v-for="(index, key) in columnNum"
                       v-show="!!nav['txt' + index]"
                       @click.stop="navEvent(index)"
                       :class="index == navIndex ? 'yd-cityselect-nav-active' : ''"
                    >{{nav['txt' + index]}}</a>
                </div>
            </div>
            <ul v-show="ready" class="yd-cityselect-content" :class="activeClasses">
                <li class="yd-cityselect-item" v-for="(index, key) in columnNum" :ref="'itemBox' + index" :key="key">
                    <template v-if="columnsObj['columnItems' + index] && columnsObj['columnItems' + index].length > 0">
                        <div class="yd-cityselect-item-box">
                            <a href="javascript:;"
                               :key="key"
                               v-for="(item, key) in columnsObj['columnItems' + index]"
                               :class="currentClass(item.re_id, item.re_name, index)"
                               @click.stop="itemEvent(index, item.re_name, item.re_id, item.children)"
                            ><span>{{item.re_name}}</span></a>
                        </div>
                    </template>
                    <template v-else>
                        <div class="yd-cityselect-item-box" @touchstart.stop.prevent=""></div>
                    </template>
                </li>
            </ul>
        </div>
    </div>
</template>

<script type="text/babel">
    import {isIOS, pageScroll,addClass, removeClass, getScrollview,} from "../../utils/utils.js";
    export default {
        data() {
            return {
                items:[],
                show: this.value,
                navIndex: 1,
                nav: {
                    txt1: this.chooseTitle,
                    txt2: '',
                    txt3: ''
                },
                columnsObj: {
                },
                active: {},
                activeClasses: '',
                itemHeight: 40,
                columnNum: 1
            }
        },
        props: {
            ready: {
                type: Boolean,
                default: true
            },
            provance: String,
            city: String,
            area: String,
            callback: Function,
            title: {
                type: String,
                default: '所在地区'
            },
            chooseTitle: {
                type: String,
                default: '请选择'
            },
            value: {
                type: Boolean,
                default: false
            },
            columns: {
                validator(val) {
                    return /^\d*$/.test(val);
                }
            },
            maskerOpacity: {
                validator(val) {
                    return /^([0]|[1-9]\d*)?(\.\d*)?$/.test(val);
                },
                default: .5
            }
        },
        watch: {
            value(val) {
                if (isIOS) {
                    val? addClass(this.scrollView, 'g-fix-ios-overflow-scrolling-bug')
                    :setTimeout(() => {
                            removeClass(this.scrollView, 'g-fix-ios-overflow-scrolling-bug');
                    }, 200);
                    if(this.$refs.mask.$el){
                        val ? pageScroll.lock(this.$refs.mask.$el) : pageScroll.unlock(this.$refs.mask.$el)
                    };
                }
                this.show = val;
            },
            ready(val) {
                val && this.init();
            }
        },
        computed: {
            styles() {
                const style = {'z-index': "1500", 'background-color': '#000'};
                if (this.show) {
                    style['opacity'] = '0.5';
                    style['pointer-events'] = 'auto';
                }
                return style;
            }
        },
        methods: {
            init() {
                if (!this.ready || !(this.items && this.items[0]) || !this.isArray(this.items)) return;
                if (this.columns && ~~this.columns > 1) {
                    this.columnNum = ~~this.columns;
                } else {
                    this.getColumsNum(this.items[0]);
                }
                this.columnsObj.columnItems1 = this.items;
                this.provance && this.$nextTick(() => {
                    this.setDefalutValue(this.items, 'provance', 1);
                });
                this.$on('ydui.cityselect.reset', () => {
                    for (let i = 1; i <= this.columnNum; i++) {
                        this.active['itemValue' + i] = '';
                        this.active['itemName' + i] = '';
                        if ((i - 1) === 0) {
                            this.navIndex = i;
                            this.nav['txt' + i] = this.chooseTitle;
                            this.$refs['itemBox' + i][0].scrollTop = 0;
                            this.backoffView(false);
                        } else {
                            this.nav['txt' + i] = '';
                            this.columnsObj['columnItems' + i] = [];
                        }
                        if (i === this.columnNum) {
                            this.returnValue();
                        }
                    }
                });
            },
            navEvent(index) {
                if (this.columnNum > 2) {
                    if (index >= this.columnNum) {
                        this.forwardView(true);
                    } else {
                        this.backoffView(true);
                    }
                }
                this.navIndex = index;
            },
            itemEvent(index, name, value, children) {
                this.active['itemValue' + index] = value;
                this.active['itemName' + index] = name;
                this.nav['txt' + index] = name;
                this.columnsObj['columnItems' + (index + 1)] = children;
                if (index > 1 && children && children.length > 0 && this.columnNum > 2) {
                    this.forwardView(true);
                }
                this.clearNavTxt(index);
                if(!children) children=[];
                if (index === this.columnNum || (children.length <= 0)) {
                    if (index !== this.columnNum) {
                        for (let i = this.columnNum; i >= 0; i--) {
                            if (i > index) {
                                this.active['itemValue' + i] = '';
                                this.active['itemName' + i] = '';
                                this.nav['txt' + i] = '';
                            }
                        }
                    }
                    this.navIndex = index;
                    this.returnValue();
                } else {
                    this.navIndex = index + 1;
                    this.nav['txt' + (index + 1)] = this.chooseTitle;
                }
            },
            currentClass(v, n, index) {
                return (v && v == this.active['itemValue' + index]) || (n && n === this.active['itemName' + index]) ? 'yd-cityselect-item-active' : '';
            },
            clearNavTxt(index) {
                for (let i = 0; i < this.columnNum; i++) {
                    if (i > index) {
                        this.nav['txt' + (i + 1)] = '';
                    }
                }
            },
            getColumsNum(arr) {
                if (this.isArray(arr.children)) {
                    this.columnNum++;
                    this.getColumsNum(arr.children[0]);
                }
            },
            isArray(arr) {
                return arr && arr.constructor === Array && arr.length > 0;
            },
            setDefalutValue(items, currentValue, index) {
                items.every((item, key) => {
                    if (item.re_id == this[currentValue] || item.re_name === this[currentValue]) {
                        const childrenItems = this.columnsObj['columnItems' + (index + 1)] = item.children;
                        const itemBox = this.$refs['itemBox' + index][0];
                        itemBox.scrollTop = key * this.itemHeight - itemBox.offsetHeight / 3;
                        this.active['itemValue' + index] = item.re_id;
                        this.active['itemName' + index] = item.re_name;
                        this.nav['txt' + index] = item.re_name;
                        this.navIndex = index;
                        ++index;
                        index >= this.columnNum && this.columnNum > 2 && this.forwardView(false);
                        this.isArray(childrenItems) && this.setDefalutValue(childrenItems, ['', 'provance', 'city', 'area'][index], index);
                        return false;
                    }
                    return true;
                });
            },
            returnValue() {
                this.callback && this.callback(this.active);
                this.close();
            },
            close() {
                this.$emit('input', false);
                this.show = false;
            },
            backoffView(animate) {
                this.activeClasses = (animate ? 'yd-cityselect-move-animate' : '') + ' yd-cityselect-prev';
            },
            forwardView(animate) {
                this.activeClasses = (animate ? 'yd-cityselect-move-animate' : '') + ' yd-cityselect-next';
            }
        },
        mounted() {
             this.init();
             this.scrollView = getScrollview(this.$el);
        },
        beforeDestroy() {
            this.close();
            isIOS && removeClass(this.scrollView, 'g-fix-ios-overflow-scrolling-bug');
        },
        created(){
            if(false && localStorage.getItem("__city_data__")){
               this.items=JSON.parse(localStorage.getItem("__city_data__"))
            }else{
                this.$axios.post("/wap/Region/all",{
                    tree:1
                })
                .then((res)=>{
                  const _data=res.data;
                  if(_data.code==0){
                      localStorage.setItem("__city_data__",JSON.stringify(_data.data))
                      this.items=_data.data;
                      this.init()
                  }
                })
            }
        }
    }
</script>

<style lang="scss">
@mixin bottom-line($color, $zindex: 0) {
  content: '';
  position: absolute;
  z-index: $zindex;
  bottom: 0;
  left: 0;
  width: 100%;
  border-bottom: 1px solid $color;
  -webkit-transform: scaleY(.5);
  transform: scaleY(.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}
.yd-mask {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    transition: opacity .2s ease-in;
    opacity: 0;
  }
.yd-scrollview{
    width: 100%;
    height: 100%;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    position: relative;
    margin-bottom: -1px;
}
//start
.yd {
  &-cityselect {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 75%;
    background-color: #fff;
    z-index: 1 * 1500 + 2;
    transform: translate(0, 100%);
    transition: transform .2s;
    &-active {
      transform: translate(0, 0);
    }
    &-move-animate {
      transition: transform .3s;
    }
    &-next {
      transform: translate(-50%, 0);
    }
    &-prev {
      transform: translate(0, 0);
    }
  }

  &-cityselect-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1;
    &:after {
      @include bottom-line(#bdbdbd);
    }
  }

  &-cityselect-title {
    width: 100%;
    font-size: 14px;
    text-align: center;
    height: 45px;
    line-height: 45px;
    position: relative;
    &:after {
      @include bottom-line(#B2B2B2);
    }
    .close-icon{
        position: absolute;
        top:50%;
        right: 10px;
        transform: translateY(-50%)
    }
  }

  &-cityselect-nav {
    width: 100%;
    padding-left: 10px;
    overflow: hidden;
    display: flex;
    > a {
      font-size: 13px;
      color: #222;
      display: block;
      height: 40px;
      line-height: 46px;
      padding: 0 8px;
      position: relative;
      margin-right: 15px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 40%;
    }
    &-active {
      color: #F23030 !important;
      &:after {
        content: '';
        width: 100%;
        height: 2px;
        background-color: #F23030;
        position: absolute;
        bottom: 1px;
        left: 0;
        z-index: 2;
      }
    }
  }

  &-cityselect-content {
    height: 100%;
    padding-top: 85px;
    width: 100%;
    display: flex;
  }

  &-cityselect-item {
    display: block;
    height: inherit;
    width: 50%; /* for old android */
    flex: 0 0 50%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #FFF;
    &::-webkit-scrollbar {
      width: 0;
    }
    &:nth-child(2n) {
      background-color: #F5F5F5;
    }
    &-active {
      color: #F23030 !important;
      &:after {
        display: block;
        content: '\E600';
        font-family: 'YDUI-INLAY';
      }
    }
  }

  &-cityselect-item-box {
    width: 100%;
    height: inherit;
    display: block;
    padding: 0 20px;
    > a {
      color: #333;
      font-size: 13px;
      height: 40px;
      line-height: 40px;
      overflow: hidden;
      display: flex;
      align-items: center;
      width: 100%;
      position: relative;
      z-index: 1;
      &:before {
        @include bottom-line(#D9D9D9);
      }
      &:active {
        background: none; 
      }
      span {
        flex: 1;
        display: block;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all;
        text-overflow: ellipsis;
        line-height: 20px;
        max-height:20px;
        font-size: 12px;
      }
    }
  }

  &-cityselect-loading {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: .26rem;
    color: #999;
  }
}
</style>