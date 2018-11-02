<template>
    <div>
        <el-card :class="[{'test-data': isTest}, 'flex', 'flex-column', 'card-0']">
            <div slot="header" class="flex justify-content-between align-items-center">
                <h3 class="blue-text bold-500 m-0 pb-5">Create a Product</h3>
                <div class="standard-button">
                    <el-button>Cancel</el-button>
                    <el-button>Save Product</el-button>
                </div>
            </div>
            <div class="product-bg">
                <el-card class="card-20">
                    <h4 slot="header" class="blue-text bold-600 m-0 pb-5">Details</h4>
                    <div class="flex justify-content-center default-form">
                        <el-form :label-position="right" ref="form" :model="form" label-width="200px">
                            <el-form-item label="Activity name">
                                <el-input class="w-25" v-model="form.name"></el-input>
                            </el-form-item>
                            <el-form-item label="Activity zone">
                                <el-select v-model="form.region" placeholder="please select your zone">
                                <el-option label="Zone one" value="shanghai"></el-option>
                                <el-option label="Zone two" value="beijing"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="Instant delivery">
                                <el-switch v-model="form.delivery"></el-switch>
                            </el-form-item>
                            <el-form-item label="Activity type">
                                <el-checkbox-group v-model="form.type">
                                    <el-checkbox label="Online activities" name="type"></el-checkbox>
                                    <el-checkbox label="Promotion activities" name="type"></el-checkbox>
                                    <el-checkbox label="Offline activities" name="type"></el-checkbox>
                                    <el-checkbox label="Simple brand exposure" name="type"></el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item label="Resources">
                                <el-radio-group v-model="form.resource">
                                    <el-radio label="Sponsor"></el-radio>
                                    <el-radio label="Venue"></el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="Activity form">
                                <el-input type="textarea" v-model="form.desc"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-card>
                <div class="flex justify-content-between standard-button my-2">
                    <el-button>Cancel</el-button>
                    <el-button type="primary" @click="onSubmit">Create</el-button>
                </div>
            </div>

        </el-card>
    </div>
</template>

<script>
export default {
  name: 'NewProduct',
  data () {
    return {
        isTest: true,
        form: {
            type: []
        }
    }
  }
}
</script>

<style lang="scss" scoped>
.product-bg{
    background-color: #F5F6F7;
    padding: 20px;
}
</style>

