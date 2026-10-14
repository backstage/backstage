import{j as r,p as d}from"./iframe-osqb7I7f.js";import{$ as m}from"./Form-4MSHWhmU.js";import{$ as a}from"./Input-CXF4SC00.js";import{$ as s}from"./TextField-Btqdq40O.js";import{F as o}from"./FieldError-DRYDcFsC.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-C6BeXBHQ.js";import"./useObjectRef-BZCAlVk9.js";import"./useFormValidation-BDG5TrNG.js";import"./useFocusRing-CQWExipe.js";import"./openLink-Dy9KSOrl.js";import"./useHover-C6cSG5OI.js";import"./Hidden-BoP2pNUM.js";import"./FieldError-s1w9dgOY.js";import"./Text-BtxPcA8W.js";import"./Autocomplete-Cl89j45E.js";import"./keyboard-Uhp3bD4I.js";import"./getMetaValue-4uTB8c1-.js";import"./useEvent-CE4CgK68.js";import"./useLabels-U9TV3Uv2.js";import"./useLocalizedStringFormatter-D8oGcEPo.js";import"./I18nProvider-CsDtc1Vo.js";import"./useControlledState-DMCdQE-I.js";import"./Label-Dc6bt0j8.js";import"./useTextField-nejwz2I7.js";import"./useField-D5QoDmxq.js";import"./useLabel-CwKyruxE.js";import"./useFormReset-BLi1GwHW.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
