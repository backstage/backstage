import{j as r,p as d}from"./iframe-D4ojcRBn.js";import{$ as m}from"./useFormValidation-QY3_JajN.js";import{$ as a}from"./Input-B3C67cIY.js";import{$ as s}from"./TextField-BARlqeSY.js";import{F as o}from"./FieldError-yJqEjFdo.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-Cm3b7Skj.js";import"./useObjectRef-DkO8wYK8.js";import"./useGlobalListeners-Gjlq1Nm8.js";import"./openLink-Dgpda5ne.js";import"./useHover-BrnPNTQ_.js";import"./Hidden-DqoOPxZG.js";import"./FieldError-D1tnYwiC.js";import"./Text-CeBFKxbr.js";import"./Autocomplete-ZvIpyd9g.js";import"./keyboard-CWbYtSBH.js";import"./useEvent-Bo_Ag7Ze.js";import"./useLabels-Bymz_Bk2.js";import"./useLocalizedStringFormatter-CxWeQ8ll.js";import"./I18nProvider-DcSF5323.js";import"./useControlledState-DLb6xbqZ.js";import"./Label-CB4WGRMe.js";import"./useTextField-DuhpfueG.js";import"./useField-DTRRMUNK.js";import"./useLabel-Bpz-kngj.js";import"./useFormReset-vk-N9tAs.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
