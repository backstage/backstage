import{j as r,p as d}from"./iframe-BS0xFXlr.js";import{$ as m}from"./Form-Dzkw_-wT.js";import{$ as a}from"./Input-C98m36Qq.js";import{$ as s}from"./TextField-C1EkLpX6.js";import{F as o}from"./FieldError-Df_NNgor.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-Cm8LN8Qs.js";import"./useObjectRef-DUcg5Ry6.js";import"./useFormValidation-BzvYcKAP.js";import"./useFocusRing-DN0Vfw2w.js";import"./useHover-CBc8HZSH.js";import"./Hidden-B4kfQ2c4.js";import"./FieldError-B0W-gOBy.js";import"./Text-CuDGkaxu.js";import"./Autocomplete-w_NQzNO7.js";import"./keyboard-0e26zbuq.js";import"./getMetaValue-gNZTl7Dq.js";import"./useEvent-C9_3kZDD.js";import"./useLabels-BEdhgbVu.js";import"./useLocalizedStringFormatter-C0vYX1Z5.js";import"./I18nProvider-PG7J6CX1.js";import"./useControlledState--_QEZGZM.js";import"./Label-CYKe4XnV.js";import"./useTextField-QI3hhjLQ.js";import"./useField-D-T_edQG.js";import"./useLabel-BuvGyTAc.js";import"./useFormReset-C6LGHf4l.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
