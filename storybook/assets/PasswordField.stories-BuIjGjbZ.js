import{ap as _,r as P,am as q,j as e,p as $}from"./iframe-D9hL09PA.js";import{$ as E}from"./Button-Btdb6Gt1.js";import{$ as N}from"./Input-aygF90oT.js";import{$ as T}from"./TextField-DnhkI3ej.js";import{d as k,Y as C,O as D}from"./index-dbWln3Vb.js";import{F as A}from"./FieldError-BuYXtPsl.js";import{F as L}from"./FieldLabel-IRNaO65k.js";import{$ as B}from"./Form-DgMTnxU2.js";import{F as O}from"./Flex-CBQ0Jvtr.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-8rOIuO_x.js";import"./useObjectRef-CYL2AJjt.js";import"./Label-B0FHJi2s.js";import"./Hidden-CUiBiOzs.js";import"./useFocusable-UM6WGFLu.js";import"./useLabel-Da7CfHrC.js";import"./useLabels-BH4cOUd6.js";import"./context-CSpJstaO.js";import"./useButton-DBLE6GBH.js";import"./usePress--Sy5avjQ.js";import"./useFocusRing-BtdTPHor.js";import"./useFormReset-w4T0vwaI.js";import"./useControlledState-D54d3NZb.js";import"./useField-C7FqXO32.js";import"./FieldError-dR4WT8oX.js";import"./Text-DZEZYn0b.js";import"./RSPContexts-BvtWyi7E.js";const Y={"bui-PasswordField":"_bui-PasswordField_i2y38_20","bui-PasswordFieldInputWrapper":"_bui-PasswordFieldInputWrapper_i2y38_36","bui-PasswordFieldIcon":"_bui-PasswordFieldIcon_i2y38_62","bui-PasswordFieldInput":"_bui-PasswordFieldInput_i2y38_36","bui-PasswordFieldVisibility":"_bui-PasswordFieldVisibility_i2y38_123"},H=_()({styles:Y,classNames:{root:"bui-PasswordField",inputWrapper:"bui-PasswordFieldInputWrapper",input:"bui-PasswordFieldInput",inputIcon:"bui-PasswordFieldIcon",inputVisibility:"bui-PasswordFieldVisibility"},propDefs:{size:{dataAttribute:!0,default:"small"},className:{},icon:{},placeholder:{},label:{},description:{},secondaryLabel:{}}}),f=P.forwardRef((i,v)=>{const{ownProps:W,restProps:g,dataAttributes:w}=q(H,i),{classes:F,label:x,icon:h,secondaryLabel:S,placeholder:j,description:I}=W;P.useEffect(()=>{!x&&!g["aria-label"]&&!g["aria-labelledby"]&&console.warn("PasswordField requires either a visible label, aria-label, or aria-labelledby for accessibility")},[x,g["aria-label"],g["aria-labelledby"]]);const R=S||(g.isRequired?"Required":null),[y,z]=P.useState(!1);return e.jsxs(T,{className:F.root,...w,type:"password",...g,ref:v,children:[e.jsx(L,{label:x,secondaryLabel:R,description:I}),e.jsxs("div",{className:F.inputWrapper,"data-size":w["data-size"],children:[h&&e.jsx("div",{className:F.inputIcon,"data-size":w["data-size"],"aria-hidden":"true",children:h}),e.jsx(N,{className:F.input,...h&&{"data-icon":!0},placeholder:j,type:y?"text":"password"}),e.jsx(E,{"data-size":w["data-size"],"data-variant":"tertiary","aria-label":y?"Hide value":"Show value","aria-controls":y?"text":"password","aria-expanded":y,onPress:()=>z(V=>!V),className:F.inputVisibility,children:y?e.jsx(k,{}):e.jsx(C,{})})]}),e.jsx(A,{})]})});f.displayName="PasswordField";f.__docgenInfo={description:"@public",methods:[],displayName:"PasswordField",props:{size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the password field
@defaultValue 'medium'`},className:{required:!1,tsType:{name:"string"},description:""},icon:{required:!1,tsType:{name:"ReactNode"},description:"An icon to render before the input"},placeholder:{required:!1,tsType:{name:"string"},description:"Text to display in the input when it has no value"},label:{required:!1,tsType:{name:"FieldLabelProps['label']",raw:"FieldLabelProps['label']"},description:""},description:{required:!1,tsType:{name:"FieldLabelProps['description']",raw:"FieldLabelProps['description']"},description:""},secondaryLabel:{required:!1,tsType:{name:"FieldLabelProps['secondaryLabel']",raw:"FieldLabelProps['secondaryLabel']"},description:""}},composes:["Omit"]};const r=$.meta({title:"Backstage UI/PasswordField",component:f,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"}}}),s=r.story({args:{name:"secret",placeholder:"Enter a secret",style:{maxWidth:"300px"}}}),o=r.story({args:{...s.input.args},render:i=>e.jsxs(O,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(f,{...i,size:"small",icon:e.jsx(D,{})}),e.jsx(f,{...i,size:"medium",icon:e.jsx(D,{})})]})}),n=r.story({args:{...s.input.args,defaultValue:"https://example.com"}}),a=r.story({args:{...s.input.args,label:"Label"}}),l=r.story({args:{...a.input.args,description:"Description"}}),d=r.story({args:{...a.input.args,isRequired:!0}}),p=r.story({args:{...s.input.args,isDisabled:!0}}),t=r.story({args:{...s.input.args},render:i=>e.jsx(f,{...i,size:"small",icon:e.jsx(D,{})})}),u=t.extend({args:{isDisabled:!0}}),c=r.story({args:{...a.input.args},render:i=>e.jsx(B,{validationErrors:{secret:"Invalid secret"},children:e.jsx(f,{...i})})}),m=r.story({args:{...a.input.args,validate:i=>i==="admin"?"Nice try!":null}}),b=r.story({render:()=>e.jsxs(e.Fragment,{children:[e.jsx(L,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(f,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})});s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const Default = () => (
  <PasswordField
    name="secret"
    placeholder="Enter a secret"
    style={{
      maxWidth: "300px",
    }}
  />
);
`,...s.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{code:`const Sizes = () => (
  <Flex direction="row" gap="4" style={{ width: "100%", maxWidth: "600px" }}>
    <PasswordField size="small" icon={<RiSparklingLine />} />
    <PasswordField size="medium" icon={<RiSparklingLine />} />
  </Flex>
);
`,...o.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{code:`const DefaultValue = () => <PasswordField defaultValue="https://example.com" />;
`,...n.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{code:`const WithLabel = () => <PasswordField label="Label" />;
`,...a.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{code:`const WithDescription = () => <PasswordField description="Description" />;
`,...l.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{code:`const Required = () => <PasswordField isRequired />;
`,...d.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{code:`const Disabled = () => <PasswordField isDisabled />;
`,...p.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{code:`const WithIcon = () => (
  <PasswordField size="small" icon={<RiSparklingLine />} />
);
`,...t.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{code:`const DisabledWithIcon = () => <PasswordField isDisabled />;
`,...u.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{code:`const ShowError = () => (
  <Form validationErrors={{ secret: "Invalid secret" }}>
    <PasswordField />
  </Form>
);
`,...c.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{code:`const Validation = () => (
  <PasswordField
    validate={(value) => (value === "admin" ? "Nice try!" : null)}
  />
);
`,...m.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{code:`const CustomField = () => (
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
`,...b.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    name: 'secret',
    placeholder: 'Enter a secret',
    style: {
      maxWidth: '300px'
    }
  }
})`,...s.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...o.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    defaultValue: 'https://example.com'
  }
})`,...n.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    label: 'Label'
  }
})`,...a.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    description: 'Description'
  }
})`,...l.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    isRequired: true
  }
})`,...d.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true
  }
})`,...p.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <PasswordField {...args} size="small" icon={<RiSparklingLine />} />
})`,...t.input.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`WithIcon.extend({
  args: {
    isDisabled: true
  }
})`,...u.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args
  },
  render: args => <Form validationErrors={{
    secret: 'Invalid secret'
  }}>
      <PasswordField {...args} />
    </Form>
})`,...c.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    validate: value => value === 'admin' ? 'Nice try!' : null
  }
})`,...m.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <>
      <FieldLabel htmlFor="custom-field" id="custom-field-label" label="Custom Field" />
      <PasswordField id="custom-field" aria-labelledby="custom-field-label" name="custom-field" defaultValue="Custom Field" />
    </>
})`,...b.input.parameters?.docs?.source}}};const we=["Default","Sizes","DefaultValue","WithLabel","WithDescription","Required","Disabled","WithIcon","DisabledWithIcon","ShowError","Validation","CustomField"];export{b as CustomField,s as Default,n as DefaultValue,p as Disabled,u as DisabledWithIcon,d as Required,c as ShowError,o as Sizes,m as Validation,l as WithDescription,t as WithIcon,a as WithLabel,we as __namedExportsOrder};
