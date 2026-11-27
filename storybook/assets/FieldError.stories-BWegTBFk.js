import{j as r,p as d}from"./iframe-BLrGTSaW.js";import{$ as m}from"./Form-CUwMEZbK.js";import{$ as a}from"./Input-Cwi8rIcD.js";import{$ as s}from"./TextField-Da8AW_rC.js";import{F as o}from"./FieldError-BklSVPo8.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DY5RBqiV.js";import"./useObjectRef-ZSOSKmjG.js";import"./useFormValidation-DKsM2ztO.js";import"./useFocusRing-BB9hpzXx.js";import"./useHover-SA74TXF1.js";import"./Hidden-mL7bCk3G.js";import"./FieldError-4Ao0Q7ll.js";import"./Text-BojrXTqg.js";import"./Autocomplete-HxKAEOXF.js";import"./keyboard-D3SBllk2.js";import"./getMetaValue-CAHBYg8p.js";import"./useEvent-C0Msdpds.js";import"./useLabels-CSSt0rmf.js";import"./useLocalizedStringFormatter-DQdAryoN.js";import"./I18nProvider-q6Gkr_5S.js";import"./useControlledState-DB6Fhmvl.js";import"./Label-CubIRV2P.js";import"./useTextField-ByHjNULi.js";import"./useField-BDehp1MI.js";import"./useLabel-CLI3Xr7r.js";import"./useFormReset-Dw6LrR2q.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...t.input.parameters?.docs?.source}}};const w=["WithServerValidation","WithCustomMessage","WithRenderProp"];export{i as WithCustomMessage,t as WithRenderProp,e as WithServerValidation,w as __namedExportsOrder};
