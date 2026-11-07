import{aN as V,r as P,aO as $,j as e,p as q}from"./iframe-DxHtOo4h.js";import{$ as N}from"./Button-CI1wjYfp.js";import{$ as E}from"./Input-DCzt78cV.js";import{$ as T}from"./TextField-CFSo4zG9.js";import{h as C,C as k,O as v}from"./index-DmHLeUzN.js";import{F as L}from"./FieldLabel-PoMkJI-d.js";import{F as A}from"./FieldError-DdcUKVe7.js";import{$ as O}from"./Form-DU0UIvGK.js";import{F as B}from"./Flex-B2zWxrCL.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CAdw532L.js";import"./useObjectRef-D6AnwJdq.js";import"./Label-JZuHlYG-.js";import"./Hidden-C-73n3sF.js";import"./useFocusRing-DGlhroDz.js";import"./openLink-DpClGL1h.js";import"./useLabel-D3L5WW2z.js";import"./useLabels-DjvWLG0Y.js";import"./number-CI02LZgf.js";import"./I18nProvider-CE0E7M0k.js";import"./useButton-DqQwDYXZ.js";import"./usePress-Du1TfnjE.js";import"./textSelection-BtPkczBw.js";import"./getMetaValue-Its-2R3E.js";import"./useHover-CHigp1TN.js";import"./FieldError-BJ_bTBup.js";import"./Text-um_55q4T.js";import"./Autocomplete-Blt4da4X.js";import"./keyboard-CuZJZT3E.js";import"./useEvent-DtIMMGwF.js";import"./useLocalizedStringFormatter-DmTXBO-j.js";import"./useControlledState-BOC0pUVV.js";import"./useTextField-CaKqjYbL.js";import"./useField-uTiKHKmu.js";import"./useFormReset-DnnjnzwE.js";import"./useFormValidation-DZL7-bkS.js";const H={"bui-PasswordField":"_bui-PasswordField_ip954_20","bui-PasswordFieldInput":"_bui-PasswordFieldInput_ip954_27","bui-PasswordFieldInputWrapper":"_bui-PasswordFieldInputWrapper_ip954_40","bui-PasswordFieldIcon":"_bui-PasswordFieldIcon_ip954_67","bui-PasswordFieldVisibility":"_bui-PasswordFieldVisibility_ip954_129"},U=V()({styles:H,classNames:{root:"bui-PasswordField",inputWrapper:"bui-PasswordFieldInputWrapper",input:"bui-PasswordFieldInput",inputIcon:"bui-PasswordFieldIcon",inputVisibility:"bui-PasswordFieldVisibility"},bg:"consumer",propDefs:{size:{dataAttribute:!0,default:"small"},className:{},icon:{},placeholder:{},label:{},description:{},secondaryLabel:{}}}),t=P.forwardRef((r,j)=>{const{ownProps:D,restProps:o,dataAttributes:p}=$(U,r),{classes:n,label:F,icon:h,secondaryLabel:S,placeholder:W,description:I}=D;P.useEffect(()=>{!F&&!o["aria-label"]&&!o["aria-labelledby"]&&console.warn("PasswordField requires either a visible label, aria-label, or aria-labelledby for accessibility")},[F,o["aria-label"],o["aria-labelledby"]]);const _=S||(o.isRequired?"Required":null),[l,z]=P.useState(!1);return e.jsxs(T,{className:n.root,...p,type:"password",...o,ref:j,children:[e.jsx(L,{label:F,secondaryLabel:_,description:I,descriptionSlot:"description"}),e.jsxs("div",{className:n.inputWrapper,"data-size":p["data-size"],children:[h&&e.jsx("div",{className:n.inputIcon,"data-size":p["data-size"],"aria-hidden":"true",children:h}),e.jsx(E,{className:n.input,...h&&{"data-icon":!0},placeholder:W,type:l?"text":"password"}),e.jsx(N,{"data-size":p["data-size"],"data-variant":"tertiary","aria-label":l?"Hide value":"Show value","aria-controls":l?"text":"password","aria-expanded":l,onPress:()=>z(R=>!R),className:n.inputVisibility,children:l?e.jsx(C,{}):e.jsx(k,{})})]}),e.jsx(A,{})]})});t.displayName="PasswordField";t.__docgenInfo={description:`A text input for password entry with a toggleable visibility button, integrated label, and inline error display.

@public`,methods:[],displayName:"PasswordField",props:{size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the password field
@defaultValue 'medium'`},className:{required:!1,tsType:{name:"string"},description:""},icon:{required:!1,tsType:{name:"ReactNode"},description:"An icon to render before the input"},placeholder:{required:!1,tsType:{name:"string"},description:"Text to display in the input when it has no value"},label:{required:!1,tsType:{name:"FieldLabelProps['label']",raw:"FieldLabelProps['label']"},description:""},description:{required:!1,tsType:{name:"FieldLabelProps['description']",raw:"FieldLabelProps['description']"},description:""},secondaryLabel:{required:!1,tsType:{name:"FieldLabelProps['secondaryLabel']",raw:"FieldLabelProps['secondaryLabel']"},description:""}},composes:["Omit"]};const a=q.meta({title:"Backstage UI/PasswordField",component:t,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"}}}),s=a.story({args:{name:"secret",placeholder:"Enter a secret",style:{maxWidth:"300px"}}}),u=a.story({args:{...s.input.args},render:r=>e.jsxs(B,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(t,{...r,size:"small",icon:e.jsx(v,{})}),e.jsx(t,{...r,size:"medium",icon:e.jsx(v,{})})]})}),m=a.story({args:{...s.input.args,defaultValue:"https://example.com"}}),i=a.story({args:{...s.input.args,label:"Label"}}),c=a.story({args:{...i.input.args,description:"Description"}}),b=a.story({args:{...i.input.args,isRequired:!0}}),g=a.story({args:{...s.input.args,isDisabled:!0}}),d=a.story({args:{...s.input.args},render:r=>e.jsx(t,{...r,size:"small",icon:e.jsx(v,{})})}),f=d.extend({args:{isDisabled:!0}}),y=a.story({args:{...i.input.args},render:r=>e.jsx(O,{validationErrors:{secret:"Invalid secret"},children:e.jsx(t,{...r})})}),x=a.story({args:{...i.input.args,validate:r=>r==="admin"?"Nice try!":null}}),w=a.story({render:()=>e.jsxs(e.Fragment,{children:[e.jsx(L,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(t,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})});s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...u.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    defaultValue: 'https://example.com'
  }
})`,...m.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    label: 'Label'
  }
})`,...i.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    description: 'Description'
  }
})`,...c.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...d.input.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`WithIcon.extend({
  args: {
    isDisabled: true
  }
})`,...f.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args
  },
  render: args => <Form validationErrors={{
    secret: 'Invalid secret'
  }}>
      <PasswordField {...args} />
    </Form>
})`,...y.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    validate: value => value === 'admin' ? 'Nice try!' : null
  }
})`,...x.input.parameters?.docs?.source}}};w.input.parameters={...w.input.parameters,docs:{...w.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <>
      <FieldLabel htmlFor="custom-field" id="custom-field-label" label="Custom Field" />
      <PasswordField id="custom-field" aria-labelledby="custom-field-label" name="custom-field" defaultValue="Custom Field" />
    </>
})`,...w.input.parameters?.docs?.source}}};const We=["Default","Sizes","DefaultValue","WithLabel","WithDescription","Required","Disabled","WithIcon","DisabledWithIcon","ShowError","Validation","CustomField"];export{w as CustomField,s as Default,m as DefaultValue,g as Disabled,f as DisabledWithIcon,b as Required,y as ShowError,u as Sizes,x as Validation,c as WithDescription,d as WithIcon,i as WithLabel,We as __namedExportsOrder};
