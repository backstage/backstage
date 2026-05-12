import{j as r,p as d}from"./iframe-nLmXqEf7.js";import{$ as m}from"./useFormValidation-Coh1_1M8.js";import{$ as a}from"./Input-BueuAVR-.js";import{$ as s}from"./TextField-U_lzQncG.js";import{F as o}from"./FieldError-BGxAebJ0.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BHAGaPmB.js";import"./useObjectRef-BxjTy_io.js";import"./useFocusRing-CRF3QW5j.js";import"./openLink-52acbO8n.js";import"./useHover-DzrNdeA5.js";import"./Hidden-Droxpmwn.js";import"./FieldError-JUfGZ6Pi.js";import"./Text-D4GNDssI.js";import"./Autocomplete-2mvVyjFP.js";import"./keyboard-Dzy1pKfB.js";import"./useEvent-C9J8YBp8.js";import"./useLabels-Bv7MIFK3.js";import"./useLocalizedStringFormatter-CdDwfP8u.js";import"./I18nProvider--lkhv8yr.js";import"./useControlledState-I4v4Pk17.js";import"./Label-DiUjif3Y.js";import"./useTextField-BDjP47x_.js";import"./useField-Daqylzv8.js";import"./useLabel-BbXuH4g9.js";import"./useFormReset-Bmvk1LvB.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
