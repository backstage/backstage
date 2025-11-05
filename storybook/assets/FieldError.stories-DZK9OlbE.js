import{j as e}from"./iframe-CjPeRtpr.js";import{$ as d}from"./Form-DzfZZyMk.js";import{$ as t}from"./Input-BwfIsKC7.js";import{$ as o}from"./TextField-nEwsXS6Y.js";import{F as s}from"./FieldError-N3u2LotI.js";import"./preload-helper-D9Z9MdNV.js";import"./useFocusRing-BcNygTIa.js";import"./utils-C0MWZq6h.js";import"./clsx-B-dksMZM.js";import"./useFormReset-CfOtZaOp.js";import"./useControlledState-CXy0dO5E.js";import"./Text-CrLFFIsn.js";import"./useLabels-CyUYaiPu.js";import"./Hidden-DlZUPNSr.js";import"./FieldError-DqITmbVg.js";import"./RSPContexts-BbnkQwLb.js";import"./Label-DOM0Hc8W.js";import"./useStyles-BWB4qyM3.js";const D={title:"Backstage UI/FieldError",component:s},r={render:()=>e.jsx(d,{validationErrors:{demo:"This is a server validation error."},children:e.jsxs(o,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(t,{}),e.jsx(s,{})]})})},i={render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(t,{}),e.jsx(s,{children:"This is a custom error message."})]})},a={render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(t,{}),e.jsx(s,{children:({validationErrors:l})=>l.length>0?l[0]:"Field is invalid"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <Form validationErrors={{
    demo: 'This is a server validation error.'
  }}>
      <TextField name="demo" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
    }}>
        <Input />
        <FieldError />
      </TextField>
    </Form>
}`,...r.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <TextField isInvalid validationBehavior="aria" style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  }}>
      <Input />
      <FieldError>This is a custom error message.</FieldError>
    </TextField>
}`,...i.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <TextField isInvalid validationBehavior="aria" validate={() => 'This field is invalid'} style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  }}>
      <Input />
      <FieldError>
        {({
        validationErrors
      }) => validationErrors.length > 0 ? validationErrors[0] : 'Field is invalid'}
      </FieldError>
    </TextField>
}`,...a.parameters?.docs?.source}}};const W=["WithServerValidation","WithCustomMessage","WithRenderProp"];export{i as WithCustomMessage,a as WithRenderProp,r as WithServerValidation,W as __namedExportsOrder,D as default};
