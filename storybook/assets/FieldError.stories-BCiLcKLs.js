import{bR as r,c7 as d}from"./iframe-C134ftd_.js";import{a as m}from"./useFormValidation-s9lT5xWl.js";import{c as a}from"./Input-BaAA-Nyt.js";import{$ as s}from"./TextField-BfH8y_rs.js";import{F as o}from"./FieldError-B3m0AjM9.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-ZhLQjZIu.js";import"./useObjectRef-CpAZkPjD.js";import"./useFocusRing-CEbL5n3V.js";import"./openLink-CXjQqT5j.js";import"./useHover-crLX5QKB.js";import"./Hidden-Bciv724x.js";import"./FieldError-D65LPVQm.js";import"./Text-rWPrkzXG.js";import"./Autocomplete-BAT25Rh4.js";import"./keyboard-DADZJZiJ.js";import"./useEvent-B_Hi0sbr.js";import"./useLabels-DE_o1GVW.js";import"./useLocalizedStringFormatter-gRbl-cPk.js";import"./I18nProvider-C3aQlN23.js";import"./useControlledState-BrUi6TrE.js";import"./Label-NvoSwhWO.js";import"./useTextField-C8rV1cT7.js";import"./useField-By1WoCRi.js";import"./useLabel-BlNKan1O.js";import"./useFormReset-CQi6w5nh.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
