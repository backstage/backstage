import{r as v,j as e}from"./iframe-B6vHPHUS.js";import{$ as T}from"./Button-Bk6CObpo.js";import{$ as k}from"./Input-BwcF8DX8.js";import{$ as C}from"./TextField-Ck-vjTBj.js";import{c as n}from"./clsx-B-dksMZM.js";import{u as A}from"./useStyles-C-y3xpyB.js";import{c as B,Y as O,O as W}from"./index-CX60uPmW.js";import{F as I}from"./FieldLabel-BYLy6GKj.js";import{F as Y}from"./FieldError-CyibdofI.js";import{$ as H}from"./Form-Ck--Lsy1.js";import{F as U}from"./Flex-CUF93du8.js";import"./preload-helper-D9Z9MdNV.js";import"./utils-Dc-c3eC3.js";import"./Label-Bwu2jGwM.js";import"./Hidden-ByRJzAKI.js";import"./useFocusRing-BPooT00c.js";import"./useLabel-BjKVVapu.js";import"./useLabels-CTSau9A7.js";import"./context-DsQFltCn.js";import"./usePress-D5zWsAX_.js";import"./useFormReset-0JlNtNLI.js";import"./useControlledState-DWj3SqXj.js";import"./Text-Gfhg4HaA.js";import"./FieldError-CKbDuQo-.js";import"./RSPContexts-xdSoOCnd.js";const X={classNames:{root:"bui-PasswordField",inputWrapper:"bui-PasswordFieldInputWrapper",input:"bui-PasswordFieldInput",inputIcon:"bui-PasswordFieldIcon",inputVisibility:"bui-PasswordFieldVisibility"},dataAttributes:{size:["small","medium"]}},d={"bui-PasswordField":"_bui-PasswordField_1bjeu_20","bui-PasswordFieldInputWrapper":"_bui-PasswordFieldInputWrapper_1bjeu_36","bui-PasswordFieldIcon":"_bui-PasswordFieldIcon_1bjeu_72","bui-PasswordFieldInput":"_bui-PasswordFieldInput_1bjeu_36","bui-PasswordFieldVisibility":"_bui-PasswordFieldVisibility_1bjeu_133"},t=v.forwardRef((a,D)=>{const{label:w,"aria-label":y,"aria-labelledby":P}=a;v.useEffect(()=>{!w&&!y&&!P&&console.warn("PasswordField requires either a visible label, aria-label, or aria-labelledby for accessibility")},[w,y,P]);const{classNames:r,dataAttributes:c,cleanedProps:S}=A(X,{size:"small",...a}),{className:_,description:z,icon:j,isRequired:L,secondaryLabel:R,placeholder:V,...$}=S,N=R||(L?"Required":null),[l,q]=v.useState(!1);return e.jsxs(C,{className:n(r.root,d[r.root],_),...c,"aria-label":y,"aria-labelledby":P,type:"password",...$,ref:D,children:[e.jsx(I,{label:w,secondaryLabel:N,description:z}),e.jsxs("div",{className:n(r.inputWrapper,d[r.inputWrapper]),"data-size":c["data-size"],children:[j&&e.jsx("div",{className:n(r.inputIcon,d[r.inputIcon]),"data-size":c["data-size"],"aria-hidden":"true",children:j}),e.jsx(k,{className:n(r.input,d[r.input]),...j&&{"data-icon":!0},placeholder:V,type:l?"text":"password"}),e.jsx(T,{"data-size":c["data-size"],"data-variant":"tertiary","aria-label":l?"Hide value":"Show value","aria-controls":l?"text":"password","aria-expanded":l,onPress:()=>q(E=>!E),className:n(r.inputVisibility,d[r.inputVisibility]),children:l?e.jsx(B,{}):e.jsx(O,{})})]}),e.jsx(Y,{})]})});t.displayName="PasswordField";t.__docgenInfo={description:"@public",methods:[],displayName:"PasswordField",props:{icon:{required:!1,tsType:{name:"ReactNode"},description:"An icon to render before the input"},size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the password field
@defaultValue 'medium'`},placeholder:{required:!1,tsType:{name:"string"},description:"Text to display in the input when it has no value"}},composes:["AriaTextFieldProps","Omit"]};const he={title:"Backstage UI/PasswordField",component:t,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"}}},s={args:{name:"secret",placeholder:"Enter a secret",style:{maxWidth:"300px"}}},m={args:{...s.args},render:a=>e.jsxs(U,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(t,{...a,size:"small",icon:e.jsx(W,{})}),e.jsx(t,{...a,size:"medium",icon:e.jsx(W,{})})]})},u={args:{...s.args,defaultValue:"https://example.com"}},i={args:{...s.args,label:"Label"}},p={args:{...i.args,description:"Description"}},b={args:{...i.args,isRequired:!0}},g={args:{...s.args,isDisabled:!0}},o={args:{...s.args},render:a=>e.jsx(t,{...a,size:"small",icon:e.jsx(W,{})})},f={args:{...o.args,isDisabled:!0},render:o.render},x={args:{...i.args},render:a=>e.jsx(H,{validationErrors:{secret:"Invalid secret"},children:e.jsx(t,{...a})})},F={args:{...i.args,validate:a=>a==="admin"?"Nice try!":null}},h={render:()=>e.jsxs(e.Fragment,{children:[e.jsx(I,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(t,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'secret',
    placeholder: 'Enter a secret',
    style: {
      maxWidth: '300px'
    }
  }
}`,...s.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: args => <Flex direction="row" gap="4" style={{
    width: '100%',
    maxWidth: '600px'
  }}>
      <PasswordField {...args} size="small" icon={<RiSparklingLine />} />
      <PasswordField {...args} size="medium" icon={<RiSparklingLine />} />
    </Flex>
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    defaultValue: 'https://example.com'
  }
}`,...u.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    label: 'Label'
  }
}`,...i.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    description: 'Description'
  }
}`,...p.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    isRequired: true
  }
}`,...b.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    isDisabled: true
  }
}`,...g.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: args => <PasswordField {...args} size="small" icon={<RiSparklingLine />} />
}`,...o.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithIcon.args,
    isDisabled: true
  },
  render: WithIcon.render
}`,...f.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args
  },
  render: args => <Form validationErrors={{
    secret: 'Invalid secret'
  }}>
      <PasswordField {...args} />
    </Form>
}`,...x.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    validate: value => value === 'admin' ? 'Nice try!' : null
  }
}`,...F.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <>
      <FieldLabel htmlFor="custom-field" id="custom-field-label" label="Custom Field" />
      <PasswordField id="custom-field" aria-labelledby="custom-field-label" name="custom-field" defaultValue="Custom Field" />
    </>
}`,...h.parameters?.docs?.source}}};const we=["Default","Sizes","DefaultValue","WithLabel","WithDescription","Required","Disabled","WithIcon","DisabledWithIcon","ShowError","Validation","CustomField"];export{h as CustomField,s as Default,u as DefaultValue,g as Disabled,f as DisabledWithIcon,b as Required,x as ShowError,m as Sizes,F as Validation,p as WithDescription,o as WithIcon,i as WithLabel,we as __namedExportsOrder,he as default};
