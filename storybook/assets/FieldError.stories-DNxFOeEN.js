import{bR as r,c7 as d}from"./iframe-DQDMWdhR.js";import{a as m}from"./useFormValidation-DXQnm1J-.js";import{c as a}from"./Input-CHBBdEkX.js";import{$ as s}from"./TextField-DvvbYBzG.js";import{F as o}from"./FieldError-sQUdikz1.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-B-ovU0-_.js";import"./useObjectRef-Dh-vte6W.js";import"./useFocusRing-Dqv3dHhs.js";import"./openLink-D1CPkxqm.js";import"./useHover-MC-zazTO.js";import"./Hidden-Bb1SO8z8.js";import"./FieldError-Bzv1nRs-.js";import"./Text-D9BpNmMe.js";import"./Autocomplete-C1KNIHyS.js";import"./keyboard-d2VMsAOu.js";import"./useEvent-DOk9v1cy.js";import"./useLabels-Pb8F9YZg.js";import"./useLocalizedStringFormatter-DpUfSixd.js";import"./I18nProvider-TsAeBo9n.js";import"./useControlledState-DZKUYVcn.js";import"./Label-B6V4-sZF.js";import"./useTextField-Dk57rPxm.js";import"./useField-CT7s6dvF.js";import"./useLabel-B25DV_yj.js";import"./useFormReset-BzTV__2L.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
