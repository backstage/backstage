import{j as r,p as d}from"./iframe-COJz9F1o.js";import{$ as m}from"./useFormValidation-76zPVQeq.js";import{$ as a}from"./Input-LTSQ7X0M.js";import{$ as s}from"./TextField-YNDpaX0F.js";import{F as o}from"./FieldError-CtICZLBA.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-Ca8VRlnk.js";import"./useObjectRef-BVWhO1QJ.js";import"./useGlobalListeners-B-mHHtEE.js";import"./openLink-D-7XJ3Oc.js";import"./useHover-d8OYsWaB.js";import"./Hidden-BUcIqtcd.js";import"./FieldError-DZi-Bg3f.js";import"./Text-Dur_mw8s.js";import"./Autocomplete-BXjco31v.js";import"./keyboard-DtR6oH2F.js";import"./useEvent-ptp_askm.js";import"./useLabels-DX3CMU8G.js";import"./useLocalizedStringFormatter-Uk8SorkE.js";import"./I18nProvider-Cix8lVYp.js";import"./useControlledState-CYGiTDAh.js";import"./Label-Bje3-SKc.js";import"./useTextField-BnkFLiJE.js";import"./useField-BrLSuq_4.js";import"./useLabel-CzB85gF3.js";import"./useFormReset-DtFtm4js.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
