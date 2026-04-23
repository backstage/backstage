import{j as r,p as d}from"./iframe-izSSIzTR.js";import{$ as m}from"./useFormValidation-KKy4svAa.js";import{$ as a}from"./Input-DB8OS-O0.js";import{$ as s}from"./TextField-CR63lInQ.js";import{F as o}from"./FieldError-ehaVnJGD.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-Cl9gINrl.js";import"./useObjectRef-DA7QflCc.js";import"./useGlobalListeners-CynQJlR4.js";import"./openLink-BZ37FDEF.js";import"./useHover-Dn05tM4n.js";import"./Hidden-Z1-_rzje.js";import"./FieldError-bPDpl4tm.js";import"./Text-B7PTVtbA.js";import"./Autocomplete-CUty0TUf.js";import"./keyboard-PuRhgdyi.js";import"./useEvent-C6O8PQe-.js";import"./useLabels-DlA16iH6.js";import"./useLocalizedStringFormatter-CbcXejhq.js";import"./I18nProvider-Dt5oCbl9.js";import"./useControlledState-Bla-K4z3.js";import"./Label-DiQKndYJ.js";import"./useTextField-D2DQSV74.js";import"./useField-Ds3mC8xn.js";import"./useLabel-C1C1CBQ9.js";import"./useFormReset-BRuBz3cs.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
