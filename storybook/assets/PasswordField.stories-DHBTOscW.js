import{r as v,j as e}from"./iframe-Dg7jNfgV.js";import{$ as T}from"./Button-DMfefpCO.js";import{$ as k}from"./Input-Bn0mLi29.js";import{$ as C}from"./TextField-l2yYYTKO.js";import{c as n}from"./clsx-B-dksMZM.js";import{u as B}from"./useStyles-CF8dTXWk.js";import{c as A,Y as O,O as S}from"./index-BQGsxAyO.js";import{F as W}from"./FieldLabel-Br4wYfm2.js";import{F as Y}from"./FieldError-CpHUOZLa.js";import{$ as H}from"./Form-CEg3Q_oK.js";import{F as U}from"./Flex-CPbcRrPB.js";import"./preload-helper-D9Z9MdNV.js";import"./utils-DlhuadZk.js";import"./Hidden-HB7QdOxe.js";import"./useFocusRing-Qh6jG-2Q.js";import"./usePress-DCHo0S64.js";import"./useFormReset-CsSbNfBn.js";import"./useControlledState-t75cWlZQ.js";import"./Text-BjBwqdNm.js";import"./useLabels-_tWH_d4I.js";import"./FieldError-Lb-Euq4Y.js";import"./RSPContexts-DDPOJnuj.js";import"./Label-Dyv7qm72.js";const d={"bui-PasswordField":"_bui-PasswordField_1bjeu_20","bui-PasswordFieldInputWrapper":"_bui-PasswordFieldInputWrapper_1bjeu_36","bui-PasswordFieldIcon":"_bui-PasswordFieldIcon_1bjeu_72","bui-PasswordFieldInput":"_bui-PasswordFieldInput_1bjeu_36","bui-PasswordFieldVisibility":"_bui-PasswordFieldVisibility_1bjeu_133"},t=v.forwardRef((a,D)=>{const{label:w,"aria-label":y,"aria-labelledby":j}=a;v.useEffect(()=>{!w&&!y&&!j&&console.warn("PasswordField requires either a visible label, aria-label, or aria-labelledby for accessibility")},[w,y,j]);const{classNames:r,dataAttributes:c,cleanedProps:I}=B("PasswordField",{size:"small",...a}),{className:_,description:L,icon:P,isRequired:z,secondaryLabel:R,placeholder:$,...V}=I,N=R||(z?"Required":null),[o,q]=v.useState(!1);return e.jsxs(C,{className:n(r.root,d[r.root],_),...c,"aria-label":y,"aria-labelledby":j,type:"password",...V,ref:D,children:[e.jsx(W,{label:w,secondaryLabel:N,description:L}),e.jsxs("div",{className:n(r.inputWrapper,d[r.inputWrapper]),"data-size":c["data-size"],children:[P&&e.jsx("div",{className:n(r.inputIcon,d[r.inputIcon]),"data-size":c["data-size"],"aria-hidden":"true",children:P}),e.jsx(k,{className:n(r.input,d[r.input]),...P&&{"data-icon":!0},placeholder:$,type:o?"text":"password"}),e.jsx(T,{"data-size":c["data-size"],"data-variant":"tertiary","aria-label":o?"Hide value":"Show value","aria-controls":o?"text":"password","aria-expanded":o,onPress:()=>q(E=>!E),className:n(r.inputVisibility,d[r.inputVisibility]),children:o?e.jsx(A,{}):e.jsx(O,{})})]}),e.jsx(Y,{})]})});t.displayName="PasswordField";t.__docgenInfo={description:"@public",methods:[],displayName:"PasswordField",props:{icon:{required:!1,tsType:{name:"ReactNode"},description:"An icon to render before the input"},size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the password field
@defaultValue 'medium'`},placeholder:{required:!1,tsType:{name:"string"},description:"Text to display in the input when it has no value"}},composes:["AriaTextFieldProps","Omit"]};const fe={title:"Backstage UI/PasswordField",component:t,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"}}},s={args:{name:"secret",placeholder:"Enter a secret",style:{maxWidth:"300px"}}},m={args:{...s.args},render:a=>e.jsxs(U,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(t,{...a,size:"small",icon:e.jsx(S,{})}),e.jsx(t,{...a,size:"medium",icon:e.jsx(S,{})})]})},u={args:{...s.args,defaultValue:"https://example.com"}},i={args:{...s.args,label:"Label"}},p={args:{...i.args,description:"Description"}},b={args:{...i.args,isRequired:!0}},g={args:{...s.args,isDisabled:!0}},l={args:{...s.args},render:a=>e.jsx(t,{...a,size:"small",icon:e.jsx(S,{})})},f={args:{...l.args,isDisabled:!0},render:l.render},x={args:{...i.args},render:a=>e.jsx(H,{validationErrors:{secret:"Invalid secret"},children:e.jsx(t,{...a})})},h={args:{...i.args,validate:a=>a==="admin"?"Nice try!":null}},F={render:()=>e.jsxs(e.Fragment,{children:[e.jsx(W,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(t,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: args => <PasswordField {...args} size="small" icon={<RiSparklingLine />} />
}`,...l.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    validate: value => value === 'admin' ? 'Nice try!' : null
  }
}`,...h.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  render: () => <>
      <FieldLabel htmlFor="custom-field" id="custom-field-label" label="Custom Field" />
      <PasswordField id="custom-field" aria-labelledby="custom-field-label" name="custom-field" defaultValue="Custom Field" />
    </>
}`,...F.parameters?.docs?.source}}};const xe=["Default","Sizes","DefaultValue","WithLabel","WithDescription","Required","Disabled","WithIcon","DisabledWithIcon","ShowError","Validation","CustomField"];export{F as CustomField,s as Default,u as DefaultValue,g as Disabled,f as DisabledWithIcon,b as Required,x as ShowError,m as Sizes,h as Validation,p as WithDescription,l as WithIcon,i as WithLabel,xe as __namedExportsOrder,fe as default};
