import{bR as r,c7 as d}from"./iframe-DogXi1kP.js";import{a as m}from"./useFormValidation-BIYlJHZ1.js";import{c as a}from"./Input-BStAHKnh.js";import{$ as s}from"./TextField-PaVvYibd.js";import{F as o}from"./FieldError-VyUtu5uM.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-AxfqVSE9.js";import"./useObjectRef-UHrM_yCs.js";import"./useFocusRing-mENG_ikp.js";import"./openLink-CxuZpafj.js";import"./useHover-ox9S2Piy.js";import"./Hidden-CYdnfqbh.js";import"./FieldError-CzpSx-Mx.js";import"./Text-BRIb-OAb.js";import"./Autocomplete-DYW-F-Tj.js";import"./keyboard-a1n3wmz-.js";import"./useEvent-EwjaUY4k.js";import"./useLabels-DnC-SBWU.js";import"./useLocalizedStringFormatter-CfgpiWB3.js";import"./I18nProvider-Cag9fozJ.js";import"./useControlledState-CrzRLYRc.js";import"./Label-BT3yvL3F.js";import"./useTextField-D7_hM5Yb.js";import"./useField-DTPdncVL.js";import"./useLabel-DvnqIlMC.js";import"./useFormReset-CXIeSoiQ.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
