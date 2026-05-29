import{bR as r,c7 as d}from"./iframe-t54gLFa0.js";import{a as m}from"./useFormValidation-t-xGAaZ7.js";import{c as a}from"./Input-JiKeBEm0.js";import{$ as s}from"./TextField-MithS7pD.js";import{F as o}from"./FieldError-BpFGbwfs.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-W_OcwHCh.js";import"./useObjectRef-C3DVLawX.js";import"./useFocusRing-V0WlKBhU.js";import"./openLink-BrZmZSwy.js";import"./useHover-DSCE7LE-.js";import"./Hidden-Bp4y3_la.js";import"./FieldError-N1cuoUOh.js";import"./Text-43fvPt9T.js";import"./Autocomplete-P1PFt3qE.js";import"./keyboard-RHFCgLFL.js";import"./useEvent-B2ORR698.js";import"./useLabels-Cl1AF1fl.js";import"./useLocalizedStringFormatter-DQu-DAui.js";import"./I18nProvider-D1Ub29LP.js";import"./useControlledState-3Cl2ojEk.js";import"./Label-BScIi9Kg.js";import"./useTextField-BWoBi-F7.js";import"./useField-BxTVInbI.js";import"./useLabel-B4TkV3uy.js";import"./useFormReset-CukaQ-Is.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
