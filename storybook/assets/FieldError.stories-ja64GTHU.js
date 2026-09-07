import{bQ as r,c5 as d}from"./iframe-DFSHFeCl.js";import{a as m}from"./useFormValidation-Dlp-ns6i.js";import{c as a}from"./Input-CC8yKmPI.js";import{$ as s}from"./TextField-Dbu48387.js";import{F as o}from"./FieldError-Dbox7jPP.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-Br_KD21J.js";import"./useObjectRef-5J7-CqHL.js";import"./useFocusRing-DK7tnvLa.js";import"./openLink-BDUtlzhT.js";import"./useHover-DTeONGMq.js";import"./Hidden-Dx45ZTjH.js";import"./FieldError-BPsmoLqs.js";import"./Text-CnNdo26s.js";import"./Autocomplete-ERpxxjwQ.js";import"./keyboard-fFFHaEtw.js";import"./useEvent-BwtYMmmR.js";import"./useLabels--neREfox.js";import"./useLocalizedStringFormatter-DIyeRDi1.js";import"./I18nProvider-DTAG6ziA.js";import"./useControlledState-CqWOEZ5B.js";import"./Label-5UBRWhey.js";import"./useTextField-Dkd0dHrB.js";import"./useField-yItrfdEq.js";import"./useLabel-DvxVy_uj.js";import"./useFormReset-C38yIenU.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
