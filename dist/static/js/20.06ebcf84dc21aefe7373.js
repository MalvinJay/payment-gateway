webpackJsonp([20],{"6FgC":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=s("fZjL"),r=s.n(i),l=s("Dd8w"),o=s.n(l),a=s("Usg1"),n=s("NYxO"),c={name:"NewGroup",props:["modalVisible","title","form","mode"],data:function(){return{checkAll:!1,isIndeterminate:!0,columns:[{label:"Group Name",value:"name",prop:"name"},{label:"Description",value:"description",prop:"description"},{label:"Limit: GH¢",value:"approval_limit",prop:"approval_limit"}],loading:!1,rules:{name:[{required:!0,message:"This field is required",trigger:"blur"}]}}},methods:{close:function(){a.a.$emit("groupModal",!1)},handleCheckAllChange:function(e){this.priv=e?this.privileges.map(function(e){return e.code}):[],this.isIndeterminate=!1},handleCheckedPrivilegesChange:function(e){var t=e.length;this.checkAll=t===this.privileges.length,this.isIndeterminate=t>0&&t<this.privileges.length},submitForm:function(e){var t=this;this.loading=!0;var s=o()({},this.form,{privileges:this.form.privileges.map(function(e){return e.code})});this.$refs[e].validate(function(e){e?t.$store.dispatch("createRole",s).then(function(e){t.loading=!1,e.data.success?(t.close(),t.$message({type:"success",message:e.data.response.message}),t.$store.dispatch("getRoles")):t.$message({type:"error",message:e.data.response.message})}).catch(function(e){var s=e.response;t.$message({type:"error",message:s.data.error})}):(t.loading=!1,t.$message({type:"error",message:"Please correctly fill all fields"}))})},editGroup:function(e){var t=this;this.loading=!0;var s={name:this.form.name,privileges:this.form.privileges.map(function(e){return e.code}),description:this.form.description,approval_limit:this.form.approval_limit};this.$refs[e].validate(function(e){e?t.$store.dispatch("createRole",{group:s,id:t.form.id}).then(function(e){t.loading=!1,e.data.success?(t.close(),t.$message({type:"success",message:e.data.response.message}),t.$store.dispatch("getRoles")):t.$message({type:"error",message:e.data.response.message})}).catch(function(e){t.loading=!1;var s=e.response;t.$message({type:"error",message:s.data.error})}):(t.loading=!1,t.$message({type:"error",message:"Please correctly fill all fields"}))})}},computed:o()({},Object(n.b)({privileges:"privileges"}),{priv:{get:function(){return console.log("FORM :",this.form),this.form.privileges.map(function(e){return e.code})},set:function(e){var t=this;console.log("priv",e);for(var s=[],i=function(i){o=t.privileges.find(function(t){return t.code===e[i]}),console.log("exists",o),r()(o).length>0&&s.push(o)},l=0;l<e.length;l++){var o;i(l)}this.form.privileges=s}}})},m={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("el-dialog",{attrs:{"custom-class":"export-dialog",title:e.title,visible:e.modalVisible,width:"35%"},on:{close:e.close}},[s("div",{staticClass:"flex justify-content-center new-export-bg"},[s("el-form",{ref:"form",staticClass:"transaction-form my-2",staticStyle:{width:"90%"},attrs:{size:"mini",rules:e.rules,model:e.form,"label-width":"100px"}},[e._l(e.columns,function(t,i){return s("el-form-item",{key:i,attrs:{prop:t.prop,label:t.label}},[s("el-input",{model:{value:e.form[t.value],callback:function(s){e.$set(e.form,t.value,s)},expression:"form[item.value]"}})],1)}),e._v(" "),s("el-form-item",{staticClass:"my-2 privileges",attrs:{label:"Privileges"}},[s("el-checkbox",{attrs:{indeterminate:e.isIndeterminate},on:{change:e.handleCheckAllChange},model:{value:e.checkAll,callback:function(t){e.checkAll=t},expression:"checkAll"}},[e._v("Check all")]),e._v(" "),s("el-checkbox-group",{on:{change:e.handleCheckedPrivilegesChange},model:{value:e.priv,callback:function(t){e.priv=t},expression:"priv"}},[s("el-row",{attrs:{gutter:20}},[s("el-col",{attrs:{span:12}},e._l(e.privileges.slice(0,7),function(t,i){return s("el-checkbox",{key:i,staticClass:"no-margin-checkbox m-0",attrs:{label:t.code}},[e._v(e._s(t.action))])})),e._v(" "),s("el-col",{staticClass:"flex flex-column",attrs:{span:12}},e._l(e.privileges.slice(8,13),function(t,i){return s("el-checkbox",{key:i,staticClass:"no-margin-checkbox m-0",attrs:{label:t.code}},[e._v(e._s(t.action))])}))],1)],1)],1)],2)],1),e._v(" "),s("div",{staticClass:"flex justify-content-end",attrs:{slot:"footer"},slot:"footer"},[s("el-button",{attrs:{size:"mini"},on:{click:e.close}},[e._v("Cancel")]),e._v(" "),s("el-button",{attrs:{size:"mini",loading:e.loading,type:"primary"},on:{click:function(t){"new"===e.mode?e.submitForm("form"):e.editGroup("form")}}},[e._v("Submit")])],1)])},staticRenderFns:[]};var p=s("VU/8")(c,m,!1,function(e){s("oPOs")},"data-v-2abc6478",null);t.default=p.exports},oPOs:function(e,t){}});
//# sourceMappingURL=20.06ebcf84dc21aefe7373.js.map