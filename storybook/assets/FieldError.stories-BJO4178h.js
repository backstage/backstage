import{bR as r,c7 as d}from"./iframe-BNSLO1vV.js";import{a as m}from"./useFormValidation-DICvltng.js";import{c as a}from"./Input-C013WslU.js";import{$ as s}from"./TextField-bYX5GOFP.js";import{F as o}from"./FieldError-JGQ5ZZKy.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BgaqTVim.js";import"./useObjectRef-DfKP_bGf.js";import"./useFocusRing-BWAOHlHz.js";import"./openLink-D76OisA9.js";import"./useHover-CGZzpOhk.js";import"./Hidden-BWb7YpQ9.js";import"./FieldError-DzFGWgMI.js";import"./Text-B3PwrI6a.js";import"./Autocomplete-BQexmFy8.js";import"./keyboard-CK2KOmJP.js";import"./useEvent-TJw7m1NL.js";import"./useLabels-BlcH69Wp.js";import"./useLocalizedStringFormatter-DEaeFhG_.js";import"./I18nProvider-Ct0Vubxu.js";import"./useControlledState-PL9NIT9a.js";import"./Label-DzAvhi63.js";import"./useTextField-C8My7CSS.js";import"./useField-B0QwNT7y.js";import"./useLabel-BRSOlNNT.js";import"./useFormReset-EQWShVt4.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
