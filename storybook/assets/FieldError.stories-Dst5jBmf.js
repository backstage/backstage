import{j as r,p as d}from"./iframe-BYYe_BET.js";import{$ as m}from"./Form-DuiANyPI.js";import{$ as a}from"./Input-BCQuwCc2.js";import{$ as s}from"./TextField-DCktPls4.js";import{F as o}from"./FieldError-DHcVDA2P.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CJSyyO3-.js";import"./useObjectRef-9OXtpzcu.js";import"./useFormValidation-DJxngnhN.js";import"./useFocusRing-BRx5O8Da.js";import"./openLink-BON_CNZm.js";import"./useHover-DawSjhGk.js";import"./Hidden-c60OiMP4.js";import"./FieldError-lvCPLHt0.js";import"./Text-DCKtGqqk.js";import"./Autocomplete-DPgl-JtA.js";import"./keyboard-DfJpn7U5.js";import"./getMetaValue-Bn1etyTW.js";import"./useEvent-B1WEd5Ze.js";import"./useLabels-4i8ghj68.js";import"./useLocalizedStringFormatter-yKTdty33.js";import"./I18nProvider-rRNMaJeu.js";import"./useControlledState-DguQehpe.js";import"./Label-Bs-x77sn.js";import"./useTextField-D_S0Erlu.js";import"./useField-CTlO1gOc.js";import"./useLabel-dcXziXhr.js";import"./useFormReset-CgEuTYmc.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
