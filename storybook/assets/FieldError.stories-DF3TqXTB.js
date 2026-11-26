import{j as r,p as d}from"./iframe-CR1Jw9dV.js";import{$ as m}from"./Form-CirHk10M.js";import{$ as a}from"./Input-CPFU7dv3.js";import{$ as s}from"./TextField-BVbRETzg.js";import{F as o}from"./FieldError-BF0TTJEo.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-f1XPU8sj.js";import"./useObjectRef-CxAJnmky.js";import"./useFormValidation-rdS9Nj4h.js";import"./useFocusRing-CCR0Dk_B.js";import"./useHover-COtbARlD.js";import"./Hidden-B3uAAl_R.js";import"./FieldError-xrm2enzG.js";import"./Text-BX3OTawI.js";import"./Autocomplete-B2_gIgbH.js";import"./keyboard-DwLZW9jg.js";import"./getMetaValue-QyE7lEVK.js";import"./useEvent-Dm-E9hNt.js";import"./useLabels-C65kEDvg.js";import"./useLocalizedStringFormatter-C4g2OxQ5.js";import"./I18nProvider-CXlyEy0i.js";import"./useControlledState-BQLBMnzZ.js";import"./Label-C37_b03j.js";import"./useTextField-CzwueCey.js";import"./useField-Cc85Nw2S.js";import"./useLabel-B8RNTxDr.js";import"./useFormReset-DTZFkvsG.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
