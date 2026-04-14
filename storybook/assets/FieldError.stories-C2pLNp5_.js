import{j as r,p as d}from"./iframe-KINrIo_f.js";import{$ as m}from"./Form-Dteeinzj.js";import{$ as o}from"./Input-DLCtCgi7.js";import{$ as s}from"./TextField-DJ-GY5DW.js";import{F as a}from"./FieldError-GNLCT64V.js";import"./preload-helper-PPVm8Dsz.js";import"./useFocusable-CaaSd55t.js";import"./useObjectRef-Cl-GJEjw.js";import"./openLink-BCV1Ju3v.js";import"./utils-Dp48jrsX.js";import"./useFormReset-CiyO9xzi.js";import"./useControlledState-CmWPFpjF.js";import"./useField-CQ_siFYl.js";import"./useLabel-CtWiwLqZ.js";import"./useLabels-mheEzMbZ.js";import"./Hidden-CKUXjs7V.js";import"./useFocusRing-BZvEHQX6.js";import"./FieldError-CHy2zJ6h.js";import"./Text-BocnvHcP.js";import"./RSPContexts-BB815QrL.js";import"./Label-CJonN38k.js";const l=d.meta({title:"Backstage UI/FieldError",component:a}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(o,{}),r.jsx(a,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(o,{}),r.jsx(a,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(o,{}),r.jsx(a,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...e.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <TextField isInvalid validationBehavior="aria" style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  }}>
      <Input />
      <FieldError>This is a custom error message.</FieldError>
    </TextField>
})`,...i.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...t.input.parameters?.docs?.source}}};const C=["WithServerValidation","WithCustomMessage","WithRenderProp"];export{i as WithCustomMessage,t as WithRenderProp,e as WithServerValidation,C as __namedExportsOrder};
