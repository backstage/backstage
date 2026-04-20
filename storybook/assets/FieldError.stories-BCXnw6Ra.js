import{j as r,p as d}from"./iframe-ePBrCY0J.js";import{$ as m}from"./useFormValidation-CyPPV_21.js";import{$ as a}from"./useTextField-DPqwEKMK.js";import{$ as s}from"./TextField-DaRXM35-.js";import{F as o}from"./FieldError-BAbpA5-1.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-GBijbolr.js";import"./useObjectRef-CclugPMZ.js";import"./useGlobalListeners-C1Wz4BBp.js";import"./openLink-DeVepgBP.js";import"./Hidden-B2rvrS5M.js";import"./useHover-DSqx_ATM.js";import"./useField-Dr-FKh4K.js";import"./useLabel-TFQcYu-7.js";import"./useLabels-B4Vxdzxx.js";import"./useFormReset-Bkitr4zB.js";import"./useControlledState-CQHZuYfK.js";import"./FieldError-5XilZbEY.js";import"./Text-C6_aqZ0v.js";import"./Autocomplete-QHumKYq_.js";import"./keyboard-BIot6J6b.js";import"./useEvent-FGignhdM.js";import"./useLocalizedStringFormatter-oJ_OSv4u.js";import"./I18nProvider-R5Bgm47i.js";import"./Label-1Kx-PSOk.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...t.input.parameters?.docs?.source}}};const _=["WithServerValidation","WithCustomMessage","WithRenderProp"];export{i as WithCustomMessage,t as WithRenderProp,e as WithServerValidation,_ as __namedExportsOrder};
