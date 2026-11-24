import{j as r,p as d}from"./iframe-4nxqZpQH.js";import{$ as m}from"./Form-CqRLvZ1x.js";import{$ as a}from"./Input-Cdk-ot_F.js";import{$ as s}from"./TextField-DOqfL9--.js";import{F as o}from"./FieldError-BIKLbZO6.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-B_CpPLsC.js";import"./useObjectRef-CnTOzlP3.js";import"./useFormValidation-ZZF8mbB2.js";import"./useFocusRing-DLLTypMY.js";import"./useHover-6QHjRx59.js";import"./Hidden-BHEINN-B.js";import"./FieldError-BXBChgnT.js";import"./Text-CLYtJTsR.js";import"./Autocomplete-DCUHQcUI.js";import"./keyboard-DrZcZ53x.js";import"./getMetaValue-yJ3DJPKd.js";import"./useEvent-C0ADcz5S.js";import"./useLabels-LZrLLl2Z.js";import"./useLocalizedStringFormatter-4T10-1Qu.js";import"./I18nProvider-C7-lUSN5.js";import"./useControlledState-BipTuFfk.js";import"./Label-DFDy7rWc.js";import"./useTextField-NQJPnPp0.js";import"./useField-C-Ng_aIY.js";import"./useLabel-B3SXQ9nf.js";import"./useFormReset-0ATPKRb6.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
