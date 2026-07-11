import{bR as r,c7 as d}from"./iframe-COykYx45.js";import{a as m}from"./useFormValidation-DaDBy4-y.js";import{c as a}from"./Input-ye45j2AX.js";import{$ as s}from"./TextField-BPmlKeeP.js";import{F as o}from"./FieldError-BKd5KLE1.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-ijm_b3mJ.js";import"./useObjectRef-CMiC6ke_.js";import"./useFocusRing-Bjvn0GS4.js";import"./openLink-DVwmAOKC.js";import"./useHover-gDb7vOkJ.js";import"./Hidden-BsQlbI9F.js";import"./FieldError-BP5SOq7I.js";import"./Text-slD25mVU.js";import"./Autocomplete-BCll0Usm.js";import"./keyboard-C7oGs8Ux.js";import"./useEvent-Dn5dWHRg.js";import"./useLabels-Cpdv89rG.js";import"./useLocalizedStringFormatter-BGJNBy6y.js";import"./I18nProvider-DL1Ps6Ca.js";import"./useControlledState-CjsdyDjY.js";import"./Label--YQs_5DF.js";import"./useTextField-afr60wi8.js";import"./useField-Capgz0XH.js";import"./useLabel-PGKREU8T.js";import"./useFormReset-DHQFUW9B.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
