import{j as e}from"./iframe-DQwDoo1H.js";import{$ as d}from"./Form-DxrBlhdg.js";import{$ as s}from"./Input-DooPI6FN.js";import{$ as o}from"./TextField-WZ3y6Ljy.js";import{F as t}from"./FieldError-DtfkI4eK.js";import"./preload-helper-D9Z9MdNV.js";import"./useFocusRing-BR9bos78.js";import"./utils-C3GNrma8.js";import"./clsx-B-dksMZM.js";import"./useFormReset-B9rmuJqS.js";import"./useControlledState-BvAjCfX_.js";import"./Text-iX6PNwvH.js";import"./useLabel-rLVklRGH.js";import"./useLabels-DJZ2bDxf.js";import"./Hidden-zWTSVHIQ.js";import"./FieldError-CJXGJ0zo.js";import"./RSPContexts-CTuAhOMF.js";import"./Label-Cy_rHujY.js";import"./useStyles-D22jDgI9.js";const W={title:"Backstage UI/FieldError",component:t},r={render:()=>e.jsx(d,{validationErrors:{demo:"This is a server validation error."},children:e.jsxs(o,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(t,{})]})})},i={render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(t,{children:"This is a custom error message."})]})},a={render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(t,{children:({validationErrors:l})=>l.length>0?l[0]:"Field is invalid"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...a.parameters?.docs?.source}}};const B=["WithServerValidation","WithCustomMessage","WithRenderProp"];export{i as WithCustomMessage,a as WithRenderProp,r as WithServerValidation,B as __namedExportsOrder,W as default};
