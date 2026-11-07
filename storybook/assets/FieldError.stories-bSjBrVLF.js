import{j as r,p as d}from"./iframe-DxHtOo4h.js";import{$ as m}from"./Form-DU0UIvGK.js";import{$ as a}from"./Input-DCzt78cV.js";import{$ as s}from"./TextField-CFSo4zG9.js";import{F as o}from"./FieldError-DdcUKVe7.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CAdw532L.js";import"./useObjectRef-D6AnwJdq.js";import"./useFormValidation-DZL7-bkS.js";import"./useFocusRing-DGlhroDz.js";import"./openLink-DpClGL1h.js";import"./useHover-CHigp1TN.js";import"./Hidden-C-73n3sF.js";import"./FieldError-BJ_bTBup.js";import"./Text-um_55q4T.js";import"./Autocomplete-Blt4da4X.js";import"./keyboard-CuZJZT3E.js";import"./getMetaValue-Its-2R3E.js";import"./useEvent-DtIMMGwF.js";import"./useLabels-DjvWLG0Y.js";import"./useLocalizedStringFormatter-DmTXBO-j.js";import"./I18nProvider-CE0E7M0k.js";import"./useControlledState-BOC0pUVV.js";import"./Label-JZuHlYG-.js";import"./useTextField-CaKqjYbL.js";import"./useField-uTiKHKmu.js";import"./useLabel-D3L5WW2z.js";import"./useFormReset-DnnjnzwE.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...t.input.parameters?.docs?.source}}};const O=["WithServerValidation","WithCustomMessage","WithRenderProp"];export{i as WithCustomMessage,t as WithRenderProp,e as WithServerValidation,O as __namedExportsOrder};
