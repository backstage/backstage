import{j as r,p as d}from"./iframe-C7lYm63e.js";import{$ as m}from"./Form-zZEEHrPM.js";import{$ as a}from"./Input-Bl4PdeGR.js";import{$ as s}from"./TextField-C3TgiGHW.js";import{F as o}from"./FieldError-BAk-nb_O.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BUzKzuKz.js";import"./useObjectRef-aANnWHv4.js";import"./useFormValidation-DUls_W6A.js";import"./useFocusRing-DBYmBdNX.js";import"./useHover-Dh_5CIee.js";import"./Hidden-C01qEBuY.js";import"./FieldError-DSs23qmd.js";import"./Text-BaJbPGan.js";import"./Autocomplete-nYZs8amC.js";import"./keyboard-COdNUR9C.js";import"./getMetaValue-C1Arjnva.js";import"./useEvent-Bz_EWePK.js";import"./useLabels-B_JIZiXA.js";import"./useLocalizedStringFormatter-YAhVtzvN.js";import"./I18nProvider-cMES1Ye-.js";import"./useControlledState-BNzUk4rc.js";import"./Label-BN9dytpW.js";import"./useTextField-7X0JhYHF.js";import"./useField-k9YTPZiv.js";import"./useLabel-CLnEY2ws.js";import"./useFormReset-BEQYUo_O.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
