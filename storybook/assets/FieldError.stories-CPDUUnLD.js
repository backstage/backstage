import{j as r,p as d}from"./iframe-piw0-GWS.js";import{$ as m}from"./useFormValidation-CqX-gdFR.js";import{$ as a}from"./Input-DV5mrE8x.js";import{$ as s}from"./TextField-BlGRnwfK.js";import{F as o}from"./FieldError-7iFx9auU.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-wuzg6Gut.js";import"./useObjectRef-IkhajRyJ.js";import"./useFocusRing-BpapEP6W.js";import"./openLink-BiQlZAwx.js";import"./useHover-CBlM-Gvk.js";import"./Hidden-ChjLH5Dh.js";import"./FieldError-C00vbv1H.js";import"./Text-Dj98mrrm.js";import"./Autocomplete-Ci1mTh4c.js";import"./keyboard-CxUCvJz3.js";import"./useEvent-BcEtlgIb.js";import"./useLabels-BulSWJbq.js";import"./useLocalizedStringFormatter-BNjNGOHG.js";import"./I18nProvider-DMoCT0pg.js";import"./useControlledState-WBvh0vQ5.js";import"./Label-BZuUhWGV.js";import"./useTextField-B4zMgAH5.js";import"./useField-BmyRXti8.js";import"./useLabel-ETY-Wxlf.js";import"./useFormReset-ByZK7tlo.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
