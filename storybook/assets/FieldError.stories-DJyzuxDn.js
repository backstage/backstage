import{j as r,p as d}from"./iframe-BboAvpku.js";import{$ as m}from"./Form-D3ZC0YgV.js";import{$ as a}from"./Input-AtSeLTwI.js";import{$ as s}from"./TextField-Bjl92VED.js";import{F as o}from"./FieldError-DuYOBgJ-.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-RjN6cOlV.js";import"./useObjectRef-BBnfzFd-.js";import"./useFormValidation-CpFVQ1y7.js";import"./useFocusRing-BIuw5o9K.js";import"./openLink-TmJYTFGY.js";import"./useHover-Cg57FJ61.js";import"./Hidden-B9xv55fQ.js";import"./FieldError-BP_cnqYJ.js";import"./Text-sLtLFVg2.js";import"./Autocomplete-BCDxmfrb.js";import"./keyboard-BM3A22Pr.js";import"./getMetaValue-Dkox27la.js";import"./useEvent-SPsT6SeD.js";import"./useLabels-C3K2MhXi.js";import"./useLocalizedStringFormatter-DAXqnvE_.js";import"./I18nProvider-XE_7i8YB.js";import"./useControlledState-DOt2_KtG.js";import"./Label-CSCfT4hg.js";import"./useTextField-BJifqkQ_.js";import"./useField-CNx3ldnW.js";import"./useLabel-BJaNI2Tj.js";import"./useFormReset-D33UvyuP.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
