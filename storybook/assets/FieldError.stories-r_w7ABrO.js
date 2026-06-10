import{bR as r,c7 as d}from"./iframe-C0kJxuo3.js";import{a as m}from"./useFormValidation-3aKGROn2.js";import{c as a}from"./Input-B_FaaR_5.js";import{$ as s}from"./TextField-DHut1TfA.js";import{F as o}from"./FieldError-tphVtU6h.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CnFsvhU-.js";import"./useObjectRef-BSMvvO9T.js";import"./useFocusRing-Bg7HxPV-.js";import"./openLink-DDhi7ntb.js";import"./useHover-D7zQG8_9.js";import"./Hidden-CHyqgnK5.js";import"./FieldError--FqYVBj6.js";import"./Text-Ct_pvziQ.js";import"./Autocomplete-DeDZ3wSY.js";import"./keyboard-BnyidUqB.js";import"./useEvent-DBd9MG6t.js";import"./useLabels-4ReBYVqS.js";import"./useLocalizedStringFormatter-CaA0b4kd.js";import"./I18nProvider-CQJu78Ur.js";import"./useControlledState-DQVnvmLX.js";import"./Label-CdCEFadA.js";import"./useTextField-DIqeoBkH.js";import"./useField-BpTsyISE.js";import"./useLabel-DNf3_Lp_.js";import"./useFormReset-C1xWZBqw.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
