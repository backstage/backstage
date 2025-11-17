import{j as e}from"./iframe-CIM5duhm.js";import{$ as d}from"./Form-CdGZ-Si5.js";import{$ as s}from"./Input-D7tySBxg.js";import{$ as o}from"./TextField-BIaIdIpK.js";import{F as t}from"./FieldError-Papo_9BV.js";import"./preload-helper-D9Z9MdNV.js";import"./useFocusRing-Cr9lwsBD.js";import"./utils-CRJoEm3K.js";import"./clsx-B-dksMZM.js";import"./useFormReset-Bfmh-uiu.js";import"./useControlledState-BMMPavn8.js";import"./Text-bqh5tAbH.js";import"./useLabel-WEp9ptwG.js";import"./useLabels-BKn1V8s6.js";import"./Hidden-9k8g-7t3.js";import"./FieldError-K8CUeE9R.js";import"./RSPContexts-CqtEgdGk.js";import"./Label-ByZMsSG7.js";import"./useStyles-hnadVxcR.js";const W={title:"Backstage UI/FieldError",component:t},r={render:()=>e.jsx(d,{validationErrors:{demo:"This is a server validation error."},children:e.jsxs(o,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(t,{})]})})},i={render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(t,{children:"This is a custom error message."})]})},a={render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(t,{children:({validationErrors:l})=>l.length>0?l[0]:"Field is invalid"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
