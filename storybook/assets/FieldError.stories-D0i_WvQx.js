import{p as d,j as e}from"./iframe-BJyhMgZx.js";import{$ as m}from"./Form-Dd0LG19A.js";import{$ as s}from"./Input-DRaNX5Mp.js";import{$ as o}from"./TextField-D6wdcEXV.js";import{F as a}from"./FieldError-BdRpa-Dy.js";import"./preload-helper-PPVm8Dsz.js";import"./useFocusable-CxQzf9W8.js";import"./useObjectRef-Bd_CBPON.js";import"./clsx-B-dksMZM.js";import"./utils-CJODVg5y.js";import"./useFormReset-aW6xpn04.js";import"./useControlledState-BGZa7SYV.js";import"./useField-D_inj46E.js";import"./useLabel-H0pI_2Xa.js";import"./useLabels-BFP23JJT.js";import"./Hidden-BRsv_0sX.js";import"./useFocusRing-By-PpaS4.js";import"./FieldError-CwoqtLUO.js";import"./Text-BJrnXBBF.js";import"./RSPContexts-K9gQyzYh.js";import"./Label-Bnk3h48d.js";import"./useStyles-BsgyHTwE.js";const n=d.meta({title:"Backstage UI/FieldError",component:a}),r=n.story({render:()=>e.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:e.jsxs(o,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(a,{})]})})}),i=n.story({render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(a,{children:"This is a custom error message."})]})}),t=n.story({render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(a,{children:({validationErrors:l})=>l.length>0?l[0]:"Field is invalid"})]})});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const WithServerValidation = () => (
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
