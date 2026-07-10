import{bR as r,c7 as d}from"./iframe-B-XWDeDQ.js";import{a as m}from"./useFormValidation-BrZcKhVQ.js";import{c as a}from"./Input-tMw-Q_4-.js";import{$ as s}from"./TextField-9LqerU_f.js";import{F as o}from"./FieldError-BVGYWWhr.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DALzhVoK.js";import"./useObjectRef-BjeGjbpr.js";import"./useFocusRing-rcGClAZz.js";import"./openLink-m4-wtxGX.js";import"./useHover-CNCT38hS.js";import"./Hidden-BedOfKsW.js";import"./FieldError-ajciDvon.js";import"./Text-C6vZ8XAa.js";import"./Autocomplete-CLdpdlQF.js";import"./keyboard-DWqMnDLI.js";import"./useEvent-DIgtVdes.js";import"./useLabels-B3aofaea.js";import"./useLocalizedStringFormatter-BEmC_YO6.js";import"./I18nProvider-DDduGJCb.js";import"./useControlledState-BYvHYB8a.js";import"./Label-D7GSmtfn.js";import"./useTextField-DMKViTdg.js";import"./useField-DPmJ-tA5.js";import"./useLabel-DttkFmAP.js";import"./useFormReset-C4aB3TBa.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
