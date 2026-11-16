import{j as r,p as d}from"./iframe-BKMB85pu.js";import{$ as m}from"./Form-BffRYw_3.js";import{$ as a}from"./Input-wf8wPR2b.js";import{$ as s}from"./TextField-BK0aybfn.js";import{F as o}from"./FieldError-Dt0oo7L_.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-Nyu7VTFu.js";import"./useObjectRef-CqnWYM4T.js";import"./useFormValidation-B-ExQgbu.js";import"./useFocusRing-jnagQyYL.js";import"./useHover-BaAG1-q2.js";import"./Hidden-DHN5dLew.js";import"./FieldError-DJK2D3AO.js";import"./Text-Dg9dYh63.js";import"./Autocomplete-BlDpM6qn.js";import"./keyboard-D8lqn657.js";import"./getMetaValue-TGQihhTK.js";import"./useEvent-BEstD6-f.js";import"./useLabels-CFKWkPDt.js";import"./useLocalizedStringFormatter-ZPcyGWMD.js";import"./I18nProvider-29Kr0hRB.js";import"./useControlledState-D3rG0KvC.js";import"./Label-Y7OAC7uK.js";import"./useTextField-CKOhWsDF.js";import"./useField-D3sSVYZC.js";import"./useLabel-CeJz4BMW.js";import"./useFormReset-CvckHHjx.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...t.input.parameters?.docs?.source}}};const w=["WithServerValidation","WithCustomMessage","WithRenderProp"];export{i as WithCustomMessage,t as WithRenderProp,e as WithServerValidation,w as __namedExportsOrder};
