import{bR as r,c7 as d}from"./iframe-BT856zKW.js";import{a as m}from"./useFormValidation-GBXOaCZU.js";import{c as a}from"./Input-DudLBmfR.js";import{$ as s}from"./TextField-swnsJdVZ.js";import{F as o}from"./FieldError-WtUaFOLd.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CpwCIt4g.js";import"./useObjectRef-C9B7I4dA.js";import"./useFocusRing-BT_-10ZK.js";import"./openLink-cidOSJP4.js";import"./useHover-qIfqE_w_.js";import"./Hidden-49UROW8g.js";import"./FieldError-C6e4WYaM.js";import"./Text-76s0V35L.js";import"./Autocomplete-BV1G3v_N.js";import"./keyboard-OOu-nIBg.js";import"./useEvent-C-5yOyHh.js";import"./useLabels-mD4IPMLK.js";import"./useLocalizedStringFormatter-BWCbUYkC.js";import"./I18nProvider-D0MkpVu-.js";import"./useControlledState-B8MFkE-b.js";import"./Label-DWhvkKMc.js";import"./useTextField-Dr2g0Wsf.js";import"./useField-BE3cQBfr.js";import"./useLabel-4EIIh35K.js";import"./useFormReset-BqsbtU9Q.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
