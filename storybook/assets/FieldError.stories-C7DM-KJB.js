import{j as e}from"./iframe-DGs96NRX.js";import{$ as d}from"./Form-Z6qT6avX.js";import{$ as t}from"./Input-DJbi6niS.js";import{$ as o}from"./TextField-CYXxqMdO.js";import{F as s}from"./FieldError-BAWm_iXQ.js";import"./preload-helper-D9Z9MdNV.js";import"./useFocusRing-BH5dx5ew.js";import"./utils-Cg2mtjSe.js";import"./clsx-B-dksMZM.js";import"./useFormReset-Cg1YjiQK.js";import"./useControlledState-BKEqqZy2.js";import"./Text-8BNlLSqz.js";import"./useLabels-Cyub2fxl.js";import"./Hidden-C43Hqw5G.js";import"./FieldError-DUbnbTkK.js";import"./RSPContexts-C05VnW2e.js";import"./Label-7Iq-a4Lo.js";import"./useStyles-DSKvYoj-.js";const D={title:"Backstage UI/FieldError",component:s},r={render:()=>e.jsx(d,{validationErrors:{demo:"This is a server validation error."},children:e.jsxs(o,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(t,{}),e.jsx(s,{})]})})},i={render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(t,{}),e.jsx(s,{children:"This is a custom error message."})]})},a={render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(t,{}),e.jsx(s,{children:({validationErrors:l})=>l.length>0?l[0]:"Field is invalid"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
