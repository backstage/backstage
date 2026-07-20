import{bR as r,c7 as d}from"./iframe-e_Pbc_6f.js";import{a as m}from"./useFormValidation-Dq2pDWRi.js";import{c as a}from"./Input-D0qkWHrE.js";import{$ as s}from"./TextField-B_JceOOc.js";import{F as o}from"./FieldError-DxxVTnAm.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DxA9yzz1.js";import"./useObjectRef-DrJIir3F.js";import"./useFocusRing-KWUxPK8x.js";import"./openLink-DeVBsZVT.js";import"./useHover-C40GJDws.js";import"./Hidden-C1Rvfh0a.js";import"./FieldError-R8gf8j-5.js";import"./Text-kgP67g1L.js";import"./Autocomplete-FbP99aZV.js";import"./keyboard-8KwQEgaY.js";import"./useEvent-CdwABQDt.js";import"./useLabels-C5Sb3eQn.js";import"./useLocalizedStringFormatter-DiezMxYB.js";import"./I18nProvider-CEYf4yN0.js";import"./useControlledState-DA3BLMuY.js";import"./Label-C-UeOlhu.js";import"./useTextField-BeKMltDD.js";import"./useField-BxXW_0MU.js";import"./useLabel-DuGYdeVZ.js";import"./useFormReset-BF8qzp5Y.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
