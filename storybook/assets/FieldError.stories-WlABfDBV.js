import{bQ as r,c5 as d}from"./iframe-DgMUslzK.js";import{a as m}from"./useFormValidation-DdO1uBuo.js";import{c as a}from"./Input-BwG4UZpQ.js";import{$ as s}from"./TextField-8BtWzwAc.js";import{F as o}from"./FieldError-sr_A1F3i.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DhxbSGHl.js";import"./useObjectRef-XeGD6VQX.js";import"./useFocusRing-B4qSrPyS.js";import"./openLink-CV_TcEkD.js";import"./useHover-D4699e1A.js";import"./Hidden-BAVkFQWw.js";import"./FieldError-D_Mr9T0S.js";import"./Text-DpEEeOvr.js";import"./Autocomplete-k4dn0hvl.js";import"./keyboard-QF3EkhTC.js";import"./useEvent-CJepjbxE.js";import"./useLabels-B0EqUNWZ.js";import"./useLocalizedStringFormatter-2Z2O1PD_.js";import"./I18nProvider-CGCG23Ya.js";import"./useControlledState-BXceL1Ef.js";import"./Label-RJPM6nLR.js";import"./useTextField-DhT4aJpW.js";import"./useField-DvMrjFac.js";import"./useLabel-Cp4A-_gp.js";import"./useFormReset-CJ2gFrM1.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
