import{bQ as r,c5 as d}from"./iframe-C1Du46eF.js";import{a as m}from"./useFormValidation-BhsMD-cv.js";import{c as a}from"./Input-BWPK4-A8.js";import{$ as s}from"./TextField-D2d7Cdeu.js";import{F as o}from"./FieldError-DnT8g_gb.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-hkspyz06.js";import"./useObjectRef-DOq-huoO.js";import"./useFocusRing-C0uj4VUP.js";import"./openLink-CByF1g0c.js";import"./useHover-CFEPcSqQ.js";import"./Hidden-BsQwcHXl.js";import"./FieldError-CW_JKSLC.js";import"./Text-DDKqJmZc.js";import"./Autocomplete-BjwsbRnL.js";import"./keyboard-CFktmufy.js";import"./useEvent-B0PtjqRu.js";import"./useLabels-CQnXJWhI.js";import"./useLocalizedStringFormatter-CpQkqVsH.js";import"./I18nProvider-B27jmHNy.js";import"./useControlledState-BHe0N0Aq.js";import"./Label-CPEk2ZbI.js";import"./useTextField-6Mu4PHW9.js";import"./useField-CN5nphuL.js";import"./useLabel-C8HhkV7I.js";import"./useFormReset-D4W7gYuW.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
