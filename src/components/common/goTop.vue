<template>
    <div :class="['backTop-wrap',show?'backTop-show':'backTop-hide']" @click.stop="backtop">
        <div class="my-yd-backtop"></div>
    </div>
</template>

<script type="text/babel">
    import {scrollTop, getScrollview} from '../../utils/utils.js';
    export default {
        props:{
            scrollViews:[HTMLDivElement,HTMLElement],
            required:false
        },
        data() {
            return {
                show: false
            }
        },
        methods: {
            backtop() {
                let top = 0;
                if (this.scrollView === window) {
                    if (document.documentElement && document.documentElement.scrollTop) {
                        top = document.documentElement.scrollTop;
                    } else {
                        top = document.body.scrollTop;
                    }
                } else {
                    top = this.scrollView.scrollTop
                }
                scrollTop(this.scrollView, top, 0);
            },
            scrollHandler() {
                let offsetTop = window.pageYOffset;
                let offsetHeight = window.innerHeight;
                if (this.scrollView !== window) {
                    offsetTop = this.scrollView.scrollTop;
                    offsetHeight = this.scrollView.offsetHeight;
                }
                this.show = offsetTop >= offsetHeight / 2;
            },
            throttle(method, context) {
                clearTimeout(method.tId);
                method.tId = setTimeout(() => {
                    method.call(context);
                }, 50);
            },
            throttledCheck() {
                this.throttle(this.scrollHandler);
            }
        },
        mounted() {
            this.scrollView = this.scrollViews?this.scrollViews: getScrollview(this.$el);
            this.scrollView.addEventListener('scroll', this.throttledCheck, false);
        },
        beforeDestroy() {
            this.scrollView.removeEventListener('scroll', this.throttledCheck, false);
        }
    }
</script>

<style lang="scss">
.backTop-wrap{
  transition:  all 0.5s;
}
.backTop-show{
  
  .my-yd-backtop{
     opacity: 1.0;
     transform: translateX(0)
  }
}
.backTop-hide{
  .my-yd-backtop{
     opacity: 0;
     transform: translateX(150%)
  }
}
    .my-yd-backtop {
      transition:  all 0.5s;
    border: 1px solid #C0C0C0;
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, .85);
    position: fixed;
    border-radius: 50%;
    right: 10px;
    bottom: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    &:after {
      font-family:"YDUI-INLAY";
      content: '\E788';
      font-size: 22px;
      color: #C0C0C0;
    }
  }
</style>