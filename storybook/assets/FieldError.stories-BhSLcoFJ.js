import{p as d,j as e}from"./iframe-B7rMUZLI.js";import{$ as m}from"./Form-CgS4S68u.js";import{$ as s}from"./Input-DlolFCpl.js";import{$ as o}from"./TextField-D6aY0rl6.js";import{F as a}from"./FieldError-DSuC3iOL.js";import"./preload-helper-PPVm8Dsz.js";import"./useFocusable-ClWQMn9d.js";import"./useObjectRef-DEnsH6rN.js";import"./utils-CskuH5Xa.js";import"./useFormReset-i9GVU3LF.js";import"./useControlledState-BQXzh_KJ.js";import"./useField-DlT5_N_R.js";import"./useLabel-Dv3Z2CCY.js";import"./useLabels-DHGAAfGz.js";import"./Hidden-CUKOtxN2.js";import"./useFocusRing-BvMZV5tk.js";import"./FieldError-7A30sOuy.js";import"./Text-4zdSIc43.js";import"./RSPContexts-BsOeljXL.js";import"./Label-tG96k_Td.js";const n=d.meta({title:"Backstage UI/FieldError",component:a}),r=n.story({render:()=>e.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:e.jsxs(o,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(a,{})]})})}),i=n.story({render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(a,{children:"This is a custom error message."})]})}),t=n.story({render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(a,{children:({validationErrors:l})=>l.length>0?l[0]:"Field is invalid"})]})});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const WithServerValidation = () => (
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
})`,...t.input.parameters?.docs?.source}}};const R=["WithServerValidation","WithCustomMessage","WithRenderProp"];export{i as WithCustomMessage,t as WithRenderProp,r as WithServerValidation,R as __namedExportsOrder};
