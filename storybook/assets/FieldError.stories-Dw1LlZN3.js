import{bQ as r,c5 as d}from"./iframe-DXdR4xPj.js";import{a as m}from"./useFormValidation-5SPC4rhD.js";import{c as a}from"./Input-BQrTLKPj.js";import{$ as s}from"./TextField-B972hu-w.js";import{F as o}from"./FieldError-CuV66dUz.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-C-HUDFAG.js";import"./useObjectRef-CbSdwcnt.js";import"./useFocusRing-CYFxGxD_.js";import"./openLink-C1Sid2pZ.js";import"./useHover-DQCkeZXu.js";import"./Hidden-DEL9fdLN.js";import"./FieldError-BWSEqUjJ.js";import"./Text-gNAEQAy_.js";import"./Autocomplete-C_htAJtr.js";import"./keyboard-DjhTbvoF.js";import"./useEvent-Cm9ScuUm.js";import"./useLabels-D61_ZlAV.js";import"./useLocalizedStringFormatter-CNTHe_n6.js";import"./I18nProvider-C2KDHo4-.js";import"./useControlledState-BREXAMRj.js";import"./Label-Zek0cQNR.js";import"./useTextField-BzN2GkCH.js";import"./useField-RzY76_L5.js";import"./useLabel-BKLzxkTR.js";import"./useFormReset-CLOf4j1R.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
