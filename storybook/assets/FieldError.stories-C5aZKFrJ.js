import{j as r,p as d}from"./iframe-COehFrpL.js";import{$ as m}from"./useFormValidation-DNprhFxo.js";import{$ as a}from"./Input-DfyP5AmE.js";import{$ as s}from"./TextField-Cs057rPl.js";import{F as o}from"./FieldError-D89QrEby.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BxGYbtp_.js";import"./useObjectRef-BHWA6dkP.js";import"./useFocusRing-CyIiAuhH.js";import"./openLink-Df95N0dK.js";import"./useHover-CNA2zPmI.js";import"./Hidden-B9NSBWDb.js";import"./FieldError-B5qu8tkn.js";import"./Text-BQn-2DM-.js";import"./Autocomplete--BA8J_Ge.js";import"./keyboard-DB_fWUpV.js";import"./useEvent-Cf2aNqtT.js";import"./useLabels-Detxonbw.js";import"./useLocalizedStringFormatter-BbqczZ6k.js";import"./I18nProvider-Br5myQOZ.js";import"./useControlledState-CSz_ngLu.js";import"./Label-C-s0bMoy.js";import"./useTextField-CvhJUtl4.js";import"./useField-BqRBxmza.js";import"./useLabel-Cb9ofX0t.js";import"./useFormReset-DzQTEKtm.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
