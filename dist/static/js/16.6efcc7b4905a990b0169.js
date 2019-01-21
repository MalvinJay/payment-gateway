webpackJsonp([16],{VCvx:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=a("Dd8w"),n=a.n(s),o=a("Usg1"),i=a("NYxO"),l={name:"Fees",data:function(){return{test:!0,columns:[{label:"Net",dataField:"type"},{label:"Amount",dataField:"customer"},{label:"Fee",dataField:"ref"}],styleObject:{fontSize:"12px"},exportVisible:!1}},created:function(){this.$store.dispatch("getFees")},mounted:function(){var e=this;o.a.$emit("sideNavClick","fees"),o.a.$on("exportModal",function(t){e.exportVisible=!1})},methods:{clickRow:function(e,t,a){a.property&&this.$router.push("/payments/"+e.reference)},handleCurrentChange:function(e){this.$store.dispatch("getFees",{page:e,cache:!1})},fetchFees:function(){this.$store.dispatch("getFees",{cache:!1})}},computed:n()({},Object(i.b)({fees:"fees",meta:"feesMeta",state:"feesState",pageSize:"pageSize"}),{error:function(){return"ERROR"===this.state&&"LOADING"!==this.state},total:function(){return this.meta.trans},loading:function(){return"LOADING"===this.state},filteredFees:function(){return this.fees.map(function(e){return e.net_amount=e.receiver_amount-e.charged_amount,e})}})},r={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-card",{staticClass:"card-0"},[a("div",{staticClass:"transactions"},[a("div",{staticClass:"trans-div flex justify-content-between"},[a("div",[a("filter-component",{attrs:{dispatch:"setFeesFilters",filterType:"payment"}})],1),e._v(" "),a("div",[a("el-button",{staticClass:"z-depth-button bold-600 s-13 open-sans mini-button",attrs:{type:"text"},on:{click:function(t){e.exportVisible=!0}}},[a("i",{staticClass:"file alternate outline icon"}),e._v(" Export")])],1)]),e._v(" "),a("div",[e.error?a("div",{staticClass:"center h-80"},[a("div",{staticClass:"center flex-column"},[a("p",{staticClass:"m-0 p-0"},[e._v("Unable to load this page")]),e._v(" "),a("el-button",{attrs:{icon:"sync icon",type:"text"},on:{click:function(t){return t.preventDefault(),e.fetchFees(t)}}},[e._v("Retry")])],1)]):a("div",{staticClass:"breathe"},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{"empty-text":"No match found, filter desired period range","row-style":e.styleObject,"row-class-name":"transactions-table-body","header-row-class-name":"transactions-table-header",data:e.filteredFees},on:{"row-click":e.clickRow}},[a("el-table-column",{attrs:{prop:"type",label:"Type"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("p",[e._v("Fee")])]}}])}),e._v(" "),a("el-table-column",{attrs:{"show-overflow-tooltip":"",prop:"reference",label:"Reference"}}),e._v(" "),a("el-table-column",{attrs:{label:"Net"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("p",{staticClass:"m-0 p-0 mr-10 s-13"},[e._v(e._s(e._f("money")(t.row.net_amount)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"Amount"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("p",{staticClass:"m-0 p-0 mr-10 s-13"},[e._v(e._s(e._f("money")(t.row.receiver_amount)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"Fee"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("p",{staticClass:"m-0 p-0 mr-10 s-13"},[e._v(e._s(e._f("money")(t.row.charged_amount)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"created_at",label:"Date"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n                            "+e._s(e._f("moment")(t.row.created_at,"D MMM,YY hh:mm A"))+"\n                        ")]}}])})],1),e._v(" "),a("div",{staticClass:"flex justify-content-between align-items-center px-10"},[a("div",{staticClass:"s-12"},[a("span",{staticClass:"bold-600"},[e._v(e._s(e.fees.length))]),e._v(" results\n                    ")]),e._v(" "),a("el-pagination",{staticClass:"my-2 flex justify-content-end",attrs:{"page-size":e.pageSize,layout:"prev, pager, next",total:e.total},on:{"current-change":e.handleCurrentChange}})],1)],1)]),e._v(" "),a("export-modal",{attrs:{modalVisible:e.exportVisible},on:{"update:modalVisible":function(t){e.exportVisible=t}}})],1)])},staticRenderFns:[]};var c=a("VU/8")(l,r,!1,function(e){a("Wiys")},"data-v-4395759e",null);t.default=c.exports},Wiys:function(e,t){}});
//# sourceMappingURL=16.6efcc7b4905a990b0169.js.map