webpackJsonp([13],{"3qhX":function(e,t){},gZcy:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});s("NYxO");var a={name:"Login",data:function(){return{form:{email:""},email:"",loading:!1,rules:{email:[{required:!0,message:"Please input email",trigger:"blur"}]}}},methods:{sendEmail:function(e){var t=this;this.loading=!0,this.$refs[e].validate(function(e){e?t.$store.dispatch("sendEmail",t.form.email).then(function(e){e.data.success?(t.$message({message:e.data.response.message,type:"success"}),setTimeout(function(){t.$router.push("/login")},2e3)):t.$message({message:e.data.response.message,type:"error"}),t.loading=!1}).catch(function(e){t.loading=!1,t.$message({message:"Error. Please try again later",type:"error"})}):(t.loading=!1,t.$message({message:"Please fill out all the details",type:"error"}))})}}},r={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"center flex-column full-height"},[e._m(0),e._v(" "),s("div",{staticClass:"logo-div w-30 bg-white border-rounded"},[s("p",{staticClass:"text-center flopay-blue bold-500 s-16 m-0"},[e._v("Reset your password")]),e._v(" "),s("p",{staticClass:"text-center gray-text bold-500 s-13 my-1"},[e._v("Enter your email address and we will send you a link to reset your password.")]),e._v(" "),s("el-form",{ref:"form",attrs:{model:e.form,rules:e.rules},nativeOn:{keyup:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key,"Enter"))return null;e.login("form")}}},[s("el-form-item",{attrs:{prop:"email"}},[s("el-input",{staticClass:"no-border-input",attrs:{placeholder:"Enter your email address",type:"email"},model:{value:e.form.email,callback:function(t){e.$set(e.form,"email",t)},expression:"form.email"}})],1),e._v(" "),s("el-form-item",{staticClass:"my-2"},[s("el-button",{staticClass:"w-100",attrs:{loading:e.loading,type:"warning"},on:{click:function(t){e.sendEmail("form")}}},[e._v("Send password to reset email")])],1)],1)],1)])},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"my-3 flex justify-content-center"},[t("img",{attrs:{src:s("AOy5"),alt:""}})])}]};var n=s("VU/8")(a,r,!1,function(e){s("3qhX")},"data-v-77e76d86",null);t.default=n.exports}});
//# sourceMappingURL=13.d034c8ca379353eb27fb.js.map