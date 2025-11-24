import{j as e}from"./iframe-CJzL4cPn.js";import{$ as d}from"./Form-DlGCMTtx.js";import{$ as s}from"./Input-CVmYTysu.js";import{$ as o}from"./TextField-DZQKHyBa.js";import{F as t}from"./FieldError-DoL8z2Hz.js";import"./preload-helper-D9Z9MdNV.js";import"./useFocusRing-B5Bt_Lep.js";import"./utils-DOTuvGaR.js";import"./clsx-B-dksMZM.js";import"./useFormReset-Dt8VgJDD.js";import"./useControlledState-DiB10r4V.js";import"./Text-C5IwU6K8.js";import"./useLabel-DbjlO8c_.js";import"./useLabels-DRFbcEwz.js";import"./Hidden-B-ezpZ0H.js";import"./FieldError-CIntkDcn.js";import"./RSPContexts-DYClt1xJ.js";import"./Label-B-VGLpUJ.js";import"./useStyles-CTfclJKG.js";const W={title:"Backstage UI/FieldError",component:t},r={render:()=>e.jsx(d,{validationErrors:{demo:"This is a server validation error."},children:e.jsxs(o,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(t,{})]})})},i={render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(t,{children:"This is a custom error message."})]})},a={render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(t,{children:({validationErrors:l})=>l.length>0?l[0]:"Field is invalid"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
