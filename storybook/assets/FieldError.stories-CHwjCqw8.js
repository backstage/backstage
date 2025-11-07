import{j as e}from"./iframe-C4yti0TH.js";import{$ as d}from"./Form-Cgg8Gb88.js";import{$ as t}from"./Input-zV_50sKx.js";import{$ as o}from"./TextField-BJxigLTg.js";import{F as s}from"./FieldError-WvdOj_lr.js";import"./preload-helper-D9Z9MdNV.js";import"./useFocusRing-B8apTfOm.js";import"./utils-DEy88mMw.js";import"./clsx-B-dksMZM.js";import"./useFormReset-Cn51TXDN.js";import"./useControlledState-Cc-Gzoh9.js";import"./Text-DLqvZqOo.js";import"./useLabels-Bw3k7E9a.js";import"./Hidden-COSJl_dh.js";import"./FieldError-ChL302IZ.js";import"./RSPContexts-C_ZxlIow.js";import"./Label-IweSkFuX.js";import"./useStyles-BVvzKC4H.js";const D={title:"Backstage UI/FieldError",component:s},r={render:()=>e.jsx(d,{validationErrors:{demo:"This is a server validation error."},children:e.jsxs(o,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(t,{}),e.jsx(s,{})]})})},i={render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(t,{}),e.jsx(s,{children:"This is a custom error message."})]})},a={render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(t,{}),e.jsx(s,{children:({validationErrors:l})=>l.length>0?l[0]:"Field is invalid"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
