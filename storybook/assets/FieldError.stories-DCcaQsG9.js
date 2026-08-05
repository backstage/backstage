import{bR as r,c7 as d}from"./iframe-BSg6SOip.js";import{a as m}from"./useFormValidation-ChfEGaAs.js";import{c as a}from"./Input-DH05hXmi.js";import{$ as s}from"./TextField-CIaSirOv.js";import{F as o}from"./FieldError-_FYShYXS.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DeLUZGx2.js";import"./useObjectRef-DBlAjOUP.js";import"./useFocusRing-DGKZUDqT.js";import"./openLink-DxYjWf7G.js";import"./useHover-BKKglU9f.js";import"./Hidden-4PpluWSp.js";import"./FieldError-BlC4M7Iq.js";import"./Text-sM1EKRDW.js";import"./Autocomplete-CnJA6POS.js";import"./keyboard-CsWowfPP.js";import"./useEvent-wFo09GKu.js";import"./useLabels-C_VR0tdY.js";import"./useLocalizedStringFormatter-3P7dKLk3.js";import"./I18nProvider-C5Ed87oL.js";import"./useControlledState-CaozfHK9.js";import"./Label-Bsgi-8sx.js";import"./useTextField-unZ9EnYz.js";import"./useField-CXk8tlI8.js";import"./useLabel-xLEOMe10.js";import"./useFormReset-D0dwzMqm.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
