import{j as r,p as d}from"./iframe-SQ-DrL5X.js";import{$ as m}from"./useFormValidation-BDrZPX9Z.js";import{$ as a}from"./Input-ByFHAFjD.js";import{$ as s}from"./TextField-DQIrkKo2.js";import{F as o}from"./FieldError--heBlvbI.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DS6PrpIl.js";import"./useObjectRef-BvCpdf-D.js";import"./useFocusRing-BjVI5GO7.js";import"./openLink-DWLtw0ci.js";import"./useHover-DHCGAdFi.js";import"./Hidden-ZDc1mtAl.js";import"./FieldError-Dy6WAbxG.js";import"./Text-BW-I_WTv.js";import"./Autocomplete-DIjTkbA4.js";import"./keyboard-xERIyYjI.js";import"./useEvent-Cl1lm5-9.js";import"./useLabels-X84YCiAH.js";import"./useLocalizedStringFormatter-CHao35Rz.js";import"./I18nProvider-z6RUFbQd.js";import"./useControlledState-BLu3Mzk7.js";import"./Label-CZqZr_x1.js";import"./useTextField-ScBV4IXz.js";import"./useField-DiPkCaUr.js";import"./useLabel-w96aGTJB.js";import"./useFormReset-CCiws3BY.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
