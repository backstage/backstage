import{r as W,j as e,a3 as k}from"./iframe-DgkzaRcz.js";import{$ as C}from"./Button-Dxt_JtTg.js";import{$ as A}from"./Input-Bf3I19_X.js";import{$ as B}from"./TextField-BMwi5zXN.js";import{c as d}from"./clsx-B-dksMZM.js";import{u as O}from"./useStyles-CbKXL5Hp.js";import{c as Y,Y as H,O as I}from"./index-Dr2gkvOD.js";import{F as D}from"./FieldLabel-CJpfunyo.js";import{F as U}from"./FieldError-BU1u1e3-.js";import{$ as X}from"./Form-rOtt71Pz.js";import{F as G}from"./Flex-B8qpB4By.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DXdUakEl.js";import"./useObjectRef-DdJCRQmh.js";import"./Label-CC5zQ6hO.js";import"./Hidden-CuH5BjYK.js";import"./useFocusable-Bs2V2rS4.js";import"./useLabel-BeqnMw1G.js";import"./useLabels-C9J2TuTi.js";import"./context-CuzNOC1H.js";import"./usePress-D8Rxhpsk.js";import"./useFocusRing-BrGlfS6q.js";import"./useFormReset-CB9gDTWt.js";import"./useControlledState-14pZgbQJ.js";import"./Text-BZcYjgFv.js";import"./FieldError-BlwP2hNv.js";import"./RSPContexts-D2HdzK3T.js";const J={classNames:{root:"bui-PasswordField",inputWrapper:"bui-PasswordFieldInputWrapper",input:"bui-PasswordFieldInput",inputIcon:"bui-PasswordFieldIcon",inputVisibility:"bui-PasswordFieldVisibility"},dataAttributes:{size:["small","medium"]}},u={"bui-PasswordField":"_bui-PasswordField_1bjeu_20","bui-PasswordFieldInputWrapper":"_bui-PasswordFieldInputWrapper_1bjeu_36","bui-PasswordFieldIcon":"_bui-PasswordFieldIcon_1bjeu_72","bui-PasswordFieldInput":"_bui-PasswordFieldInput_1bjeu_36","bui-PasswordFieldVisibility":"_bui-PasswordFieldVisibility_1bjeu_133"},o=W.forwardRef((r,S)=>{const{label:h,"aria-label":P,"aria-labelledby":j}=r;W.useEffect(()=>{!h&&!P&&!j&&console.warn("PasswordField requires either a visible label, aria-label, or aria-labelledby for accessibility")},[h,P,j]);const{classNames:s,dataAttributes:p,cleanedProps:_}=O(J,{size:"small",...r}),{className:z,description:L,icon:v,isRequired:R,secondaryLabel:V,placeholder:$,...N}=_,q=V||(R?"Required":null),[l,E]=W.useState(!1);return e.jsxs(B,{className:d(s.root,u[s.root],z),...p,"aria-label":P,"aria-labelledby":j,type:"password",...N,ref:S,children:[e.jsx(D,{label:h,secondaryLabel:q,description:L}),e.jsxs("div",{className:d(s.inputWrapper,u[s.inputWrapper]),"data-size":p["data-size"],children:[v&&e.jsx("div",{className:d(s.inputIcon,u[s.inputIcon]),"data-size":p["data-size"],"aria-hidden":"true",children:v}),e.jsx(A,{className:d(s.input,u[s.input]),...v&&{"data-icon":!0},placeholder:$,type:l?"text":"password"}),e.jsx(C,{"data-size":p["data-size"],"data-variant":"tertiary","aria-label":l?"Hide value":"Show value","aria-controls":l?"text":"password","aria-expanded":l,onPress:()=>E(T=>!T),className:d(s.inputVisibility,u[s.inputVisibility]),children:l?e.jsx(Y,{}):e.jsx(H,{})})]}),e.jsx(U,{})]})});o.displayName="PasswordField";o.__docgenInfo={description:"@public",methods:[],displayName:"PasswordField",props:{icon:{required:!1,tsType:{name:"ReactNode"},description:"An icon to render before the input"},size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the password field
@defaultValue 'medium'`},placeholder:{required:!1,tsType:{name:"string"},description:"Text to display in the input when it has no value"}},composes:["AriaTextFieldProps","Omit"]};const a=k.meta({title:"Backstage UI/PasswordField",component:o,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"}}}),i=a.story({args:{name:"secret",placeholder:"Enter a secret",style:{maxWidth:"300px"}}}),m=a.story({args:{...i.input.args},render:r=>e.jsxs(G,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(o,{...r,size:"small",icon:e.jsx(I,{})}),e.jsx(o,{...r,size:"medium",icon:e.jsx(I,{})})]})}),c=a.story({args:{...i.input.args,defaultValue:"https://example.com"}}),t=a.story({args:{...i.input.args,label:"Label"}}),b=a.story({args:{...t.input.args,description:"Description"}}),g=a.story({args:{...t.input.args,isRequired:!0}}),f=a.story({args:{...i.input.args,isDisabled:!0}}),n=a.story({args:{...i.input.args},render:r=>e.jsx(o,{...r,size:"small",icon:e.jsx(I,{})})}),y=a.story({args:{...n.input.args,isDisabled:!0},render:n.input.render}),x=a.story({args:{...t.input.args},render:r=>e.jsx(X,{validationErrors:{secret:"Invalid secret"},children:e.jsx(o,{...r})})}),F=a.story({args:{...t.input.args,validate:r=>r==="admin"?"Nice try!":null}}),w=a.story({render:()=>e.jsxs(e.Fragment,{children:[e.jsx(D,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(o,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})});i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    name: 'secret',
    placeholder: 'Enter a secret',
    style: {
      maxWidth: '300px'
    }
  }
})`,...i.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...m.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    defaultValue: 'https://example.com'
  }
})`,...c.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    label: 'Label'
  }
})`,...t.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    description: 'Description'
  }
})`,...b.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    isRequired: true
  }
})`,...g.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true
  }
})`,...f.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <PasswordField {...args} size="small" icon={<RiSparklingLine />} />
})`,...n.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithIcon.input.args,
    isDisabled: true
  },
  render: WithIcon.input.render
})`,...y.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args
  },
  render: args => <Form validationErrors={{
    secret: 'Invalid secret'
  }}>
      <PasswordField {...args} />
    </Form>
})`,...x.input.parameters?.docs?.source}}};F.input.parameters={...F.input.parameters,docs:{...F.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    validate: value => value === 'admin' ? 'Nice try!' : null
  }
})`,...F.input.parameters?.docs?.source}}};w.input.parameters={...w.input.parameters,docs:{...w.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <>
      <FieldLabel htmlFor="custom-field" id="custom-field-label" label="Custom Field" />
      <PasswordField id="custom-field" aria-labelledby="custom-field-label" name="custom-field" defaultValue="Custom Field" />
    </>
})`,...w.input.parameters?.docs?.source}}};const je=["Default","Sizes","DefaultValue","WithLabel","WithDescription","Required","Disabled","WithIcon","DisabledWithIcon","ShowError","Validation","CustomField"];export{w as CustomField,i as Default,c as DefaultValue,f as Disabled,y as DisabledWithIcon,g as Required,x as ShowError,m as Sizes,F as Validation,b as WithDescription,n as WithIcon,t as WithLabel,je as __namedExportsOrder};
