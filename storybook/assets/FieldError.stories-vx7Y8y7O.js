import{bR as r,c7 as d}from"./iframe-NUkawwzR.js";import{a as m}from"./useFormValidation-K7MK4t4L.js";import{c as a}from"./Input-B0ZBMtvO.js";import{$ as s}from"./TextField-v6ZGalV7.js";import{F as o}from"./FieldError-DiQaHyEj.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-uzdfuIw1.js";import"./useObjectRef-Dr07-kua.js";import"./useFocusRing-DRFr-2Cy.js";import"./openLink-DneRJetG.js";import"./useHover-Cr1OjqYT.js";import"./Hidden-Bd1CbclD.js";import"./FieldError-C13gsDR2.js";import"./Text-BSvRbAi-.js";import"./Autocomplete-D9312KrT.js";import"./keyboard-DqU_Guq5.js";import"./useEvent-DC4HEiiy.js";import"./useLabels-DJ5agKFT.js";import"./useLocalizedStringFormatter-D5KRTDrf.js";import"./I18nProvider-CqeGaTnN.js";import"./useControlledState-BIbEMjh-.js";import"./Label-CtWn_4Sh.js";import"./useTextField-DGqGeHGi.js";import"./useField-B3g5yX1O.js";import"./useLabel-Cvlyn-hw.js";import"./useFormReset-B12SLtR-.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
