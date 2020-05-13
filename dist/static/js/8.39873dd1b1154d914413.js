webpackJsonp([8],{"2kTY":function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=i("Gu7T"),n=i.n(s),a=i("Dd8w"),o=i.n(a),r=i("Usg1"),l={name:"TicketModal",props:["ticketVisible","transaction"],data:function(){return{reasons:["other","pending transaction","successful but customer not credited","transaction callback not received"],form:{description:"",email:[]},other:"",loading:!1,inputVisible:!1,inputValue:""}},methods:{close:function(){r.a.$emit("ticketModal",!1)},handleClose:function(e){this.form.email.splice(this.form.email.indexOf(e),1)},showInput:function(){var e=this;this.inputVisible=!0,this.$nextTick(function(t){e.$refs.saveTagInput.$refs.input.focus()})},handleInputConfirm:function(){var e=this.inputValue;e&&this.form.email.push(e),this.inputVisible=!1,this.inputValue=""},submitTicket:function(e){var t=this;this.loading=!0;var i=o()({},this.form,{wallet_number:this.transaction.receiver_no,amount:this.transaction.sender_amount,reference:this.transaction.reference,date_of_transaction:this.transaction.created_at,email:[this.$session.get("email")],emails:[].concat(n()(this.form.email)),customer_name:this.transaction.receiver_name||"N/A",provider_reference:this.transaction.provider_ref||"N/A",from:this.$session.get("email")});this.$store.dispatch("createTicket",i).then(function(e){t.loading=!1,t.$message({type:"success",message:e.data.response.message}),e.data.success&&t.close()}).catch(function(e){t.loading=!1;var i=e.response;t.$message({type:"error",message:i.data.error})})},resetForm:function(e){this.$refs[e].resetFields()}}},c={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("el-dialog",{staticClass:"no-padding-dialog",attrs:{top:"25vh","custom-class":"ticket-dialog",title:"Open Ticket",visible:e.ticketVisible,width:"30%"},on:{close:e.close}},[i("div",{staticClass:"flex new-ticket-bg"},[i("el-form",{ref:"ticketForm",staticClass:"w-80 m-auto",attrs:{"label-width":"80px",size:"mini"}},[i("el-form-item",{attrs:{label:"Issue"}},[i("el-select",{staticClass:"w-100",attrs:{placeholder:"Please select reason"},model:{value:e.form.description,callback:function(t){e.$set(e.form,"description",t)},expression:"form.description"}},e._l(e.reasons,function(e){return i("el-option",{key:e,attrs:{label:e,value:e}})}),1)],1),e._v(" "),i("el-form-item",{attrs:{label:"Email"}},[i("div",{staticClass:"flex flex-wrap"},[e._l(e.form.email,function(t){return i("el-tag",{key:t,attrs:{closable:"","disable-transitions":!1},on:{close:function(i){return e.handleClose(t)}}},[e._v("\n                        "+e._s(t)+"\n                        ")])}),e._v(" "),e.inputVisible?i("el-input",{ref:"saveTagInput",staticClass:"input-new-tag",attrs:{resize:"horizontal",size:"mini"},on:{blur:e.handleInputConfirm},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleInputConfirm(t)}},model:{value:e.inputValue,callback:function(t){e.inputValue=t},expression:"inputValue"}}):i("el-button",{staticClass:"button-new-tag",attrs:{size:"small"},on:{click:e.showInput}},[e._v("+ New Email")])],2)]),e._v(" "),i("el-form-item",{attrs:{label:"Subject"}},[i("el-input",{attrs:{type:"text"},model:{value:e.form.subject,callback:function(t){e.$set(e.form,"subject",t)},expression:"form.subject"}})],1),e._v(" "),i("el-form-item",{attrs:{label:"Remarks"}},[i("el-input",{attrs:{autosize:{minRows:3,maxRows:8},type:"textarea"},model:{value:e.other,callback:function(t){e.other=t},expression:"other"}})],1),e._v(" "),i("div",{staticClass:"flex justify-content-end my-2"},[i("el-button",{attrs:{size:"mini"},on:{click:e.close}},[e._v("Cancel")]),e._v(" "),i("el-button",{attrs:{size:"mini",loading:e.loading,type:"primary"},on:{click:function(t){return e.submitTicket("ticketForm")}}},[e._v("Submit")])],1)],1)],1)])},staticRenderFns:[]};var u=i("VU/8")(l,c,!1,function(e){i("jvI8")},"data-v-091d11ce",null);t.default=u.exports},jvI8:function(e,t){}});
//# sourceMappingURL=8.39873dd1b1154d914413.js.map