import{j as r,p as d}from"./iframe-C8V0qqb2.js";import{$ as m}from"./Form-ro32D7sS.js";import{$ as a}from"./Input-C6rRPFvc.js";import{$ as s}from"./TextField-Bs-VET8v.js";import{F as o}from"./FieldError-Bv3u66G_.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-D2G7Gr3-.js";import"./useObjectRef-Bmpa_pzq.js";import"./useFormValidation-DCkaOoFr.js";import"./useFocusRing-A5enshti.js";import"./useHover-BM2aAfmJ.js";import"./Hidden-DiQ-sckr.js";import"./FieldError-B6JD0CK_.js";import"./Text-C3Fp9zoI.js";import"./Autocomplete-F_-RRsBG.js";import"./keyboard-C8VvzxKH.js";import"./getMetaValue-Cs0hmg7u.js";import"./useEvent-8_12ARkl.js";import"./useLabels-D_iZwDzY.js";import"./useLocalizedStringFormatter-BSUQ5ifA.js";import"./I18nProvider-Cjl-_wzY.js";import"./useControlledState-CSkhWUnX.js";import"./Label-lDwdRkmF.js";import"./useTextField-DZRsoRku.js";import"./useField-CnWanIwr.js";import"./useLabel-Du92kFjZ.js";import"./useFormReset-BkDzJlqC.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
