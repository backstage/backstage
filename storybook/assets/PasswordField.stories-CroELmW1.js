import{bg as V,ca as P,cH as q,bR as e,c7 as N}from"./iframe-X5mwL4tp.js";import{b as $}from"./Button-Mr7_7LVv.js";import{c as E}from"./Input-DJuIrIG0.js";import{$ as T}from"./TextField-C0ZDCaAD.js";import{k,m as C,O as v}from"./index-BaDW95zO.js";import{F as L}from"./FieldLabel-5pjEprhb.js";import{F as A}from"./FieldError-CIOznkIw.js";import{a as B}from"./useFormValidation-hr5mEY2s.js";import{F as O}from"./Flex-B7o_ie7R.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DbglA0qc.js";import"./useObjectRef-B4ikIkxr.js";import"./Label-Du0ObhKE.js";import"./Hidden-DXcGagMc.js";import"./useFocusRing-C-qV4ltP.js";import"./openLink-iaf6h5Vg.js";import"./useLabel-DttWp7u_.js";import"./useLabels-CyId-J7Z.js";import"./number-BgaIE-sV.js";import"./I18nProvider-Cp8YwWQe.js";import"./useButton-b3MTXzJF.js";import"./usePress-C87_1f3H.js";import"./textSelection-DtJZPEXI.js";import"./useHover-iQz_in6H.js";import"./FieldError-D3Li39rU.js";import"./Text-D1k2Dp8f.js";import"./Autocomplete-DZgLERJG.js";import"./keyboard-SH1FHugW.js";import"./useEvent-B9gIp-0I.js";import"./useLocalizedStringFormatter-DJopSl5i.js";import"./useControlledState-VUJiIP94.js";import"./useTextField-DinD4WeQ.js";import"./useField-O4p38GKT.js";import"./useFormReset-DGDQjoCT.js";const H={"bui-PasswordField":"_bui-PasswordField_1sbb6_20","bui-PasswordFieldInput":"_bui-PasswordFieldInput_1sbb6_27","bui-PasswordFieldInputWrapper":"_bui-PasswordFieldInputWrapper_1sbb6_40","bui-PasswordFieldIcon":"_bui-PasswordFieldIcon_1sbb6_67","bui-PasswordFieldVisibility":"_bui-PasswordFieldVisibility_1sbb6_128"},U=V()({styles:H,classNames:{root:"bui-PasswordField",inputWrapper:"bui-PasswordFieldInputWrapper",input:"bui-PasswordFieldInput",inputIcon:"bui-PasswordFieldIcon",inputVisibility:"bui-PasswordFieldVisibility"},bg:"consumer",propDefs:{size:{dataAttribute:!0,default:"small"},className:{},icon:{},placeholder:{},label:{},description:{},secondaryLabel:{}}}),t=P.forwardRef((r,D)=>{const{ownProps:j,restProps:o,dataAttributes:p}=q(U,r),{classes:n,label:F,icon:h,secondaryLabel:S,placeholder:W,description:I}=j;P.useEffect(()=>{!F&&!o["aria-label"]&&!o["aria-labelledby"]&&console.warn("PasswordField requires either a visible label, aria-label, or aria-labelledby for accessibility")},[F,o["aria-label"],o["aria-labelledby"]]);const _=S||(o.isRequired?"Required":null),[l,R]=P.useState(!1);return e.jsxs(T,{className:n.root,...p,type:"password",...o,ref:D,children:[e.jsx(L,{label:F,secondaryLabel:_,description:I,descriptionSlot:"description"}),e.jsxs("div",{className:n.inputWrapper,"data-size":p["data-size"],children:[h&&e.jsx("div",{className:n.inputIcon,"data-size":p["data-size"],"aria-hidden":"true",children:h}),e.jsx(E,{className:n.input,...h&&{"data-icon":!0},placeholder:W,type:l?"text":"password"}),e.jsx($,{"data-size":p["data-size"],"data-variant":"tertiary","aria-label":l?"Hide value":"Show value","aria-controls":l?"text":"password","aria-expanded":l,onPress:()=>R(z=>!z),className:n.inputVisibility,children:l?e.jsx(k,{}):e.jsx(C,{})})]}),e.jsx(A,{})]})});t.displayName="PasswordField";t.__docgenInfo={description:`A text input for password entry with a toggleable visibility button, integrated label, and inline error display.

@public`,methods:[],displayName:"PasswordField",props:{size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the password field
@defaultValue 'medium'`},className:{required:!1,tsType:{name:"string"},description:""},icon:{required:!1,tsType:{name:"ReactNode"},description:"An icon to render before the input"},placeholder:{required:!1,tsType:{name:"string"},description:"Text to display in the input when it has no value"},label:{required:!1,tsType:{name:"FieldLabelProps['label']",raw:"FieldLabelProps['label']"},description:""},description:{required:!1,tsType:{name:"FieldLabelProps['description']",raw:"FieldLabelProps['description']"},description:""},secondaryLabel:{required:!1,tsType:{name:"FieldLabelProps['secondaryLabel']",raw:"FieldLabelProps['secondaryLabel']"},description:""}},composes:["Omit"]};const a=N.meta({title:"Backstage UI/PasswordField",component:t,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"}}}),s=a.story({args:{name:"secret",placeholder:"Enter a secret",style:{maxWidth:"300px"}}}),u=a.story({args:{...s.input.args},render:r=>e.jsxs(O,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(t,{...r,size:"small",icon:e.jsx(v,{})}),e.jsx(t,{...r,size:"medium",icon:e.jsx(v,{})})]})}),c=a.story({args:{...s.input.args,defaultValue:"https://example.com"}}),i=a.story({args:{...s.input.args,label:"Label"}}),m=a.story({args:{...i.input.args,description:"Description"}}),b=a.story({args:{...i.input.args,isRequired:!0}}),g=a.story({args:{...s.input.args,isDisabled:!0}}),d=a.story({args:{...s.input.args},render:r=>e.jsx(t,{...r,size:"small",icon:e.jsx(v,{})})}),f=d.extend({args:{isDisabled:!0}}),y=a.story({args:{...i.input.args},render:r=>e.jsx(B,{validationErrors:{secret:"Invalid secret"},children:e.jsx(t,{...r})})}),x=a.story({args:{...i.input.args,validate:r=>r==="admin"?"Nice try!":null}}),w=a.story({render:()=>e.jsxs(e.Fragment,{children:[e.jsx(L,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(t,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})});s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...w.input.parameters?.docs?.source}}};const je=["Default","Sizes","DefaultValue","WithLabel","WithDescription","Required","Disabled","WithIcon","DisabledWithIcon","ShowError","Validation","CustomField"];export{w as CustomField,s as Default,c as DefaultValue,g as Disabled,f as DisabledWithIcon,b as Required,y as ShowError,u as Sizes,x as Validation,m as WithDescription,d as WithIcon,i as WithLabel,je as __namedExportsOrder};
