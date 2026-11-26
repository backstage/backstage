import{j as r,p as d}from"./iframe-bb_jNxxL.js";import{$ as m}from"./Form-C58QXp5W.js";import{$ as a}from"./Input-Dr54Is2P.js";import{$ as s}from"./TextField-2Sr-6I5s.js";import{F as o}from"./FieldError-8hzroWbP.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-Cyge8L4m.js";import"./useObjectRef-CTDjzFB8.js";import"./useFormValidation-CWqstwdw.js";import"./useFocusRing-DDqjVrJn.js";import"./useHover-dfqWQZHs.js";import"./Hidden-7ff-isZb.js";import"./FieldError-CzTxz--v.js";import"./Text-BtpIt2qG.js";import"./Autocomplete-DbeBzPgx.js";import"./keyboard-CTRGf6zG.js";import"./getMetaValue-BAPq9Qsv.js";import"./useEvent-CLir4Cc2.js";import"./useLabels-B5_kFWwx.js";import"./useLocalizedStringFormatter-Db8iDqbo.js";import"./I18nProvider-B9G7Dj3y.js";import"./useControlledState-B45Nf08u.js";import"./Label-C64Zc2HQ.js";import"./useTextField-CI0DqPWz.js";import"./useField-BGbko4b6.js";import"./useLabel-DvDKUI6U.js";import"./useFormReset-Dv4_zW6V.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
