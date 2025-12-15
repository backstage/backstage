import{j as r}from"./iframe-DpqnIERb.js";import{$ as d}from"./Form-DK8VOFuS.js";import{$ as o}from"./Input-BPT-6Czx.js";import{$ as s}from"./TextField-C9tWP3R9.js";import{F as t}from"./FieldError-CAumUrP3.js";import"./preload-helper-PPVm8Dsz.js";import"./useFocusable-D_Izi1La.js";import"./useObjectRef-DeoBV0YX.js";import"./clsx-B-dksMZM.js";import"./utils-B2P2SXf5.js";import"./useFormReset-CezelKG7.js";import"./useControlledState-Cq_rx2hv.js";import"./Text-CdDC4FMf.js";import"./useLabel-hgpj-65L.js";import"./useLabels-D-JxYPd2.js";import"./Hidden-B02KVb8D.js";import"./useFocusRing-8s93X7c_.js";import"./FieldError-Cf0TiAR9.js";import"./RSPContexts-dfCR3Drw.js";import"./Label-DV8PoFCz.js";import"./useStyles-DeGVM3t2.js";const S={title:"Backstage UI/FieldError",component:t},e={render:()=>r.jsx(d,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(o,{}),r.jsx(t,{})]})})},i={render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(o,{}),r.jsx(t,{children:"This is a custom error message."})]})},a={render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(o,{}),r.jsx(t,{children:({validationErrors:l})=>l.length>0?l[0]:"Field is invalid"})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...e.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...a.parameters?.docs?.source}}};const R=["WithServerValidation","WithCustomMessage","WithRenderProp"];export{i as WithCustomMessage,a as WithRenderProp,e as WithServerValidation,R as __namedExportsOrder,S as default};
