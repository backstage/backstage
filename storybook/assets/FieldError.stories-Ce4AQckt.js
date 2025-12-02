import{j as r}from"./iframe-C773ayyW.js";import{$ as d}from"./Form-CZXjlOgu.js";import{$ as o}from"./Input-hPiD-ud0.js";import{$ as s}from"./TextField-CufceDa1.js";import{F as t}from"./FieldError-DvUxQx48.js";import"./preload-helper-D9Z9MdNV.js";import"./useFocusable-BBaTtD3O.js";import"./useObjectRef-NT8Wd318.js";import"./clsx-B-dksMZM.js";import"./utils-Cv7Kn9dL.js";import"./useFormReset-Cdkt3Tvt.js";import"./useControlledState-NNyTOsU8.js";import"./Text-CIKbWX9Y.js";import"./useLabel-DG3PhcjR.js";import"./useLabels-C_0OhMzU.js";import"./Hidden-DlfeZ9CP.js";import"./useFocusRing-CQn_nDjY.js";import"./FieldError-B3jv2gHJ.js";import"./RSPContexts-DuQSzXBC.js";import"./Label-BS-uMQj_.js";import"./useStyles-C_I6PZaw.js";const S={title:"Backstage UI/FieldError",component:t},e={render:()=>r.jsx(d,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(o,{}),r.jsx(t,{})]})})},i={render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(o,{}),r.jsx(t,{children:"This is a custom error message."})]})},a={render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(o,{}),r.jsx(t,{children:({validationErrors:l})=>l.length>0?l[0]:"Field is invalid"})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
