import{j as r,p as d}from"./iframe-Q4ctuRUv.js";import{$ as m}from"./Form-Brw3O52F.js";import{$ as a}from"./Input-BCq2znLO.js";import{$ as s}from"./TextField-BZXU0k4N.js";import{F as o}from"./FieldError-CRKMDsZY.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CTbYSeHd.js";import"./useObjectRef-BFzgzp46.js";import"./useFormValidation-DPOCc4Gj.js";import"./useFocusRing-DiENv1rk.js";import"./openLink-qs0UDoSy.js";import"./useHover-B_-Qawkz.js";import"./Hidden-BhGBloyx.js";import"./FieldError-D43CsVYe.js";import"./Text-YknYtPMS.js";import"./Autocomplete-BSvySyXp.js";import"./keyboard-B0COaPZh.js";import"./getMetaValue-CITejevD.js";import"./useEvent-BpVCmMqU.js";import"./useLabels-BPBTzwbg.js";import"./useLocalizedStringFormatter-C234lHL1.js";import"./I18nProvider-Bsf8nutC.js";import"./useControlledState-CGLHX-Pe.js";import"./Label-BJe5bXQU.js";import"./useTextField-DQVyUx5t.js";import"./useField-Bjdaztqi.js";import"./useLabel-UNvbR8sI.js";import"./useFormReset-Bpe--cgd.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
