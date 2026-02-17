import{r as W,j as e,p as C}from"./iframe-sMBKWU31.js";import{$ as T}from"./Button-D2UFfcp3.js";import{$ as A}from"./Input-D7kopnSP.js";import{$ as B}from"./TextField-DefjrNQd.js";import{c as y}from"./clsx-B-dksMZM.js";import{a as O}from"./useStyles-BuJQ5wiD.js";import{d as Y,Y as H,O as S}from"./index-DRDrMxxc.js";import{F as I}from"./FieldLabel-DBd_4Hdq.js";import{F as U}from"./FieldError-j1jkSXDB.js";import{$ as X}from"./Form-DLOCSc5K.js";import{F as G}from"./Flex-s27_bqKf.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BlKZecta.js";import"./useObjectRef-BKXM9556.js";import"./Label-CDIkEvXs.js";import"./Hidden-DmFnwj_p.js";import"./useFocusable-CXU46gWG.js";import"./useLabel-CiYmh-Ex.js";import"./useLabels-BjdaYtEg.js";import"./context-BjCgPAkJ.js";import"./useButton-DOT08-3b.js";import"./usePress-Szz1o-hS.js";import"./useFocusRing-DxQtxTmP.js";import"./useFormReset-D9wekpkm.js";import"./useControlledState-qMAHWMNX.js";import"./useField-BoD9Us_c.js";import"./FieldError-YnTTHdBf.js";import"./Text-pkaukFn4.js";import"./RSPContexts-6kw7TQ2d.js";import"./useBg-DWrbbRXO.js";const J={classNames:{root:"bui-PasswordField",inputWrapper:"bui-PasswordFieldInputWrapper",input:"bui-PasswordFieldInput",inputIcon:"bui-PasswordFieldIcon",inputVisibility:"bui-PasswordFieldVisibility"},dataAttributes:{size:["small","medium"]}},w={"bui-PasswordField":"_bui-PasswordField_i2y38_20","bui-PasswordFieldInputWrapper":"_bui-PasswordFieldInputWrapper_i2y38_36","bui-PasswordFieldIcon":"_bui-PasswordFieldIcon_i2y38_62","bui-PasswordFieldInput":"_bui-PasswordFieldInput_i2y38_36","bui-PasswordFieldVisibility":"_bui-PasswordFieldVisibility_i2y38_123"},f=W.forwardRef((r,j)=>{const{label:h,"aria-label":P,"aria-labelledby":v}=r;W.useEffect(()=>{!h&&!P&&!v&&console.warn("PasswordField requires either a visible label, aria-label, or aria-labelledby for accessibility")},[h,P,v]);const{classNames:t,dataAttributes:x,cleanedProps:L}=O(J,{size:"small",...r}),{className:z,description:R,icon:D,isRequired:V,secondaryLabel:_,placeholder:$,...N}=L,E=_||(V?"Required":null),[F,q]=W.useState(!1);return e.jsxs(B,{className:y(t.root,w[t.root],z),...x,"aria-label":P,"aria-labelledby":v,type:"password",...N,ref:j,children:[e.jsx(I,{label:h,secondaryLabel:E,description:R}),e.jsxs("div",{className:y(t.inputWrapper,w[t.inputWrapper]),"data-size":x["data-size"],children:[D&&e.jsx("div",{className:y(t.inputIcon,w[t.inputIcon]),"data-size":x["data-size"],"aria-hidden":"true",children:D}),e.jsx(A,{className:y(t.input,w[t.input]),...D&&{"data-icon":!0},placeholder:$,type:F?"text":"password"}),e.jsx(T,{"data-size":x["data-size"],"data-variant":"tertiary","aria-label":F?"Hide value":"Show value","aria-controls":F?"text":"password","aria-expanded":F,onPress:()=>q(k=>!k),className:y(t.inputVisibility,w[t.inputVisibility]),children:F?e.jsx(Y,{}):e.jsx(H,{})})]}),e.jsx(U,{})]})});f.displayName="PasswordField";f.__docgenInfo={description:"@public",methods:[],displayName:"PasswordField",props:{icon:{required:!1,tsType:{name:"ReactNode"},description:"An icon to render before the input"},size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the password field
@defaultValue 'medium'`},placeholder:{required:!1,tsType:{name:"string"},description:"Text to display in the input when it has no value"}},composes:["AriaTextFieldProps","Omit"]};const i=C.meta({title:"Backstage UI/PasswordField",component:f,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"}}}),s=i.story({args:{name:"secret",placeholder:"Enter a secret",style:{maxWidth:"300px"}}}),n=i.story({args:{...s.input.args},render:r=>e.jsxs(G,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(f,{...r,size:"small",icon:e.jsx(S,{})}),e.jsx(f,{...r,size:"medium",icon:e.jsx(S,{})})]})}),l=i.story({args:{...s.input.args,defaultValue:"https://example.com"}}),a=i.story({args:{...s.input.args,label:"Label"}}),d=i.story({args:{...a.input.args,description:"Description"}}),p=i.story({args:{...a.input.args,isRequired:!0}}),u=i.story({args:{...s.input.args,isDisabled:!0}}),o=i.story({args:{...s.input.args},render:r=>e.jsx(f,{...r,size:"small",icon:e.jsx(S,{})})}),c=o.extend({args:{isDisabled:!0}}),m=i.story({args:{...a.input.args},render:r=>e.jsx(X,{validationErrors:{secret:"Invalid secret"},children:e.jsx(f,{...r})})}),b=i.story({args:{...a.input.args,validate:r=>r==="admin"?"Nice try!":null}}),g=i.story({render:()=>e.jsxs(e.Fragment,{children:[e.jsx(I,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(f,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})});s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const Default = () => (
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
})`,...g.input.parameters?.docs?.source}}};const Se=["Default","Sizes","DefaultValue","WithLabel","WithDescription","Required","Disabled","WithIcon","DisabledWithIcon","ShowError","Validation","CustomField"];export{g as CustomField,s as Default,l as DefaultValue,u as Disabled,c as DisabledWithIcon,p as Required,m as ShowError,n as Sizes,b as Validation,d as WithDescription,o as WithIcon,a as WithLabel,Se as __namedExportsOrder};
