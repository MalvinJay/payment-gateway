webpackJsonp([4],{"9eKB":function(e,t){},QyJc:function(e,t){},d99H:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=s("Dd8w"),n=s.n(a),i=s("NYxO"),l=s("PJh5"),r=s.n(l),o=(s("i+v2"),{name:"Profile",data:function(){return{imageUrl:"",fileList:[],columns:[{label:"Client Name",type:"input",model:"full_name",subtext:"Enter your client name."},{label:"Client Till",type:"input",model:"code",editable:!0},{label:"Client Company",type:"input",model:"company_name",subtext:"Enter your company's name."},{label:"Phone Number",type:"input",model:"msisdn"},{label:"Email",type:"input",model:"email",subtext:"We also use email for avatar detection if no photo is uploaded."},{label:"Account Number (Optional)",type:"input",model:"bank_account_no"},{label:"Business Address",type:"input",model:"address"},{label:"City",type:"input",model:"city"}],styleObject:{fontSize:"12px"},tableColumns:[{label:"name",prop:"name",align:"left"},{label:"account entry",prop:"account_entry",align:"left"},{label:"amount",prop:"money",align:"left"},{label:"limit",prop:"nlimit",align:"left"},{label:"date",prop:"date",align:"center"}],depositColumns:[{label:"name",prop:"name"},{label:"desciption",prop:"description"}],form:{},createLoading:!1,page:1}},computed:n()({},Object(i.b)(["user","pageSize"]),{services:function(){return this.user.account_services.map(function(e){return e.date=r()(e.created_at).format("D MMM,YY hh:mm A"),e.money="GHs "+e.amount,e.nlimit="GHs "+e.limit,e})},privileges:function(){return this.user.client.privileges},deposit:function(){return this.user.deposit_accounts}}),methods:{updateProfile:function(e){var t=this;this.form={country_code:"GH",name:this.user.client.full_name,company:this.user.client.company_name,client_msisdn:this.user.client.msisdn,email:this.user.client.email,city:this.user.client.city},this.createLoading=!0,this.$refs[e].validate(function(e){e?t.$store.dispatch("updateProfile",t.form).then(function(e){t.createLoading=!1,t.$message({message:"Profile Updated Successfully",type:"success"})}).catch(function(){t.createLoading=!1,t.$message({message:"Unable to update profile. Please try again later",type:"error"})}):(t.createLoading=!1,t.$message({message:"Please fill form correctly",type:"error"}))})},handleAvatarSuccess:function(e,t){this.imageUrl=URL.createObjectURL(t.raw)},logout:function(){var e=this;this.$store.dispatch("logout").then(function(){e.$session.remove("client"),e.$session.remove("token"),e.$session.destroy(),e.$router.push("/login")})},handleCurrentChange:function(e){this.page=e},handlePictureCardPreview:function(e){this.imageUrl=e.url}}}),c={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("el-card",{staticClass:"my-2 card-0 custom"},[s("div",{staticClass:"flex align-items-baseline justify-content-between",attrs:{slot:"header"},slot:"header"},[s("span",{staticClass:"header-text"},[e._v("Profile")]),e._v(" "),s("el-button",{staticClass:"z-depth-button s-13 open-sans mini-button b-0",attrs:{type:"primary",size:"mini"},on:{click:e.logout}},[e._v("Sign Out")])],1),e._v(" "),s("div",[s("el-row",{attrs:{type:"flex",justify:"center"}},[s("el-col",{attrs:{sm:16,lg:13}},[s("el-form",{ref:"form",staticClass:"transaction-form py-20",attrs:{"label-position":"left",size:"mini","hide-required-asterisk":"",model:e.user.client,"label-width":"200px"}},e._l(e.columns,function(t,a){return s("el-form-item",{key:a,attrs:{label:t.label}},["input"===t.type?s("el-input",{attrs:{disabled:t.editable},model:{value:e.user.client[t.model],callback:function(s){e.$set(e.user.client,t.model,s)},expression:"user.client[item.model]"}}):e._e(),e._v(" "),t.subtext?s("p",{staticClass:"my-1"},[s("span",{staticClass:"info s-12 pl-6"},[e._v(e._s(t.subtext))])]):e._e()],1)}))],1)],1)],1),e._v(" "),s("div",{staticClass:"el-card__footer flex justify-content-end"},[s("el-button",{staticClass:"z-depth-button s-13 open-sans mini-button b-0",attrs:{size:"mini"}},[e._v("Cancel")]),e._v(" "),s("el-button",{staticClass:"z-depth-button s-13 b-0 bold-500 open-sans white-text",attrs:{size:"mini",loading:e.createLoading,type:"primary"},on:{click:function(t){e.updateProfile("form")}}},[e._v("Update Client Profile")])],1)]),e._v(" "),s("el-card",{staticClass:"my-2 card-0"},[s("div",{staticClass:"flex align-items-baseline justify-content-between",attrs:{slot:"header"},slot:"header"},[s("span",{staticClass:"header-text"},[e._v("Deposit Accounts")])]),e._v(" "),s("div",[s("el-table",{staticClass:"breathe",attrs:{data:e.deposit,"empty-text":"No services to display","row-style":e.styleObject,"row-class-name":"transactions-table-body","header-row-class-name":"transactions-table-header"}},[e._l(e.depositColumns,function(e,t){return s("el-table-column",{key:t,attrs:{label:e.label,prop:e.prop}})}),e._v(" "),s("el-table-column",{attrs:{align:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[s("el-popover",{attrs:{placement:"left",width:"400","popper-class":"no-padding-popover",trigger:"hover"}},[s("div",[s("div",{staticClass:"flex justify-content-between p-10 border-bottom"},[s("p",{staticClass:"blue-text bold-600 s-14 m-0 p-0"},[e._v("Accounts")]),e._v(" "),s("the-tag",{attrs:{status:"failed",title:t.row.name,icon:"reply icon"}})],1),e._v(" "),s("div",{staticClass:"p-10"},[s("el-row",[s("el-col",{attrs:{span:12}},e._l(t.row.accounts.slice(0,t.row.accounts.length/2+1),function(t,a){return s("div",{key:a},[s("p",{staticClass:"s-12 py-5"},[e._v(e._s(t.name))])])})),e._v(" "),s("el-col",{attrs:{span:12}},e._l(t.row.accounts.slice(t.row.accounts.length/2+1,t.row.accounts.length),function(t,a){return s("div",{key:a},[s("p",{staticClass:"s-12 py-5"},[e._v(e._s(t.name))])])}))],1)],1)]),e._v(" "),s("el-button",{staticClass:"icon-only-button",attrs:{slot:"reference",icon:"info circle icon",type:"text"},slot:"reference"})],1)]}}])})],2),e._v(" "),s("div",{staticClass:"flex justify-content-between align-items-center px-20"},[s("div",{staticClass:"s-12"},[e._v("\n                    "+e._s(e.deposit.length)+" results\n                ")]),e._v(" "),s("el-pagination",{staticClass:"my-2 flex justify-content-end",attrs:{"page-size":e.pageSize,layout:"prev, pager, next",total:e.deposit.length},on:{"current-change":e.handleCurrentChange}})],1)],1)]),e._v(" "),s("el-card",{staticClass:"my-2"},[s("div",{staticClass:"flex align-items-baseline justify-content-between",attrs:{slot:"header"},slot:"header"},[s("span",{staticClass:"header-text"},[e._v("Privileges")])]),e._v(" "),s("div",[s("div",{staticClass:"flex"},[s("div",{staticClass:"w-50"},e._l(e.privileges.slice(0,e.privileges.length/2+1),function(t,a,n){return s("el-row",{key:n,staticClass:"mb-1",attrs:{type:"flex",align:"middle"}},[s("el-col",{attrs:{span:12}},[s("p",{staticClass:"m-0 text-capitalize menu-gray-text s-12"},[e._v(e._s(t.action))])]),e._v(" "),s("el-col",{attrs:{span:12}})],1)})),e._v(" "),s("div",{staticClass:"w-50"},e._l(e.privileges.slice(e.privileges.length/2+1,e.privileges.length),function(t,a,n){return s("el-row",{key:n,staticClass:"mb-1",attrs:{type:"flex",align:"middle"}},[s("el-col",{attrs:{span:12}},[s("p",{staticClass:"m-0 text-capitalize menu-gray-text s-12"},[e._v(e._s(t.action))])]),e._v(" "),s("el-col",{attrs:{span:12}})],1)}))])])]),e._v(" "),s("el-card",{staticClass:"my-2 card-0"},[s("div",{staticClass:"flex align-items-baseline justify-content-between",attrs:{slot:"header"},slot:"header"},[s("span",{staticClass:"header-text"},[e._v("Account Services")])]),e._v(" "),s("div",[s("el-table",{staticClass:"breathe",attrs:{data:e.services,"empty-text":"No services to display","row-style":e.styleObject,"row-class-name":"transactions-table-body","header-row-class-name":"transactions-table-header"}},e._l(e.tableColumns,function(e,t){return s("el-table-column",{key:t,attrs:{label:e.label,prop:e.prop}})})),e._v(" "),s("div",{staticClass:"flex justify-content-between align-items-center px-20"},[s("div",{staticClass:"s-12"},[e._v("\n                    "+e._s(e.services.length)+" results\n                ")]),e._v(" "),s("el-pagination",{staticClass:"my-2 flex justify-content-end",attrs:{"page-size":e.pageSize,layout:"prev, pager, next",total:e.services.length},on:{"current-change":e.handleCurrentChange}})],1)],1)])],1)},staticRenderFns:[]};var u=s("VU/8")(o,c,!1,function(e){s("9eKB")},null,null).exports,p={name:"AdminProfile",data:function(){return{columns:[{label:"Client Name",prop:"name"},{label:"Company Name",prop:"company"},{label:"Username",prop:"username"}]}},computed:n()({},Object(i.b)(["user"]),{form:{get:function(){return n()({},this.user,{name:this.user.firstname+" "+this.user.lastname})},set:function(e){this.user=e;e.name.split(" ");this.user.firstname=e[0],this.user.lastname=e[1]}}})},d={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("el-card",{staticClass:"my-2 card-0 custom"},[s("div",{staticClass:"flex align-items-baseline justify-content-between",attrs:{slot:"header"},slot:"header"},[s("span",{staticClass:"header-text"},[e._v("Profile")]),e._v(" "),s("el-button",{staticClass:"z-depth-button s-13 open-sans mini-button b-0",attrs:{type:"primary",size:"mini"}},[e._v("Sign Out")])],1),e._v(" "),s("div",[s("el-row",{attrs:{type:"flex",justify:"center"}},[s("el-col",{attrs:{sm:16,lg:13}},[s("el-form",{ref:"form",staticClass:"transaction-form py-20",attrs:{"label-position":"left",size:"mini","hide-required-asterisk":"",model:e.client,"label-width":"200px"}},e._l(e.columns,function(t,a){return s("el-form-item",{key:a,attrs:{label:t.label}},[s("el-input",{model:{value:e.form[t.prop],callback:function(s){e.$set(e.form,t.prop,s)},expression:"form[item.prop]"}})],1)}))],1)],1)],1),e._v(" "),s("div",{staticClass:"el-card__footer flex justify-content-end"},[s("el-button",{staticClass:"z-depth-button s-13 open-sans mini-button b-0",attrs:{size:"mini"}},[e._v("Cancel")]),e._v(" "),s("el-button",{staticClass:"z-depth-button s-13 b-0 bold-500 open-sans white-text",attrs:{size:"mini",type:"primary"}},[e._v("Save")])],1)])],1)},staticRenderFns:[]};var m={name:"Profile",components:{ClientProfile:u,AdminProfile:s("VU/8")(p,d,!1,function(e){s("QyJc")},null,null).exports},computed:n()({},Object(i.b)(["isAdmin"]))},f={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",[this.isAdmin?t("div",[t("admin-profile")],1):t("div",[t("client-profile")],1)])},staticRenderFns:[]};var b=s("VU/8")(m,f,!1,function(e){s("nn8h")},null,null);t.default=b.exports},nn8h:function(e,t){}});
//# sourceMappingURL=4.6371b0594cdf9d9a7c9a.js.map