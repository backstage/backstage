import{j as r,p as d}from"./iframe-Cm1o1Xbd.js";import{$ as m}from"./useFormValidation-BwfRfpIx.js";import{$ as a}from"./Input-CmWiuKh5.js";import{$ as s}from"./TextField-DQW_2G12.js";import{F as o}from"./FieldError-CHRFqr7z.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CjATNJ3m.js";import"./useObjectRef-wY4oQFtf.js";import"./useFocusRing-CoxzC_Ds.js";import"./openLink-D5lxhsMC.js";import"./useHover-Dfi0Xo1f.js";import"./Hidden-petjBLnB.js";import"./FieldError-CHGZLjE9.js";import"./Text-BRud69M1.js";import"./Autocomplete-DwY5UQIB.js";import"./keyboard-BFbUDS0A.js";import"./useEvent-BHp8Qbj_.js";import"./useLabels-B2QQzy0Q.js";import"./useLocalizedStringFormatter-DiF8Cs8o.js";import"./I18nProvider-DOJNZcHM.js";import"./useControlledState-CXz-jgZ-.js";import"./Label-g3yw8owM.js";import"./useTextField-CeeL1WpF.js";import"./useField-CZVexkQR.js";import"./useLabel-RK6B06Tf.js";import"./useFormReset-1tnqmoRw.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
