import{bR as r,c7 as d}from"./iframe-Dv_LOz74.js";import{a as m}from"./useFormValidation-CDwxaZF-.js";import{c as a}from"./Input-PEFc4oFr.js";import{$ as s}from"./TextField-CYJzCEKr.js";import{F as o}from"./FieldError-zRgA20wC.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CjhwUgks.js";import"./useObjectRef-D8wsRhUy.js";import"./useFocusRing-CCaIs5i6.js";import"./openLink-CPEyVxLu.js";import"./useHover-DQFpSDLs.js";import"./Hidden-DEjifGz4.js";import"./FieldError-B3xmL9zJ.js";import"./Text-COdlm33f.js";import"./Autocomplete-B9zp45Lj.js";import"./keyboard-CTWwmG_b.js";import"./useEvent-DM9ivS_a.js";import"./useLabels-DeGtPF3O.js";import"./useLocalizedStringFormatter-C9jxhAjU.js";import"./I18nProvider-D_j_7FFZ.js";import"./useControlledState-Bgmi2uXG.js";import"./Label-C9AKJy0p.js";import"./useTextField-CWhFKII_.js";import"./useField-5isTmZBK.js";import"./useLabel-quKVFZ4h.js";import"./useFormReset-BRPqBP2J.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
