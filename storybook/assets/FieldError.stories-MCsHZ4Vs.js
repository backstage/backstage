import{a5 as d,j as e}from"./iframe-BooBp-Po.js";import{$ as m}from"./Form-CrizCi1q.js";import{$ as s}from"./Input-Z0wYesVD.js";import{$ as o}from"./TextField-Cbzu1IB-.js";import{F as a}from"./FieldError-CR3JTKoF.js";import"./preload-helper-PPVm8Dsz.js";import"./useFocusable-Ct2KJ7jq.js";import"./useObjectRef-CQhQUnYC.js";import"./clsx-B-dksMZM.js";import"./utils-R2w7QvC2.js";import"./useFormReset-h1tGfA0p.js";import"./useControlledState-CoOZhyQ2.js";import"./useField-0qwCOPVy.js";import"./useLabel-DiuR5i__.js";import"./useLabels-BQwWUMmc.js";import"./Hidden-WcNX630i.js";import"./useFocusRing-DCKUhsdJ.js";import"./FieldError-FFQySjgh.js";import"./Text-xDrUOydQ.js";import"./RSPContexts-CylrRQt3.js";import"./Label-0Y1KTz5Y.js";import"./useStyles-Dgt1cMYv.js";const n=d.meta({title:"Backstage UI/FieldError",component:a}),r=n.story({render:()=>e.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:e.jsxs(o,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(a,{})]})})}),i=n.story({render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(a,{children:"This is a custom error message."})]})}),t=n.story({render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(a,{children:({validationErrors:l})=>l.length>0?l[0]:"Field is invalid"})]})});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const WithServerValidation = () => (
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
