<template>
    <div class="light-background analytics-div h-76 border-top flex justify-content-between align-items-center">
        <div class="flex flex-column justify-content-center">
            <!-- <p class="grey-text m-0 pb-5">{{form.title}}</p>
            <el-popover v-if="form.popover"
                placement="top-start"
                trigger="hover"
                content="Lorem">
                <el-button class="p-0" slot="reference" icon="info circle icon" type="text"></el-button>
            </el-popover> -->
            <div class="grey-text m-0 p-0 flex align-items-center">
                <p class="m-0 p-0 mr-6"> {{form.title}} </p>
                <el-popover v-if="form.popover"
                    placement="top-start"
                    width="200"
                    trigger="hover"
                    :content="form.popoverContent">
                    <el-button class="p-0" slot="reference" icon="info circle icon" type="text"></el-button>
                </el-popover>
            </div>
            <p class="light-blue-text s-16 bold-600">{{form.volume | money}}</p>
        </div>
        <div style="height: 88px" class="w-50">
            <line-chart :id="form.id" :data="form.chartData" :labels="form.chartOptions"></line-chart>
        </div>
    </div>
</template>

<script>
export default {
  name: 'AnalyticsDiv',
  props: ['form']
}
</script>

<style lang="scss" scoped>
.transparent-input{
    width: 100px;
}
.date-input{
    width: calc((200px/2) - 17px )
}
.w-200{
    width: 200px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;

    i{
        margin-top: -3px;
    }
}
.mini-button{
    height: 30px;
    line-height: 30px;
    padding: 0 10px;

    span{
        font-weight: 600
    }
    i{
        margin-right: 5px;
    }
}
.analytics{
    .el-card__body{
        padding: 0 !important;
    }
    .analytics-div{
        height: 100px;
        padding: 20px;
    }
}
.h-76{
    height: 76px !important;
}
</style>
