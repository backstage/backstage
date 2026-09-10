import{bQ as r,c5 as d}from"./iframe-BjdV6pPy.js";import{a as m}from"./useFormValidation-C-4l-Tk0.js";import{c as a}from"./Input-CTu8xFkM.js";import{$ as s}from"./TextField-BGQzT8h9.js";import{F as o}from"./FieldError-BgPAPFbe.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DS91ArTN.js";import"./useObjectRef-BWm5y5ll.js";import"./useFocusRing-BtM4iWFp.js";import"./openLink-2_8aeNBf.js";import"./useHover-wrMqleU9.js";import"./Hidden-CWD5f7cO.js";import"./FieldError-DMbmG7CN.js";import"./Text-CaKKG2z6.js";import"./Autocomplete-SqsUyN4V.js";import"./keyboard-v6BsnER9.js";import"./useEvent-BvS_3wCS.js";import"./useLabels-BRtq5QIX.js";import"./useLocalizedStringFormatter-ByeqNOlS.js";import"./I18nProvider-C9qy98Iq.js";import"./useControlledState-CC4OZRef.js";import"./Label-wgpa9Qzo.js";import"./useTextField-CnlbGBjJ.js";import"./useField--MjjeZIX.js";import"./useLabel-rYSXIktO.js";import"./useFormReset-C1LKrH4D.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
