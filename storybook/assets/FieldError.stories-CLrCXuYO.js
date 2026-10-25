import{j as r,p as d}from"./iframe-CMSX-Slv.js";import{$ as m}from"./Form-Bo24afV9.js";import{$ as a}from"./Input-Cw-knjtb.js";import{$ as s}from"./TextField-CmJYjqS6.js";import{F as o}from"./FieldError-DmYCA2df.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-lN068qtb.js";import"./useObjectRef-BtQagX3Q.js";import"./useFormValidation-CxDn_wUg.js";import"./useFocusRing-DUZK2ZXK.js";import"./openLink-p0OhMCOD.js";import"./useHover-D7owYt-e.js";import"./Hidden-kIQntXwy.js";import"./FieldError-BqVen_RV.js";import"./Text-CcBkJcX0.js";import"./Autocomplete-QSoLsmg6.js";import"./keyboard-DZQobsnO.js";import"./getMetaValue-DyXwXlFD.js";import"./useEvent-BikmhAJg.js";import"./useLabels-B9A8JaNL.js";import"./useLocalizedStringFormatter-DNWACNIN.js";import"./I18nProvider-B2rLmNuT.js";import"./useControlledState-DUMTY9Yj.js";import"./Label-QJ7mfr_v.js";import"./useTextField-Drkqegd4.js";import"./useField-B0e6CrK8.js";import"./useLabel-BoN1kqrs.js";import"./useFormReset-CIL9IUM3.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...t.input.parameters?.docs?.source}}};const O=["WithServerValidation","WithCustomMessage","WithRenderProp"];export{i as WithCustomMessage,t as WithRenderProp,e as WithServerValidation,O as __namedExportsOrder};
