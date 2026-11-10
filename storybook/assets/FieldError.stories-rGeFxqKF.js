import{j as r,p as d}from"./iframe-S5OJNhaE.js";import{$ as m}from"./Form-CdsOyD6B.js";import{$ as a}from"./Input-eHTkKayp.js";import{$ as s}from"./TextField-7ButIh8B.js";import{F as o}from"./FieldError-Cu4qh9di.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-Bf43CEqe.js";import"./useObjectRef-Ce7Pg0IE.js";import"./useFormValidation-CHoAG3iu.js";import"./useFocusRing-DrNn4w0v.js";import"./openLink-gCGEI6Hl.js";import"./useHover-DRBklp1Y.js";import"./Hidden-bbdHFmyf.js";import"./FieldError-B0-R75VP.js";import"./Text-CxFSOtlL.js";import"./Autocomplete-D8VeH8Ib.js";import"./keyboard-DsBCMzZY.js";import"./getMetaValue-DfvZTkcg.js";import"./useEvent-BTfti7hW.js";import"./useLabels-lt4DDiFl.js";import"./useLocalizedStringFormatter-FCJD34ts.js";import"./I18nProvider-B9PKsfTQ.js";import"./useControlledState-sjWVeRbh.js";import"./Label-Dm19jsZB.js";import"./useTextField-XvGvtHKV.js";import"./useField-C9JYPx-z.js";import"./useLabel-D6KUrPXz.js";import"./useFormReset-CTFIfjuR.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
