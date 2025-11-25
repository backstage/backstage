import{j as e}from"./iframe-DVllq_JJ.js";import{$ as d}from"./Form-DHJse_sj.js";import{$ as s}from"./Input-BsCRwCfP.js";import{$ as o}from"./TextField-CTucDzcf.js";import{F as t}from"./FieldError-DX8WaVQN.js";import"./preload-helper-D9Z9MdNV.js";import"./useFocusRing-BJUtuVG8.js";import"./utils-D2GrDZ3E.js";import"./clsx-B-dksMZM.js";import"./useFormReset-CTc8R7q_.js";import"./useControlledState-9BMRYThO.js";import"./Text-DT46gkQ9.js";import"./useLabel-BsFoHYoV.js";import"./useLabels-691PZeM6.js";import"./Hidden-Bxv_hxhr.js";import"./FieldError-DS4Tn46M.js";import"./RSPContexts-S8-Rz7Wq.js";import"./Label-DjEIg58W.js";import"./useStyles-DoZFblXP.js";const W={title:"Backstage UI/FieldError",component:t},r={render:()=>e.jsx(d,{validationErrors:{demo:"This is a server validation error."},children:e.jsxs(o,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(t,{})]})})},i={render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(t,{children:"This is a custom error message."})]})},a={render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(t,{children:({validationErrors:l})=>l.length>0?l[0]:"Field is invalid"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
