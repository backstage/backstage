import{bQ as r,c5 as d}from"./iframe-Bkld27Xv.js";import{a as m}from"./useFormValidation-CUV93Bjh.js";import{c as a}from"./Input-CV-w3vcP.js";import{$ as s}from"./TextField-Clw-ppgB.js";import{F as o}from"./FieldError-D9M9uQR1.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DEGlt2_H.js";import"./useObjectRef-hOSdhRq8.js";import"./useFocusRing-Sg8Yc6Zc.js";import"./openLink-Dls5t0TL.js";import"./useHover-BTVKyR5u.js";import"./Hidden-CJz8ByQd.js";import"./FieldError-BS9yiOWv.js";import"./Text-BUEI6kbu.js";import"./Autocomplete-3KAQwcNc.js";import"./keyboard-CjcwyYqU.js";import"./useEvent-CEECt1ZX.js";import"./useLabels-DgACLhvG.js";import"./useLocalizedStringFormatter-CyMRJiUd.js";import"./I18nProvider-CcjFgoxB.js";import"./useControlledState-BDm5gUq3.js";import"./Label-CzzbJTkN.js";import"./useTextField-Bxio2Baz.js";import"./useField-8zpTTKWi.js";import"./useLabel-D1T8LrYx.js";import"./useFormReset-CvfhEzlX.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...t.input.parameters?.docs?.source}}};const k=["WithServerValidation","WithCustomMessage","WithRenderProp"];export{i as WithCustomMessage,t as WithRenderProp,e as WithServerValidation,k as __namedExportsOrder};
