import{r as W,j as e,p as C}from"./iframe-BVVWNhNF.js";import{$ as T}from"./Button-Bm135BSn.js";import{$ as A}from"./Input-9sDLmjiN.js";import{$ as B}from"./TextField-BIfjfYEE.js";import{c as w}from"./clsx-B-dksMZM.js";import{u as O}from"./useStyles-C0OCQ1xE.js";import{d as Y,Y as H,O as S}from"./index-BEqd7C-9.js";import{F as I}from"./FieldLabel-CqzsNO-z.js";import{F as U}from"./FieldError-CB1yjsEk.js";import{$ as X}from"./Form-BpV6zGov.js";import{F as G}from"./Flex-CS50wTtA.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CjiodjOE.js";import"./useObjectRef-DqEMLz3o.js";import"./Label-DTLZAQO7.js";import"./Hidden-DggWtAde.js";import"./useFocusable-BBTko2GO.js";import"./useLabel-BVBp0F3h.js";import"./useLabels-C6NirF2g.js";import"./context-CvgYpoK-.js";import"./useButton-CdjMzvZ4.js";import"./usePress-CkQSniU6.js";import"./useFocusRing-Dn5s9iSo.js";import"./useFormReset-D5TcqgWE.js";import"./useControlledState-BKeT2ue2.js";import"./useField-C3F2IxLT.js";import"./FieldError-rCMLrX0g.js";import"./Text-AZcHzXR7.js";import"./RSPContexts-h7q-5nVd.js";import"./useSurface-XvOdfZQa.js";const J={classNames:{root:"bui-PasswordField",inputWrapper:"bui-PasswordFieldInputWrapper",input:"bui-PasswordFieldInput",inputIcon:"bui-PasswordFieldIcon",inputVisibility:"bui-PasswordFieldVisibility"},dataAttributes:{size:["small","medium"]}},x={"bui-PasswordField":"_bui-PasswordField_1hg5u_20","bui-PasswordFieldInputWrapper":"_bui-PasswordFieldInputWrapper_1hg5u_36","bui-PasswordFieldIcon":"_bui-PasswordFieldIcon_1hg5u_72","bui-PasswordFieldInput":"_bui-PasswordFieldInput_1hg5u_36","bui-PasswordFieldVisibility":"_bui-PasswordFieldVisibility_1hg5u_133"},f=W.forwardRef((r,j)=>{const{label:y,"aria-label":P,"aria-labelledby":v}=r;W.useEffect(()=>{!y&&!P&&!v&&console.warn("PasswordField requires either a visible label, aria-label, or aria-labelledby for accessibility")},[y,P,v]);const{classNames:i,dataAttributes:h,cleanedProps:L}=O(J,{size:"small",...r}),{className:z,description:R,icon:D,isRequired:V,secondaryLabel:_,placeholder:$,...N}=L,E=_||(V?"Required":null),[F,q]=W.useState(!1);return e.jsxs(B,{className:w(i.root,x[i.root],z),...h,"aria-label":P,"aria-labelledby":v,type:"password",...N,ref:j,children:[e.jsx(I,{label:y,secondaryLabel:E,description:R}),e.jsxs("div",{className:w(i.inputWrapper,x[i.inputWrapper]),"data-size":h["data-size"],children:[D&&e.jsx("div",{className:w(i.inputIcon,x[i.inputIcon]),"data-size":h["data-size"],"aria-hidden":"true",children:D}),e.jsx(A,{className:w(i.input,x[i.input]),...D&&{"data-icon":!0},placeholder:$,type:F?"text":"password"}),e.jsx(T,{"data-size":h["data-size"],"data-variant":"tertiary","aria-label":F?"Hide value":"Show value","aria-controls":F?"text":"password","aria-expanded":F,onPress:()=>q(k=>!k),className:w(i.inputVisibility,x[i.inputVisibility]),children:F?e.jsx(Y,{}):e.jsx(H,{})})]}),e.jsx(U,{})]})});f.displayName="PasswordField";f.__docgenInfo={description:"@public",methods:[],displayName:"PasswordField",props:{icon:{required:!1,tsType:{name:"ReactNode"},description:"An icon to render before the input"},size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the password field
@defaultValue 'medium'`},placeholder:{required:!1,tsType:{name:"string"},description:"Text to display in the input when it has no value"}},composes:["AriaTextFieldProps","Omit"]};const t=C.meta({title:"Backstage UI/PasswordField",component:f,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"}}}),s=t.story({args:{name:"secret",placeholder:"Enter a secret",style:{maxWidth:"300px"}}}),n=t.story({args:{...s.input.args},render:r=>e.jsxs(G,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(f,{...r,size:"small",icon:e.jsx(S,{})}),e.jsx(f,{...r,size:"medium",icon:e.jsx(S,{})})]})}),l=t.story({args:{...s.input.args,defaultValue:"https://example.com"}}),a=t.story({args:{...s.input.args,label:"Label"}}),d=t.story({args:{...a.input.args,description:"Description"}}),p=t.story({args:{...a.input.args,isRequired:!0}}),u=t.story({args:{...s.input.args,isDisabled:!0}}),o=t.story({args:{...s.input.args},render:r=>e.jsx(f,{...r,size:"small",icon:e.jsx(S,{})})}),c=o.extend({args:{isDisabled:!0}}),m=t.story({args:{...a.input.args},render:r=>e.jsx(X,{validationErrors:{secret:"Invalid secret"},children:e.jsx(f,{...r})})}),b=t.story({args:{...a.input.args,validate:r=>r==="admin"?"Nice try!":null}}),g=t.story({render:()=>e.jsxs(e.Fragment,{children:[e.jsx(I,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(f,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})});s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const Default = () => (
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
