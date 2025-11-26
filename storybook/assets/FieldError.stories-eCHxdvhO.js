import{j as e}from"./iframe-DXt6I_1q.js";import{$ as d}from"./Form-CNN8kECL.js";import{$ as s}from"./Input-C108iTEn.js";import{$ as o}from"./TextField-eBr3p3DV.js";import{F as t}from"./FieldError-Bqn0E297.js";import"./preload-helper-D9Z9MdNV.js";import"./useFocusRing-Yf5GNPk5.js";import"./utils-LcmEw3G_.js";import"./clsx-B-dksMZM.js";import"./useFormReset-BBg88K2L.js";import"./useControlledState-BY6XzekM.js";import"./Text-CJFX5rWX.js";import"./useLabel-AcvxzzJS.js";import"./useLabels-D9LRKjNw.js";import"./Hidden-CSvgiNeY.js";import"./FieldError-BQcEFFZN.js";import"./RSPContexts-8_cBbO_q.js";import"./Label-BOOV9aoK.js";import"./useStyles-CKDOjn9p.js";const W={title:"Backstage UI/FieldError",component:t},r={render:()=>e.jsx(d,{validationErrors:{demo:"This is a server validation error."},children:e.jsxs(o,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(t,{})]})})},i={render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(t,{children:"This is a custom error message."})]})},a={render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(t,{children:({validationErrors:l})=>l.length>0?l[0]:"Field is invalid"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
