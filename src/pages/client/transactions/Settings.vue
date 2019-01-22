<template>
    <div>
        <el-card :class="[{'test-data': isTest}, 'flex', 'flex-column', 'p-0']">
            <div slot="header">
                <span class="blue-text bold-600">Invoices charged automatically</span>
            </div>
            <div class="light-background box-divider">
                <el-row class="p-20">
                    <el-col :span="8">
                        <p class="bold-600">Retry rules</p>
                    </el-col>
                    <el-col :span="15">
                        <!-- Smart Retries -->
                        <el-radio class="bold-600 s-13" v-model="radio" :label="true">Smart Retries</el-radio>
                        <p class="m-0 p-0 pl-25 s-13 my-1">Retry failed payments at the optimal times, powered by Stripe's machine learning</p>
                        <div class="my-2" v-if="radio">
                            <div class="flex align-items-center pl-25 my-2">
                                <p class="s-13 blue-text p-0 m-0 mr-6">Retry up to 4 times within</p>
                                <el-select v-model="select" class="is-shadow border-rounded h-30 settings-select">
                                    <el-option label="3 weeks" :value="1"></el-option>
                                </el-select>
                            </div>
                            <div class="flex align-items-center pl-25">
                                <p class="s-13 blue-text p-0 m-0 mr-6">Then finally</p>
                                <el-select v-model="select" class="is-shadow border-rounded h-30 settings-select">
                                    <el-option label="3 weeks" :value="1"></el-option>
                                </el-select>
                            </div>
                        </div>

                        <!-- Custom dunning -->
                        <el-radio class="bold-600" v-model="radio" :label="false">Custom dunning rules</el-radio>
                        <p class="m-0 p-0 pl-25 s-13 my-1">Manually configure steps to follow to retry payments until they succeed</p>
                        <div class="my-2 pl-25" v-if="!radio">
                            <div class="flex flex-column">
                                <el-select v-model="select" class="is-shadow border-rounded h-30 w-50 my-1 s-13">
                                    <el-option label="Retry 1 day after the previous attempt" :value="1"></el-option>
                                </el-select>
                                <el-select v-model="select" class="is-shadow border-rounded h-30 w-50 my-1">
                                    <el-option label="Retry 1 day after the previous attempt" :value="1"></el-option>
                                </el-select>
                                <el-select v-model="select" class="is-shadow border-rounded h-30 w-50 my-1">
                                    <el-option label="Retry 1 day after the previous attempt" :value="1"></el-option>
                                </el-select>
                            </div>
                            <div class="flex align-items-center">
                                <p class="s-13 blue-text p-0 m-0 mr-6">Then finally</p>
                                <el-select v-model="select" class="is-shadow border-rounded h-30 w-auto">
                                    <el-option label="cancel the subscription" :value="1"></el-option>
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="light-background box-divider">
                <el-row class="p-20">
                    <el-col :span="8">
                        <p class="bold-600">Email customers about…</p>
                    </el-col>
                    <el-col class="flex-column flex" :span="15">
                        <el-checkbox class="bold-600" v-model="form.payments">Failed Payments</el-checkbox>
                        <p class="m-0 p-0 pl-25 gray-text">An email will be sent each time a payment attempt fails, including retries.
                            <el-popover
                                placement="top-start"
                                trigger="hover"
                                content="Lorem">
                                <el-button type="text" icon="info circle icon" slot="reference" class="m-0 p-0"></el-button>
                            </el-popover>
                        </p>
                        <el-button class="m-0 p-0 preview-button" type="text">Preview Email</el-button>
                        <el-checkbox class="bold-600" v-model="form.payments">Expiring cards</el-checkbox>
                        <p class="pl-25 gray-text pl">An email will be sent 1 month before their card on file expires.
                            <el-popover
                                placement="top-start"
                                trigger="hover"
                                content="Lorem">
                                <el-button type="text" icon="info circle icon" slot="reference" class="m-0 p-0"></el-button>
                            </el-popover>
                        </p>
                        <el-button class="m-0 p-0 preview-button" type="text">Preview Email</el-button>
                    </el-col>
                </el-row>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
  name: 'Settings',
  data () {
    return {
      isTest: true,
      radio: true,
      select: 1,
      form: {}
    }
  }
}
</script>

<style lang="scss" scoped>
.settings-select{
    width: 100px
}

.w-auto{
    width: auto
}
.pl-25{
    padding-left: 25px;
}
.box-divider{
    box-shadow: inset 0 -2px #fff;
}
.preview-button{
    width: 60px;
    margin-left: 25px;
    padding: 0.2rem 0 !important;
}
</style>
