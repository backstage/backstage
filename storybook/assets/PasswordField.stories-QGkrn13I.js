import{ax as V,r as P,u as $,j as e,p as q}from"./iframe-COJz9F1o.js";import{$ as N}from"./Button-D6Mw4SOw.js";import{$ as E}from"./Input-LTSQ7X0M.js";import{$ as T}from"./TextField-YNDpaX0F.js";import{e as C,C as k,O as v}from"./index-C7YuSWIQ.js";import{F as L}from"./FieldLabel-BL0QMILD.js";import{F as A}from"./FieldError-CtICZLBA.js";import{$ as B}from"./useFormValidation-76zPVQeq.js";import{F as O}from"./Flex-Dx7nnyxH.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-Ca8VRlnk.js";import"./useObjectRef-BVWhO1QJ.js";import"./Label-Bje3-SKc.js";import"./Hidden-BUcIqtcd.js";import"./useGlobalListeners-B-mHHtEE.js";import"./openLink-D-7XJ3Oc.js";import"./useLabel-CzB85gF3.js";import"./useLabels-DX3CMU8G.js";import"./number-DOpROmP3.js";import"./I18nProvider-Cix8lVYp.js";import"./useButton-BjPKXG4Y.js";import"./usePress-DKjqoiSZ.js";import"./textSelection-B1xIHbhq.js";import"./useHover-d8OYsWaB.js";import"./FieldError-DZi-Bg3f.js";import"./Text-Dur_mw8s.js";import"./Autocomplete-BXjco31v.js";import"./keyboard-DtR6oH2F.js";import"./useEvent-ptp_askm.js";import"./useLocalizedStringFormatter-Uk8SorkE.js";import"./useControlledState-CYGiTDAh.js";import"./useTextField-BnkFLiJE.js";import"./useField-BrLSuq_4.js";import"./useFormReset-DtFtm4js.js";const H={"bui-PasswordField":"_bui-PasswordField_i2y38_20","bui-PasswordFieldInputWrapper":"_bui-PasswordFieldInputWrapper_i2y38_36","bui-PasswordFieldIcon":"_bui-PasswordFieldIcon_i2y38_62","bui-PasswordFieldInput":"_bui-PasswordFieldInput_i2y38_36","bui-PasswordFieldVisibility":"_bui-PasswordFieldVisibility_i2y38_123"},U=V()({styles:H,classNames:{root:"bui-PasswordField",inputWrapper:"bui-PasswordFieldInputWrapper",input:"bui-PasswordFieldInput",inputIcon:"bui-PasswordFieldIcon",inputVisibility:"bui-PasswordFieldVisibility"},propDefs:{size:{dataAttribute:!0,default:"small"},className:{},icon:{},placeholder:{},label:{},description:{},secondaryLabel:{}}}),t=P.forwardRef((r,j)=>{const{ownProps:D,restProps:o,dataAttributes:p}=$(U,r),{classes:n,label:F,icon:h,secondaryLabel:S,placeholder:W,description:I}=D;P.useEffect(()=>{!F&&!o["aria-label"]&&!o["aria-labelledby"]&&console.warn("PasswordField requires either a visible label, aria-label, or aria-labelledby for accessibility")},[F,o["aria-label"],o["aria-labelledby"]]);const _=S||(o.isRequired?"Required":null),[l,z]=P.useState(!1);return e.jsxs(T,{className:n.root,...p,type:"password",...o,ref:j,children:[e.jsx(L,{label:F,secondaryLabel:_,description:I,descriptionSlot:"description"}),e.jsxs("div",{className:n.inputWrapper,"data-size":p["data-size"],children:[h&&e.jsx("div",{className:n.inputIcon,"data-size":p["data-size"],"aria-hidden":"true",children:h}),e.jsx(E,{className:n.input,...h&&{"data-icon":!0},placeholder:W,type:l?"text":"password"}),e.jsx(N,{"data-size":p["data-size"],"data-variant":"tertiary","aria-label":l?"Hide value":"Show value","aria-controls":l?"text":"password","aria-expanded":l,onPress:()=>z(R=>!R),className:n.inputVisibility,children:l?e.jsx(C,{}):e.jsx(k,{})})]}),e.jsx(A,{})]})});t.displayName="PasswordField";t.__docgenInfo={description:`A text input for password entry with a toggleable visibility button, integrated label, and inline error display.

@public`,methods:[],displayName:"PasswordField",props:{size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the password field
@defaultValue 'medium'`},className:{required:!1,tsType:{name:"string"},description:""},icon:{required:!1,tsType:{name:"ReactNode"},description:"An icon to render before the input"},placeholder:{required:!1,tsType:{name:"string"},description:"Text to display in the input when it has no value"},label:{required:!1,tsType:{name:"FieldLabelProps['label']",raw:"FieldLabelProps['label']"},description:""},description:{required:!1,tsType:{name:"FieldLabelProps['description']",raw:"FieldLabelProps['description']"},description:""},secondaryLabel:{required:!1,tsType:{name:"FieldLabelProps['secondaryLabel']",raw:"FieldLabelProps['secondaryLabel']"},description:""}},composes:["Omit"]};const a=q.meta({title:"Backstage UI/PasswordField",component:t,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"}}}),s=a.story({args:{name:"secret",placeholder:"Enter a secret",style:{maxWidth:"300px"}}}),u=a.story({args:{...s.input.args},render:r=>e.jsxs(O,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(t,{...r,size:"small",icon:e.jsx(v,{})}),e.jsx(t,{...r,size:"medium",icon:e.jsx(v,{})})]})}),c=a.story({args:{...s.input.args,defaultValue:"https://example.com"}}),i=a.story({args:{...s.input.args,label:"Label"}}),m=a.story({args:{...i.input.args,description:"Description"}}),b=a.story({args:{...i.input.args,isRequired:!0}}),g=a.story({args:{...s.input.args,isDisabled:!0}}),d=a.story({args:{...s.input.args},render:r=>e.jsx(t,{...r,size:"small",icon:e.jsx(v,{})})}),y=d.extend({args:{isDisabled:!0}}),f=a.story({args:{...i.input.args},render:r=>e.jsx(B,{validationErrors:{secret:"Invalid secret"},children:e.jsx(t,{...r})})}),x=a.story({args:{...i.input.args,validate:r=>r==="admin"?"Nice try!":null}}),w=a.story({render:()=>e.jsxs(e.Fragment,{children:[e.jsx(L,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(t,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})});s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    name: 'secret',
    placeholder: 'Enter a secret',
    style: {
      maxWidth: '300px'
    }
  }
})`,...s.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <Flex direction="row" gap="4" style={{
    width: '100%',
    maxWidth: '600px'
  }}>
      <PasswordField {...args} size="small" icon={<RiSparklingLine />} />
      <PasswordField {...args} size="medium" icon={<RiSparklingLine />} />
    </Flex>
})`,...u.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    defaultValue: 'https://example.com'
  }
})`,...c.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    label: 'Label'
  }
})`,...i.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    description: 'Description'
  }
})`,...m.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    isRequired: true
  }
})`,...b.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true
  }
})`,...g.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <PasswordField {...args} size="small" icon={<RiSparklingLine />} />
})`,...d.input.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`WithIcon.extend({
  args: {
    isDisabled: true
  }
})`,...y.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args
  },
  render: args => <Form validationErrors={{
    secret: 'Invalid secret'
  }}>
      <PasswordField {...args} />
    </Form>
})`,...f.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    validate: value => value === 'admin' ? 'Nice try!' : null
  }
})`,...x.input.parameters?.docs?.source}}};w.input.parameters={...w.input.parameters,docs:{...w.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <>
      <FieldLabel htmlFor="custom-field" id="custom-field-label" label="Custom Field" />
      <PasswordField id="custom-field" aria-labelledby="custom-field-label" name="custom-field" defaultValue="Custom Field" />
    </>
})`,...w.input.parameters?.docs?.source}}};const De=["Default","Sizes","DefaultValue","WithLabel","WithDescription","Required","Disabled","WithIcon","DisabledWithIcon","ShowError","Validation","CustomField"];export{w as CustomField,s as Default,c as DefaultValue,g as Disabled,y as DisabledWithIcon,b as Required,f as ShowError,u as Sizes,x as Validation,m as WithDescription,d as WithIcon,i as WithLabel,De as __namedExportsOrder};
