import{j as r,p as d}from"./iframe-81VbGqYS.js";import{$ as m}from"./Form-BW2R70vK.js";import{$ as a}from"./Input-D4Umh9QE.js";import{$ as s}from"./TextField-Dq2jBiaQ.js";import{F as o}from"./FieldError-CA1UYSqQ.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-Bc3qSy6a.js";import"./useObjectRef-CnOD3daG.js";import"./useFormValidation-iCx97y-U.js";import"./useFocusRing-DYHYlv_4.js";import"./useHover-BliW0Nnt.js";import"./Hidden-Cb1mFWSL.js";import"./FieldError-ptcf45Tc.js";import"./Text-Dwv53_8C.js";import"./Autocomplete-DwtsJgQQ.js";import"./keyboard-CCO2TRC1.js";import"./getMetaValue-CCa-nVAs.js";import"./useEvent-BH0muyj4.js";import"./useLabels-DvwPDbuz.js";import"./useLocalizedStringFormatter-CCFWdnVn.js";import"./I18nProvider-DxzKOluv.js";import"./useControlledState-DitDneEU.js";import"./Label-Dd3OarLH.js";import"./useTextField-B6wfEo-c.js";import"./useField-C1N2YRai.js";import"./useLabel-DNA1h8U7.js";import"./useFormReset-BBjLEm68.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
