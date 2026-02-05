import{r as j,j as e,p as C}from"./iframe-M9O-K8SB.js";import{$ as T}from"./Button-Dkbd3KcU.js";import{$ as A}from"./Input-MCe13Yrn.js";import{$ as B}from"./TextField-Dsmdajbm.js";import{c as w}from"./clsx-B-dksMZM.js";import{u as O}from"./useStyles-BRwt6BXn.js";import{d as Y,Y as H,O as W}from"./index-BKJKY9Wv.js";import{F as S}from"./FieldLabel-Dm8Ex6MU.js";import{F as U}from"./FieldError-Dr6Rp0Rr.js";import{$ as X}from"./Form-BBJy9cFl.js";import{F as G}from"./Flex-Bz2InqMs.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BXllfVt4.js";import"./useObjectRef-BPFp5snO.js";import"./Label-o9S_v-xF.js";import"./Hidden-DTd05gNK.js";import"./useFocusable-BwFERnd_.js";import"./useLabel-COjMvP6r.js";import"./useLabels-C3g0X61E.js";import"./context-Bv6kxITJ.js";import"./useButton-F9hepFpV.js";import"./usePress-ByOsZuB9.js";import"./useFocusRing-COnCKKka.js";import"./useFormReset-DJISnqgL.js";import"./useControlledState-DzBnLbpE.js";import"./useField-BgIPqRrs.js";import"./FieldError-BifbfugT.js";import"./Text-B7PuQZMK.js";import"./RSPContexts-BdpIjeVF.js";import"./useSurface-CJaN3YoD.js";const J={classNames:{root:"bui-PasswordField",inputWrapper:"bui-PasswordFieldInputWrapper",input:"bui-PasswordFieldInput",inputIcon:"bui-PasswordFieldIcon",inputVisibility:"bui-PasswordFieldVisibility"},dataAttributes:{size:["small","medium"]}},x={"bui-PasswordField":"_bui-PasswordField_1bjeu_20","bui-PasswordFieldInputWrapper":"_bui-PasswordFieldInputWrapper_1bjeu_36","bui-PasswordFieldIcon":"_bui-PasswordFieldIcon_1bjeu_72","bui-PasswordFieldInput":"_bui-PasswordFieldInput_1bjeu_36","bui-PasswordFieldVisibility":"_bui-PasswordFieldVisibility_1bjeu_133"},f=j.forwardRef((r,I)=>{const{label:h,"aria-label":P,"aria-labelledby":v}=r;j.useEffect(()=>{!h&&!P&&!v&&console.warn("PasswordField requires either a visible label, aria-label, or aria-labelledby for accessibility")},[h,P,v]);const{classNames:i,dataAttributes:y,cleanedProps:L}=O(J,{size:"small",...r}),{className:z,description:R,icon:D,isRequired:V,secondaryLabel:_,placeholder:$,...N}=L,E=_||(V?"Required":null),[F,q]=j.useState(!1);return e.jsxs(B,{className:w(i.root,x[i.root],z),...y,"aria-label":P,"aria-labelledby":v,type:"password",...N,ref:I,children:[e.jsx(S,{label:h,secondaryLabel:E,description:R}),e.jsxs("div",{className:w(i.inputWrapper,x[i.inputWrapper]),"data-size":y["data-size"],children:[D&&e.jsx("div",{className:w(i.inputIcon,x[i.inputIcon]),"data-size":y["data-size"],"aria-hidden":"true",children:D}),e.jsx(A,{className:w(i.input,x[i.input]),...D&&{"data-icon":!0},placeholder:$,type:F?"text":"password"}),e.jsx(T,{"data-size":y["data-size"],"data-variant":"tertiary","aria-label":F?"Hide value":"Show value","aria-controls":F?"text":"password","aria-expanded":F,onPress:()=>q(k=>!k),className:w(i.inputVisibility,x[i.inputVisibility]),children:F?e.jsx(Y,{}):e.jsx(H,{})})]}),e.jsx(U,{})]})});f.displayName="PasswordField";f.__docgenInfo={description:"@public",methods:[],displayName:"PasswordField",props:{icon:{required:!1,tsType:{name:"ReactNode"},description:"An icon to render before the input"},size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the password field
@defaultValue 'medium'`},placeholder:{required:!1,tsType:{name:"string"},description:"Text to display in the input when it has no value"}},composes:["AriaTextFieldProps","Omit"]};const t=C.meta({title:"Backstage UI/PasswordField",component:f,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"}}}),s=t.story({args:{name:"secret",placeholder:"Enter a secret",style:{maxWidth:"300px"}}}),n=t.story({args:{...s.input.args},render:r=>e.jsxs(G,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(f,{...r,size:"small",icon:e.jsx(W,{})}),e.jsx(f,{...r,size:"medium",icon:e.jsx(W,{})})]})}),l=t.story({args:{...s.input.args,defaultValue:"https://example.com"}}),a=t.story({args:{...s.input.args,label:"Label"}}),d=t.story({args:{...a.input.args,description:"Description"}}),p=t.story({args:{...a.input.args,isRequired:!0}}),u=t.story({args:{...s.input.args,isDisabled:!0}}),o=t.story({args:{...s.input.args},render:r=>e.jsx(f,{...r,size:"small",icon:e.jsx(W,{})})}),c=o.extend({args:{isDisabled:!0}}),m=t.story({args:{...a.input.args},render:r=>e.jsx(X,{validationErrors:{secret:"Invalid secret"},children:e.jsx(f,{...r})})}),b=t.story({args:{...a.input.args,validate:r=>r==="admin"?"Nice try!":null}}),g=t.story({render:()=>e.jsxs(e.Fragment,{children:[e.jsx(S,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(f,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})});s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const Default = () => (
  <PasswordField
    name="secret"
    placeholder="Enter a secret"
    style={{
      maxWidth: "300px",
    }}
  />
);
`,...s.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{code:`const Sizes = () => (
  <Flex direction="row" gap="4" style={{ width: "100%", maxWidth: "600px" }}>
    <PasswordField size="small" icon={<RiSparklingLine />} />
    <PasswordField size="medium" icon={<RiSparklingLine />} />
  </Flex>
);
`,...n.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{code:`const DefaultValue = () => <PasswordField defaultValue="https://example.com" />;
`,...l.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{code:`const WithLabel = () => <PasswordField label="Label" />;
`,...a.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{code:`const WithDescription = () => <PasswordField description="Description" />;
`,...d.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{code:`const Required = () => <PasswordField isRequired />;
`,...p.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{code:`const Disabled = () => <PasswordField isDisabled />;
`,...u.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{code:`const WithIcon = () => (
  <PasswordField size="small" icon={<RiSparklingLine />} />
);
`,...o.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{code:`const DisabledWithIcon = () => <PasswordField isDisabled />;
`,...c.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{code:`const ShowError = () => (
  <Form validationErrors={{ secret: "Invalid secret" }}>
    <PasswordField />
  </Form>
);
`,...m.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{code:`const Validation = () => (
  <PasswordField
    validate={(value) => (value === "admin" ? "Nice try!" : null)}
  />
);
`,...b.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{code:`const CustomField = () => (
  <>
    <FieldLabel
      htmlFor="custom-field"
      id="custom-field-label"
      label="Custom Field"
    />
    <PasswordField
      id="custom-field"
      aria-labelledby="custom-field-label"
      name="custom-field"
      defaultValue="Custom Field"
    />
  </>
);
`,...g.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    name: 'secret',
    placeholder: 'Enter a secret',
    style: {
      maxWidth: '300px'
    }
  }
})`,...s.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...n.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    defaultValue: 'https://example.com'
  }
})`,...l.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    label: 'Label'
  }
})`,...a.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    description: 'Description'
  }
})`,...d.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    isRequired: true
  }
})`,...p.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true
  }
})`,...u.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <PasswordField {...args} size="small" icon={<RiSparklingLine />} />
})`,...o.input.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`WithIcon.extend({
  args: {
    isDisabled: true
  }
})`,...c.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args
  },
  render: args => <Form validationErrors={{
    secret: 'Invalid secret'
  }}>
      <PasswordField {...args} />
    </Form>
})`,...m.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    validate: value => value === 'admin' ? 'Nice try!' : null
  }
})`,...b.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <>
      <FieldLabel htmlFor="custom-field" id="custom-field-label" label="Custom Field" />
      <PasswordField id="custom-field" aria-labelledby="custom-field-label" name="custom-field" defaultValue="Custom Field" />
    </>
})`,...g.input.parameters?.docs?.source}}};const We=["Default","Sizes","DefaultValue","WithLabel","WithDescription","Required","Disabled","WithIcon","DisabledWithIcon","ShowError","Validation","CustomField"];export{g as CustomField,s as Default,l as DefaultValue,u as Disabled,c as DisabledWithIcon,p as Required,m as ShowError,n as Sizes,b as Validation,d as WithDescription,o as WithIcon,a as WithLabel,We as __namedExportsOrder};
