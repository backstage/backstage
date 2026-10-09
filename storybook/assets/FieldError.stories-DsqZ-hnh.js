import{j as r,p as d}from"./iframe-D_sJ6DQq.js";import{$ as m}from"./Form-BXoeFdX8.js";import{$ as a}from"./Input-DbjRx16d.js";import{$ as s}from"./TextField-DowO_wCx.js";import{F as o}from"./FieldError-_EroCQCO.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-rcqHDtde.js";import"./useObjectRef-C71_ODYl.js";import"./useFormValidation-CZ1LA-b2.js";import"./useFocusRing-DDwhFymc.js";import"./openLink-DVi3OW0T.js";import"./useHover-CC1tHz-Y.js";import"./Hidden-B0JsmZw6.js";import"./FieldError-CD2mDzmR.js";import"./Text-CukGZgZw.js";import"./Autocomplete-eTntpY6G.js";import"./keyboard-NWCLTI3I.js";import"./getMetaValue-DT9wVw6b.js";import"./useEvent-CDKl63CX.js";import"./useLabels-CtqB2Ot9.js";import"./useLocalizedStringFormatter-C7VBNrzb.js";import"./I18nProvider-Bnu7qnYs.js";import"./useControlledState-F0ZESx8Q.js";import"./Label-CqUgdJka.js";import"./useTextField-CCQt5UyT.js";import"./useField-gSzBaL8y.js";import"./useLabel-JU3kQl_C.js";import"./useFormReset-DHxzgEZr.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...t.input.parameters?.docs?.source}}};const O=["WithServerValidation","WithCustomMessage","WithRenderProp"];export{i as WithCustomMessage,t as WithRenderProp,e as WithServerValidation,O as __namedExportsOrder};
