import{bQ as r,c5 as d}from"./iframe-J3scbCK7.js";import{a as m}from"./useFormValidation-zrBOIZdf.js";import{c as a}from"./Input-DPORZ8J4.js";import{$ as s}from"./TextField-CQXfIPdI.js";import{F as o}from"./FieldError-1T67z3vL.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CXCc_oGJ.js";import"./useObjectRef-CYiyNzgW.js";import"./useFocusRing-lNGJkQ5U.js";import"./openLink-BYbBBzFI.js";import"./useHover-CwRlhx06.js";import"./Hidden-RMOzfft_.js";import"./FieldError-B0c2RKK0.js";import"./Text-DH7_sXsF.js";import"./Autocomplete--nAxv__n.js";import"./keyboard-D2Y4eCz5.js";import"./useEvent-B3GM1Fij.js";import"./useLabels-tuukLlho.js";import"./useLocalizedStringFormatter-Xrd7W-Po.js";import"./I18nProvider-BmKrAj2D.js";import"./useControlledState-DShAbZI7.js";import"./Label-CZdg3p-k.js";import"./useTextField-B3ICUpsH.js";import"./useField-CqTLy_Vm.js";import"./useLabel-CdAWakw3.js";import"./useFormReset-DtBlZ5rd.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
