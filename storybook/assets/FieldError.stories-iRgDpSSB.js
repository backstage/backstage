import{bR as r,c7 as d}from"./iframe-DmKIhSd4.js";import{a as m}from"./useFormValidation-Cc5Povv1.js";import{c as a}from"./Input-DtmKW4qJ.js";import{$ as s}from"./TextField-BicCzOYf.js";import{F as o}from"./FieldError-Cex0IS75.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-Bp1UFdf_.js";import"./useObjectRef-DibnPYi9.js";import"./useFocusRing-DrLz8-Tu.js";import"./openLink-Zk6hhSyn.js";import"./useHover-CwSUiPfU.js";import"./Hidden-B2CHbqyo.js";import"./FieldError-CirVGv2n.js";import"./Text-Byu4ntdl.js";import"./Autocomplete-C5Sghm7K.js";import"./keyboard-Ds5EVepz.js";import"./useEvent-CsZ4P3K8.js";import"./useLabels-B-OZcbcW.js";import"./useLocalizedStringFormatter-D0LOo8fp.js";import"./I18nProvider-BA08ZmK6.js";import"./useControlledState-OVmM0QOa.js";import"./Label-C46amIDy.js";import"./useTextField-4a3KQF0X.js";import"./useField-CxXZZEuS.js";import"./useLabel-BhsNw667.js";import"./useFormReset-DQqa-4LG.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
