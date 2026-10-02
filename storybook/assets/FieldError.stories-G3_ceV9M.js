import{j as r,p as d}from"./iframe-DOtOeTqo.js";import{$ as m}from"./useFormValidation-NUNxJZWW.js";import{$ as a}from"./Input-CoNrOVCs.js";import{$ as s}from"./TextField-DyV7CTyc.js";import{F as o}from"./FieldError-BwO9S8eX.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-pgFMei_k.js";import"./useObjectRef-BWUUeiPu.js";import"./useFocusRing-BXb8q1JL.js";import"./openLink-CJNg7ARK.js";import"./useHover-CLTRyNT2.js";import"./Hidden-CxPa8WIq.js";import"./FieldError-BZUytoyE.js";import"./Text-CUFEUyEl.js";import"./Autocomplete-CvKotD4o.js";import"./keyboard-Dpz_eYv5.js";import"./useEvent-KvN5j0jW.js";import"./useLabels-BnFtLpP2.js";import"./useLocalizedStringFormatter-BO4d3GOf.js";import"./I18nProvider-DuDY5T7I.js";import"./useControlledState-BfKz3a4E.js";import"./Label-BxIKHFQ8.js";import"./useTextField-JZBlAGZ1.js";import"./useField-M0TANDTX.js";import"./useLabel-DH87djdw.js";import"./useFormReset-DPXLv5Gr.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
