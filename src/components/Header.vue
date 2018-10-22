<template>
    <div class="flex justify-content-between h-100 header">
        <!-- <div class="search-div is-always"> -->
            <el-input class="is-shadow border-rounded search-div" prefix-icon="el-icon-search" placeholder="Search..."></el-input>
        <!-- </div> -->
        <div class="flex align-items-center header-side-panel">
            <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                    <img class="img-fluid" src="../assets/images/icons/bookmark.svg" alt="">
                </span>
                <el-dropdown-menu slot="dropdown" class="w-200">
                    <el-dropdown-item>Documentation</el-dropdown-item>
                    <el-dropdown-item>Support</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                    <img class="img-fluid" src="../assets/images/icons/bell.svg" alt="">
                </span>
                <el-dropdown-menu slot="dropdown" class="w-200">
                    <el-dropdown-item disabled>
                        <p class="green-text notify-header">NOTIFICATION</p>
                    </el-dropdown-item>
                    <el-dropdown-item divided>Lorem</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                    <img class="img-big circle" src="../assets/images/profile/profile.jpg" alt="">
                </span>
                <el-dropdown-menu slot="dropdown" class="w-100px">
                    <el-dropdown-item disabled>
                        <div class="flex flex-column dropdown-header">
                            <p class="blue-text">Sedinam Barbara Dwamena</p>
                            <p class="s-8">Role Here</p>
                        </div>
                    </el-dropdown-item>
                    <el-dropdown-item>Profile</el-dropdown-item>
                    <el-dropdown-item>Sign Out</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style lang="scss" scoped>
.header{
    padding-top: 20px;

    .el-input{
        height: 30px;

        .el-input__icon .el-input__inner{
            height: 30px !important;
            line-height: 30px !important;
        }
    }
}
.notify-header{
    font-size: 0.75em;
    font-weight: 700;
    letter-spacing: 0.5px;
}
.dropdown-header{
    p{
        margin: 0;
        padding: 0;

        &:last-child{
            padding: 0;
            margin: 0;
        }
    }
}

.w-200{
    width: 200px
}
.w-100px{
    width: auto
}
.s-8{
    font-size: 10px
}
.search-div{
    width: 40%;
}
.header-side-panel{
    width: 7%;
    justify-content: space-between;
}

</style>
