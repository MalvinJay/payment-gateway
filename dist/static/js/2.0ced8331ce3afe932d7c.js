webpackJsonp([2],{OISg:function(t,e){},qmzr:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a("Dd8w"),n=a.n(s),i=a("Usg1"),r=a("NYxO"),l={name:"Payouts",data:function(){return{test:!0,columns:[{label:"Trans Type",dataField:"type"},{label:"Beneficiary",dataField:"customer"},{label:"Reference",dataField:"ref"}],styleObject:{fontSize:"12px"}}},mounted:function(){i.a.$emit("sideNavClick","payouts"),this.$store.dispatch("getPayouts"),this.$store.dispatch("getJobs"),this.$store.dispatch("getQueues"),this.$store.dispatch("getPending")},computed:n()({},Object(r.b)({transactions:"transactions",state:"transactionsState"}),{total:function(){return this.transactions.length},loading:function(){return"LOADING"===this.state}})},o={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",[e("el-tabs",{staticClass:"default-tab",class:[{"test-data":this.test},"position-relative"],attrs:{stretch:"",type:"border-card"}},[e("el-tab-pane",{attrs:{label:"Payouts"}},[e("payouts-table",{attrs:{type:"payout"}})],1),this._v(" "),e("el-tab-pane",{attrs:{label:"Queued"}},[e("queued-table")],1),this._v(" "),e("el-tab-pane",{attrs:{label:"Pending Approval"}},[e("pending-table")],1),this._v(" "),e("el-tab-pane",{attrs:{label:"Jobs"}},[e("job-table",{attrs:{type:"cashin"}})],1)],1)],1)},staticRenderFns:[]};var c=a("VU/8")(l,o,!1,function(t){a("OISg")},"data-v-7c38cfda",null);e.default=c.exports}});
//# sourceMappingURL=2.0ced8331ce3afe932d7c.js.map