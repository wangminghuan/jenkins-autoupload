<!-- 店铺分类 -->
<template>
     <div class="brabch-wrap ">
        <div class="commodity-all" @click="handleJumpSearch(1)">
            <div class="left">全部商品</div>
            <div class="arrow-icon"></div>
        </div>
        <section class="commodity-list">
            <yd-accordion v-for="(item,index) in list" :key="index">
                <yd-accordion-item :open="isOpen[index]" :title="item.parent.gc_name">
                    <ul class="product">
                        <li  v-for="(items,indexs) in item.child" :key="indexs" @click="handleJumpSearch(2,items)">{{items.gc_name}}</li>
                    </ul>
                </yd-accordion-item>
            </yd-accordion>
        </section>

     </div>
</template>
<script>
import Vue from 'vue';
import {Accordion, AccordionItem} from 'vue-ydui/dist/lib.px/accordion';
Vue.component(Accordion.name, Accordion);
Vue.component(AccordionItem.name, AccordionItem);
export default {
    props:{
        mid:{
            type:String,
            required:true
        }
    },
  data() {
    return {
        list:[],
        isOpen:[]
    };
  },
  mounted(){
      this.$store.commit('setLoading', false)
  },
  methods: {
      handleJumpSearch(state,item){  //state  代表是店铺列表，给列表页区分  k传值
            this.$router.push({path:"/index/list",query:{
                mid:this.mid,
                gid:state==1?'':item.gc_id,
                p:state==1?'':item.gc_name
            }})
      },
      getCategory(){
          this.$axios.post("/wap/GoodsClass/getList",{
              m_id:this.mid
          })
          .then((res)=>{
            const _data=res.data;
            if(_data.code==0){
                this.list=_data.data
                _data.data.map((e,index)=>{
                    this.isOpen.push(e.parent.gc_is_open==1?true:false)
                })
            }
          })
      }
  },
  created() {
      this.getCategory()
  },
};
</script>
<style lang="scss">
@import "static/css/mixin.scss";
    .brabch-wrap{
        font-size: 16px;
        .commodity-all{
            line-height: pxToRem(88px);
            background: #fff;
            margin-bottom: pxToRem(24px);
            padding-left: pxToRem(24px);
            display: flex;
            justify-content: space-between;
        }
        .commodity-list{
            .yd-accordion-head-arrow.yd-accordion-rotated:after{
                transform: rotate(-135deg);
                margin-top:5px;
                
            }
            .yd-accordion-title{
                font-size: 16px;
            }
            .yd-accordion-head-arrow:after{
                width: pxToRem(24px);
                height: pxToRem(24px);
                transform: rotate(45deg);
                margin-top:-5px;
                border-bottom: 1px solid #d5d5d5;
                border-right: 1px solid #d5d5d5;
            }
            .product{
                padding: 0 0 0  pxToRem(24px);
                display: flex;
                flex-wrap: wrap;
                
                li{
                    line-height: pxToRem(88px);
                    color: #959595;
                    margin-right: pxToRem(50px);
                }
            }
        }
    }
</style>