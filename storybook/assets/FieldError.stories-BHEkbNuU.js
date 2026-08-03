import{bR as r,c7 as d}from"./iframe-Bep9_wBM.js";import{a as m}from"./useFormValidation-DQVcjs21.js";import{c as a}from"./Input-DNjM_x5h.js";import{$ as s}from"./TextField-BHQKup_a.js";import{F as o}from"./FieldError-AMQvzmZ6.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DKKUPgM-.js";import"./useObjectRef-BMeF5lvf.js";import"./useFocusRing-E1AuPNx9.js";import"./openLink-DRfzd4-2.js";import"./useHover-DE1qWbCW.js";import"./Hidden-oYhCQ5Lr.js";import"./FieldError-PsYucoOR.js";import"./Text-BGZzKR-G.js";import"./Autocomplete-BXs_0ks3.js";import"./keyboard-CUlyN15g.js";import"./useEvent-67yxp7d3.js";import"./useLabels-BH6rqbM3.js";import"./useLocalizedStringFormatter-mkayHLXh.js";import"./I18nProvider-7dRPeGho.js";import"./useControlledState-B2mYurZ2.js";import"./Label-CXp4l2Zb.js";import"./useTextField-CaarGrBO.js";import"./useField-pYHkB-lT.js";import"./useLabel-BiWRb2jR.js";import"./useFormReset-mbGsMuFn.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
