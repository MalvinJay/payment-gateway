webpackJsonp([10],{N9fF:function(t,s,a){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var e=a("Dd8w"),i=a.n(e),n=a("NYxO"),o=a("Usg1"),l={name:"RunDetails",data:function(){return{status:"failed",edit:!1,readonly:!0,remarks:"",page:this.$route.path}},methods:{toggleReadonly:function(){this.readonly=!this.readonly},cancel:function(){this.readonly=!0},update:function(){}},created:function(){},mounted:function(){o.a.$emit("sideNavClick","payments"),this.$store.dispatch("getCurrentRun",this.$route.params.id)},computed:i()({},Object(n.b)({form:"currentContact",state:"currentContactState"}),{loadingPage:function(){return"LOADING"===this.state},success:function(){return"paid"===this.status},data:function(){return"GHs"===this.form.currency&&"₵",{name:this.form.name,"phone number":this.form.account_no,email:this.form.email?this.form.email:"-",type:this.form.type?this.form.type:"-",bank:this.form.bank,date:this.form.created_at,time:this.form.created_at,description:this.form.remarks?this.form.remarks:"-"}},data2:function(){return{"Send emails to":this.form.email?this.form.email:"Not Provided",Address:this.form.address?this.form.address:"Not Provided","Phone Number":this.form.account_no?this.form.account_no:"Not Provided"}},hasNoData:function(){return void 0===this.form},header:function(){return"Run"}})},r={render:function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loadingPage,expression:"loadingPage"}]},[a("el-card",{staticClass:"card-0"},[a("div",{staticClass:"flex flex-column p-20"},[a("div",{staticClass:"flex justify-content-between align-items-baseline mb-1"},[a("div",{staticClass:"flex align-items-baseline"},[a("p",{staticClass:"blue-text s-24 m-0 p-0 bold-600"},[t._v(t._s(t.form.name))])]),t._v(" "),a("div",[a("p",{staticClass:"text-uppercase s-12 bold-600 m-0 p-0"},[t._v(t._s(t.header))])])]),t._v(" "),a("div",["failed"===t.status?a("el-button",{staticClass:"z-depth-button bold-600 s-13 open-sans mini-button b-0",attrs:{size:"mini",plain:""}},[a("i",{staticClass:"undo icon"}),t._v(" Refund")]):t._e(),t._v(" "),a("el-button",{staticClass:"z-depth-button bold-600 s-13 open-sans mini-button b-0",attrs:{size:"mini",plain:""}},[a("i",{staticClass:"plus icon"}),t._v(" Note")])],1)]),t._v(" "),a("div",{staticClass:"border-top px-20 py-10"},[a("div",{staticClass:"flex"},[a("div",[a("i",{staticClass:"user s-12 icon green"})]),t._v(" "),a("div",{staticClass:"flex flex-column ml-1"},[a("p",{staticClass:"light mb-1 s-13"},[t._v(t._s(t.header)+" was created")]),t._v(" "),a("p",{staticClass:"light mb-1 s-12 gray"},[t._v(t._s(t._f("moment")(t.form.created_at,"MMM Do,YYYY hh:mm A")))])])])])]),t._v(" "),a("el-card",{staticClass:"my-2"},[a("div",{attrs:{slot:"header"},slot:"header"},[a("div",{staticClass:"flex justify-content-between"},[a("span",{staticClass:"blue-text bold-600 s-16"},[t._v(t._s(t.header)+" details")]),t._v(" "),a("el-button",{staticClass:"z-depth-button bold-600 s-13 open-sans mini-button b-0",attrs:{size:"mini",plain:"",icon:"pencil alternate icon"},on:{click:t.toggleReadonly}},[t._v("Update Details")])],1)]),t._v(" "),a("div",[t.hasNoData?a("div",{staticClass:"center h-80"},[t._v("\n                "+t._s(t.noData)+"\n            ")]):t._e(),t._v(" "),t.hasNoData?t._e():a("div",[a("div",{staticClass:"flex"},[a("div",{staticClass:"w-50"},t._l(t.data,function(s,e,i){return a("el-row",{key:i,staticClass:"mb-1",attrs:{type:"flex",align:"middle"}},[a("el-col",{attrs:{span:8}},[a("p",{staticClass:"m-0 text-capitalize lightgray s-14"},[t._v(t._s(e))])]),t._v(" "),a("el-col",{attrs:{span:16}},[t.readonly?a("div",[a("p",{staticClass:"s-13 mono"},"time"===e?[t._v(t._s(t._f("moment")(s,"hh:mm a")))]:"date"===e?[t._v(t._s(t._f("moment")(s,"MMM Do, YYYY")))]:[t._v(t._s(s))])]):a("div",[a("el-input",{staticStyle:{width:"80%"},attrs:{size:"mini"},model:{value:t.data[e],callback:function(s){t.$set(t.data,e,s)},expression:"data[key]"}})],1)])],1)}),1),t._v(" "),a("div",{staticClass:"w-50"},t._l(t.data2,function(s,e,i){return a("el-row",{key:i,staticClass:"mb-1"},[a("el-col",{attrs:{span:8}},[a("p",{staticClass:"m-0 text-capitalize lightgray s-14"},[t._v(t._s(e))])]),t._v(" "),a("el-col",{attrs:{span:6}},[a("p",{staticClass:"s-13 mono"},"date"===e?[t._v(t._s(t._f("moment")(s,"MMM Do, YYYY")))]:[t._v(t._s(s))])])],1)}),1)])])]),t._v(" "),t.readonly?t._e():a("div",{staticClass:"flex justify-content-end"},[a("el-button",{staticClass:"z-depth-button bold-600 s-13 open-sans mini-button b-0",attrs:{size:"mini",plain:""},on:{click:t.cancel}},[t._v("Cancel")]),t._v(" "),a("el-button",{staticClass:"z-depth-button bold-600 s-13 open-sans mini-button b-0",attrs:{size:"mini",type:"primary"},on:{click:t.update}},[t._v("Save")])],1)])],1)},staticRenderFns:[]};var c=a("VU/8")(l,r,!1,function(t){a("jhC6")},"data-v-cef5db5c",null);s.default=c.exports},jhC6:function(t,s){}});
//# sourceMappingURL=10.0bbae16309545d448142.js.map