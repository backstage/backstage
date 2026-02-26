import{p as d,j as e}from"./iframe-r9k78NKI.js";import{$ as m}from"./Form-Cbecpn_m.js";import{$ as s}from"./Input-Tg_PCy1H.js";import{$ as o}from"./TextField-DG3fyAsD.js";import{F as a}from"./FieldError-BZErg0RO.js";import"./preload-helper-PPVm8Dsz.js";import"./useFocusable-C1vNZMdU.js";import"./useObjectRef-D_gkq7Ew.js";import"./utils-1mF-mBBW.js";import"./useFormReset-CC49qoOM.js";import"./useControlledState-CSafjXg0.js";import"./useField-DvJM6whJ.js";import"./useLabel-BgVranTK.js";import"./useLabels-BP6YpHP4.js";import"./Hidden-mX6k30Yo.js";import"./useFocusRing-BYB5Rr_l.js";import"./FieldError-C6_VaTTl.js";import"./Text-B5FHqam3.js";import"./RSPContexts-D86LlmNT.js";import"./Label-Cy1E8g1_.js";import"./useStyles-C_XuVXRZ.js";const n=d.meta({title:"Backstage UI/FieldError",component:a}),r=n.story({render:()=>e.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:e.jsxs(o,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(a,{})]})})}),i=n.story({render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(a,{children:"This is a custom error message."})]})}),t=n.story({render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(s,{}),e.jsx(a,{children:({validationErrors:l})=>l.length>0?l[0]:"Field is invalid"})]})});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const WithServerValidation = () => (
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
})`,...t.input.parameters?.docs?.source}}};const C=["WithServerValidation","WithCustomMessage","WithRenderProp"];export{i as WithCustomMessage,t as WithRenderProp,r as WithServerValidation,C as __namedExportsOrder};
