import{a3 as d,j as r}from"./iframe-BY8lR-L8.js";import{$ as m}from"./Form-B7AsXGvr.js";import{$ as o}from"./Input-Cwa4mYR8.js";import{$ as s}from"./TextField-DbAvWVb8.js";import{F as a}from"./FieldError-RReYZ_oD.js";import"./preload-helper-PPVm8Dsz.js";import"./useFocusable-C9C81vz2.js";import"./useObjectRef-BqHG6lM5.js";import"./clsx-B-dksMZM.js";import"./utils-Bfoe0K7S.js";import"./useFormReset-SyrVROTP.js";import"./useControlledState--yapVw-x.js";import"./Text-BKaXOxx7.js";import"./useLabel-C6JDtQl3.js";import"./useLabels-BYtztTEe.js";import"./Hidden-BOGSyjem.js";import"./useFocusRing-BEbWKVlK.js";import"./FieldError-j_Sj5TL2.js";import"./RSPContexts-CKOFLTkU.js";import"./Label-g_-FIzgL.js";import"./useStyles-DPxfsz7Y.js";const l=d.meta({title:"Backstage UI/FieldError",component:a}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(o,{}),r.jsx(a,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(o,{}),r.jsx(a,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(o,{}),r.jsx(a,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
