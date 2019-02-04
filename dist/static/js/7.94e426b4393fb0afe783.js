webpackJsonp([7],{"0eSL":function(t,e){},"7vXP":function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=o("Dd8w"),s=o.n(a),n=o("Usg1"),i=o("NYxO"),c={name:"AddContact",props:["form","dialogVisible"],data:function(){return{rules:{"deposit_account.customer_msisdn":[{required:!0,min:10,max:10,message:"Length should be 10",trigger:"blur"}],amount:[{required:!0,message:"This field is required",trigger:"blur"}],"deposit_account.email":[{required:!0,message:"This field is required",trigger:"blur"}]}}},computed:s()({},Object(i.b)({providers:"providers"})),methods:{close:function(){n.a.$emit("addContact",!1)},submitForm:function(t){var e=this;this.createLoading=!0,this.$refs[t].validate(function(t){t?e.$store.dispatch("createContact",e.form).then(function(t){e.createLoading=!1,e.$message({message:"Contact Created Successfully",type:"success"}),e.dialogVisible=!1}).catch(function(){e.createLoading=!1,e.$message({message:"Unable to create Contact. Please try again later",type:"error"})}):(e.createLoading=!1,e.$message({message:"Please fill form correctly",type:"error"}))})},resetForm:function(t){this.dialogVisible=!1,this.createLoading=!1,this.$refs[t].resetFields()}}},r={render:function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("el-dialog",{attrs:{"custom-class":"new-transaction",title:"Create Customer",visible:t.dialogVisible,width:"30%"},on:{close:t.close}},[o("div",{staticClass:"flex justify-content-center new-transaction-bg"},[o("el-form",{ref:"form",staticClass:"transaction-form",staticStyle:{width:"90%"},attrs:{size:"mini","label-position":"left","hide-required-asterisk":"",rules:t.rules,model:t.form,"label-width":"150px"}},[o("el-form-item",{attrs:{label:"Customer Name"}},[o("el-input",{model:{value:t.form.deposit_account.account_name,callback:function(e){t.$set(t.form.deposit_account,"account_name",e)},expression:"form.deposit_account.account_name"}})],1),t._v(" "),o("el-form-item",{staticClass:"h-auto",attrs:{label:"Customer Email",prop:"deposit_account.email"}},[o("el-input",{model:{value:t.form.deposit_account.email,callback:function(e){t.$set(t.form.deposit_account,"email",e)},expression:"form.deposit_account.email"}})],1),t._v(" "),o("el-form-item",{staticClass:"h-auto",attrs:{label:"Phone Number",prop:"deposit_account.customer_msisdn"}},[o("el-input",{model:{value:t.form.deposit_account.customer_msisdn,callback:function(e){t.$set(t.form.deposit_account,"customer_msisdn",e)},expression:"form.deposit_account.customer_msisdn"}})],1),t._v(" "),o("el-form-item",{attrs:{label:"Description"}},[o("el-input",{attrs:{autosize:"",type:"textarea"},model:{value:t.form.description,callback:function(e){t.$set(t.form,"description",e)},expression:"form.description"}})],1),t._v(" "),o("el-form-item",{attrs:{label:"Mode"}},[o("el-radio-group",{staticClass:"w-100 default-radio-group",model:{value:t.form.accounts_provider_code,callback:function(e){t.$set(t.form,"accounts_provider_code",e)},expression:"form.accounts_provider_code"}},[o("el-radio-button",{staticClass:"w-50",attrs:{label:"mobile"}},[t._v("Mobile Money")]),t._v(" "),o("el-radio-button",{staticClass:"w-50",attrs:{label:"bank"}},[t._v("Bank")])],1)],1),t._v(" "),"mobile"===t.form.accounts_provider_code?o("div",[o("el-form-item",{attrs:{label:"Provider Name"}},[o("el-select",{staticClass:"w-100",attrs:{placeholder:"Select Provider"},model:{value:t.form.code,callback:function(e){t.$set(t.form,"code",e)},expression:"form.code"}},t._l(t.providers,function(t,e){return o("el-option",{key:e,attrs:{label:t.label,value:t.value}})}))],1),t._v(" "),o("el-form-item",{attrs:{label:"Mobile Money Number"}},[o("el-input",{attrs:{type:"text"},model:{value:t.form.deposit_account.phone,callback:function(e){t.$set(t.form.deposit_account,"phone",e)},expression:"form.deposit_account.phone"}})],1),t._v(" "),o("el-form-item",{attrs:{label:"Branch"}},[o("el-input",{attrs:{type:"text"},model:{value:t.form.deposit_account.bank,callback:function(e){t.$set(t.form.deposit_account,"bank",e)},expression:"form.deposit_account.bank"}})],1)],1):o("div",[o("el-form-item",{attrs:{label:"Bank"}},[o("el-input",{attrs:{type:"text"},model:{value:t.form.deposit_account.bank,callback:function(e){t.$set(t.form.deposit_account,"bank",e)},expression:"form.deposit_account.bank"}})],1),t._v(" "),o("el-form-item",{attrs:{label:"Account Number"}},[o("el-input",{attrs:{type:"text"},model:{value:t.form.deposit_account.account_no,callback:function(e){t.$set(t.form.deposit_account,"account_no",e)},expression:"form.deposit_account.account_no"}})],1),t._v(" "),o("el-form-item",{attrs:{label:"Branch"}},[o("el-input",{attrs:{type:"text"},model:{value:t.form.deposit_account.branch,callback:function(e){t.$set(t.form.deposit_account,"branch",e)},expression:"form.deposit_account.branch"}})],1)],1)],1)],1),t._v(" "),o("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{staticClass:"z-depth-button b-0 open-sans black-text",attrs:{size:"mini"},on:{click:function(e){t.resetForm("form")}}},[t._v("Cancel")]),t._v(" "),o("el-button",{staticClass:"z-depth-button b-0 bold-500 open-sans white-text",attrs:{size:"mini",loading:t.createLoading,type:"primary"},on:{click:function(e){t.submitForm("form")}}},[t._v("Create Customer")])],1)])},staticRenderFns:[]};var l=o("VU/8")(c,r,!1,function(t){o("0eSL")},null,null).exports,d=(o("Y+wi"),function(t,e){});d.getEditView=function(t){return{deposit_account:{account_name:t.name,email:t.email,customer_msisdn:"bank"===t.type.toLowerCase()?t.phone:t.account_no,bank:t.bank,branch:t.branch,phone:t.account_no,account_no:t.account_no},accounts_provider_code:"bank"===t.type.toLowerCase()?"bank":"mobile",description:t.description,code:t.code}};var u=d,m={name:"Contacts",props:["type"],components:{AddContact:l},data:function(){return{test:!0,columns:[{label:"Type",dataField:"type",width:"auto"},{label:"phone number",dataField:"account_no",width:"auto"},{label:"Provider",dataField:"bank",width:"auto"},{label:"Owner",dataField:"owner",width:"auto"}],styleObject:{fontSize:"12px"},activeName:"1",date:!1,dialogVisible:!1,form:{accounts_provider_code:"mobile",deposit_account:{}},contact:{},retryLoading:!1,createLoading:!1}},created:function(){this.$store.dispatch("getContacts")},mounted:function(){var t=this;n.a.$emit("sideNavClick","contacts"),n.a.$on("addContact",function(e){t.dialogVisible=!1})},methods:{handleCurrentChange:function(t){this.$store.dispatch("setCurrentContacts",t)},clickRow:function(t,e,o){if(o.property){var a=u.getEditView(t);this.dialogVisible=!0,this.contact=a}},newContact:function(){this.dialogVisible=!0,this.contact=this.form},fetchCustomers:function(){this.$store.dispatch("getContacts")},formatContent:function(t,e,o,a){return void 0!==o&&o?o:"-"},submitForm:function(t){var e=this;this.createLoading=!0,this.$refs[t].validate(function(t){t?e.$store.dispatch("createContact",e.form).then(function(t){e.createLoading=!1,e.$message({message:"Contact Created Successfully",type:"success"}),e.dialogVisible=!1}).catch(function(){e.createLoading=!1,e.$message({message:"Unable to create Contact. Please try again later",type:"error"})}):(e.createLoading=!1,e.$message({message:"Please fill form correctly",type:"error"}))})},resetForm:function(t){this.dialogVisible=!1,this.createLoading=!1,this.$refs[t].resetFields()},editContact:function(t){var e=u.getEditView(t);this.dialogVisible=!0,this.contact=e},handleCommand:function(t,e){switch(t){case"edit":this.editContact(e);break;case"delete":this.deleteContact(e.id)}}},computed:s()({},Object(i.b)({contacts:"currentContacts",state:"contactsState",count:"contactsCount",providers:"providers",pageSize:"pageSize"}),{total:function(){return this.count},loading:function(){return"LOADING"===this.state},error:function(){return"ERROR"===this.state&&"LOADING"!==this.state}})},p={render:function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("el-card",{staticClass:"card-0"},[o("div",{staticClass:"transactions"},[o("div",{staticClass:"customer-div flex justify-content-between"},[o("div",{staticClass:"flex align-items-baseline"},[o("p",{staticClass:"blue-text bold-600 s-16 m-0 p-0"},[t._v("Customers")])]),t._v(" "),o("div",[o("el-button",{staticClass:"z-depth-button bold-600 s-13 open-sans mini-button",attrs:{type:"text"},on:{click:t.newContact}},[o("i",{staticClass:"plus icon"}),t._v(" New")])],1)]),t._v(" "),o("div",[t.error?o("div",{staticClass:"center h-80"},[o("div",{staticClass:"center flex-column"},[o("p",{staticClass:"m-0 p-0"},[t._v("Unable to load this page")]),t._v(" "),o("el-button",{attrs:{icon:"sync icon",type:"text"},on:{click:function(e){return e.preventDefault(),t.fetchCustomers(e)}}},[t._v("Retry")])],1)]):o("div",[o("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],attrs:{"empty-text":"No contacts found","row-style":t.styleObject,"row-class-name":"transactions-table-body","header-row-class-name":"transactions-table-header",data:t.contacts},on:{"row-click":t.clickRow}},[o("el-table-column",{attrs:{type:"selection",width:"55"}}),t._v(" "),o("el-table-column",{attrs:{prop:"name",label:"Name"},scopedSlots:t._u([{key:"default",fn:function(e){return[o("div",{staticClass:"flex align-items-center cursor black-text"},[t._v("\n                                    "+t._s(e.row.name)+"\n                                ")])]}}])}),t._v(" "),t._l(t.columns,function(e,a){return o("el-table-column",{key:a,attrs:{formatter:t.formatContent,width:e.width,prop:e.dataField,label:e.label}})}),t._v(" "),o("el-table-column",{attrs:{width:"100px"},scopedSlots:t._u([{key:"default",fn:function(e){return[o("div",[o("el-dropdown",{staticClass:"mini-menu",attrs:{trigger:"click"},on:{command:function(o){return t.handleCommand(o,e.row)}}},[o("el-button",{staticClass:"trans-icon-only-button",attrs:{type:"text",size:"mini",plain:"",icon:"ellipsis horizontal icon"}}),t._v(" "),o("el-dropdown-menu",{staticClass:"w-200",attrs:{slot:"dropdown"},slot:"dropdown"},[o("el-dropdown-item",{attrs:{disabled:""}},[o("div",{staticClass:"table-dropdown-header blue-text bold-600 text-uppercase"},[t._v("\n                                                actions\n                                            ")])]),t._v(" "),o("el-dropdown-item",{staticClass:"s-12",attrs:{command:"edit"}},[t._v("Edit Customer")]),t._v(" "),o("el-dropdown-item",{staticClass:"s-12",attrs:{command:"delete"}},[t._v("Delete Customer")])],1)],1)],1)]}}])})],2),t._v(" "),o("div",{staticClass:"flex justify-content-between align-items-center px-10"},[o("div",{staticClass:"s-12"},[t._v("\n                        "+t._s(t.contacts.length)+" results\n                    ")]),t._v(" "),o("el-pagination",{staticClass:"my-2 flex justify-content-end",attrs:{"page-size":t.pageSize,layout:"prev, pager, next",total:t.total},on:{"current-change":t.handleCurrentChange}})],1)],1)]),t._v(" "),o("add-contact",{attrs:{form:t.contact,dialogVisible:t.dialogVisible}})],1)])},staticRenderFns:[]};var f=o("VU/8")(m,p,!1,function(t){o("B5+G")},"data-v-3d12a82f",null);e.default=f.exports},"B5+G":function(t,e){}});
//# sourceMappingURL=7.94e426b4393fb0afe783.js.map