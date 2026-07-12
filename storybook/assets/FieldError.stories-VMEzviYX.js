import{bR as r,c7 as d}from"./iframe-CO97OZwt.js";import{a as m}from"./useFormValidation-qxu3lVOI.js";import{c as a}from"./Input-CpR11oJO.js";import{$ as s}from"./TextField-CRB9J6Cp.js";import{F as o}from"./FieldError-BW3PYLeL.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-2TV2V9Pm.js";import"./useObjectRef-BjR_AUMv.js";import"./useFocusRing-DpTaIKKT.js";import"./openLink-DjHgJdx-.js";import"./useHover-DfkDjIau.js";import"./Hidden-BxbxCXE4.js";import"./FieldError-CskjcK-s.js";import"./Text-CUpMtLsq.js";import"./Autocomplete-CrnLxG4M.js";import"./keyboard-BickwFmq.js";import"./useEvent-20WkBKcw.js";import"./useLabels-DeJJCjaB.js";import"./useLocalizedStringFormatter-g2jqPPVg.js";import"./I18nProvider-D_UQ682O.js";import"./useControlledState-BEju7Fey.js";import"./Label-k8w2r2dv.js";import"./useTextField-Q1vUUksR.js";import"./useField-Ajy5nl1g.js";import"./useLabel-Bfjkj2_o.js";import"./useFormReset-Dt1KXmT7.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
