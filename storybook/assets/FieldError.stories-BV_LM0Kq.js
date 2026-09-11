import{bQ as r,c5 as d}from"./iframe-DwtLqRd0.js";import{a as m}from"./useFormValidation-BqQPhjWZ.js";import{c as a}from"./Input-DheUuQ7S.js";import{$ as s}from"./TextField-B5AiieKd.js";import{F as o}from"./FieldError-CHSBQ6yu.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CTdfKX7K.js";import"./useObjectRef-C3WIJKuW.js";import"./useFocusRing-Br9K8cEf.js";import"./openLink-Chp0fPN0.js";import"./useHover-BPNWkg3J.js";import"./Hidden-Bs1ekBhh.js";import"./FieldError-ByLzKSOg.js";import"./Text-D3MLSvb0.js";import"./Autocomplete-GDZQu3ze.js";import"./keyboard-CXKWpkVO.js";import"./useEvent-Da_JgobS.js";import"./useLabels-DBBGWQnZ.js";import"./useLocalizedStringFormatter-DkppfKGx.js";import"./I18nProvider-nGJGLiEq.js";import"./useControlledState-kobszWOc.js";import"./Label-CnMUtZHy.js";import"./useTextField-BTrQ00No.js";import"./useField-DUtDhHm2.js";import"./useLabel-csUjoQn4.js";import"./useFormReset-DUch7r1q.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
