import{bQ as r,c5 as d}from"./iframe-Bbqeoxyy.js";import{a as m}from"./useFormValidation-Cw1sohsz.js";import{c as a}from"./Input-nC1ndIv_.js";import{$ as s}from"./TextField-NhAo2w_f.js";import{F as o}from"./FieldError-DbMuQ36F.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DuG_PdhV.js";import"./useObjectRef-Cou_yZVk.js";import"./useFocusRing-CJyvvUb2.js";import"./openLink-DSranXhD.js";import"./useHover-8JiRj4U9.js";import"./Hidden-wfkm4vEc.js";import"./FieldError-BDQ8zAVN.js";import"./Text-Cr5ym0oi.js";import"./Autocomplete-DejFa75s.js";import"./keyboard-OW3LSnFF.js";import"./useEvent-DXCHZ6eW.js";import"./useLabels-CD6Jijpq.js";import"./useLocalizedStringFormatter-Cp3K2lsu.js";import"./I18nProvider-o7BfuMCW.js";import"./useControlledState-Dwmvm7Z8.js";import"./Label-BYZanQTo.js";import"./useTextField-WT6ToGrz.js";import"./useField-eNfnIoXm.js";import"./useLabel-CueqYSAw.js";import"./useFormReset-JrSj1kIr.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
