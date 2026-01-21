import{a5 as d,j as e}from"./iframe-DfW0k9e4.js";import{$ as m}from"./Form-CVAjBXXQ.js";import{$ as s}from"./Input-BkKUeRqP.js";import{$ as o}from"./TextField-BixQckXj.js";import{F as a}from"./FieldError-icQ5yrJ7.js";import"./preload-helper-PPVm8Dsz.js";import"./useFocusable-aiAlT7lA.js";import"./useObjectRef-ndfXko-5.js";import"./clsx-B-dksMZM.js";import"./utils-DRR3ptw2.js";import"./useFormReset-yX4MOKGF.js";import"./useControlledState-uhj434oz.js";import"./useField-BCsT5xem.js";import"./useLabel-BQWnu8Fu.js";import"./useLabels-9UUdafZo.js";import"./Hidden-B7lgQDnX.js";import"./useFocusRing-DlBp-3vS.js";import"./FieldError-B6-QXISI.js";import"./Text-BBRG5Rr6.js";import"./RSPContexts-BUsH9FMk.js";import"./Label-B7AT8mbG.js";import"./useStyles-BBnyiXjo.js";const n=d.meta({title:"Backstage UI/FieldError",component:a}),r=n.story({render:()=>e.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:e.jsxs(o,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(a,{})]})})}),i=n.story({render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(a,{children:"This is a custom error message."})]})}),t=n.story({render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(a,{children:({validationErrors:l})=>l.length>0?l[0]:"Field is invalid"})]})});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const WithServerValidation = () => (
  <Form validationErrors={{ demo: "This is a server validation error." }}>
    <TextField
      name="demo"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Input />
      <FieldError />
    </TextField>
  </Form>
);
`,...r.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{code:`const WithCustomMessage = () => (
  <TextField
    isInvalid
    validationBehavior="aria"
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    }}
  >
    <Input />
    <FieldError>This is a custom error message.</FieldError>
  </TextField>
);
`,...i.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{code:`const WithRenderProp = () => (
  <TextField
    isInvalid
    validationBehavior="aria"
    validate={() => "This field is invalid"}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    }}
  >
    <Input />
    <FieldError>
      {({ validationErrors }) =>
        validationErrors.length > 0 ? validationErrors[0] : "Field is invalid"
      }
    </FieldError>
  </TextField>
);
`,...t.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...r.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...t.input.parameters?.docs?.source}}};const M=["WithServerValidation","WithCustomMessage","WithRenderProp"];export{i as WithCustomMessage,t as WithRenderProp,r as WithServerValidation,M as __namedExportsOrder};
