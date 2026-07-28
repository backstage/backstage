import{bR as r,c7 as d}from"./iframe-DQtIir6_.js";import{a as m}from"./useFormValidation-CcujdjyJ.js";import{c as a}from"./Input-DhaMJBF2.js";import{$ as s}from"./TextField-CQHvuqI_.js";import{F as o}from"./FieldError-17Foyh5_.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-Bxehr4HY.js";import"./useObjectRef-DXWxL9lA.js";import"./useFocusRing-C5ZfLx-L.js";import"./openLink-DLb8P_7j.js";import"./useHover-Dsk-KXl4.js";import"./Hidden-BXNE10bz.js";import"./FieldError-X1ho85_q.js";import"./Text-C6rkAhiv.js";import"./Autocomplete-CbdvlYso.js";import"./keyboard-CcRtsJxd.js";import"./useEvent-CfByOP8u.js";import"./useLabels-DLIlGtBk.js";import"./useLocalizedStringFormatter-DGn_4eCR.js";import"./I18nProvider-DPDmyrTN.js";import"./useControlledState-DM-B3g3-.js";import"./Label-CAcSZgVu.js";import"./useTextField-fgQA1ZSg.js";import"./useField-X2MxXqm2.js";import"./useLabel-mAp9Q6tE.js";import"./useFormReset-BmTewx61.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
