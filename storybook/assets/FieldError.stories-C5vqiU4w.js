import{bR as r,c7 as d}from"./iframe-CHEWuc0v.js";import{a as m}from"./useFormValidation-Cxqe4FSt.js";import{c as a}from"./Input-x_Yp9vW1.js";import{$ as s}from"./TextField-CpqDgdFb.js";import{F as o}from"./FieldError-OB0ZLjnP.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BxEscNNs.js";import"./useObjectRef-DKAsx6hW.js";import"./useFocusRing-1zG72QMw.js";import"./openLink-BiHhgp--.js";import"./useHover-00AgdYZB.js";import"./Hidden-CAexRByi.js";import"./FieldError-BeS7cYV1.js";import"./Text-DScPCt4K.js";import"./Autocomplete-ELpe6TRS.js";import"./keyboard-4NRJcueD.js";import"./useEvent-B8pMzZDs.js";import"./useLabels-Bv_lSVf9.js";import"./useLocalizedStringFormatter-BkATKUa_.js";import"./I18nProvider-UVXl-yfe.js";import"./useControlledState-CNV1iaRe.js";import"./Label-DQqpprKD.js";import"./useTextField-COfODcd5.js";import"./useField-BNKDi1A0.js";import"./useLabel-B58lRzKY.js";import"./useFormReset-D0DN1vi5.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
