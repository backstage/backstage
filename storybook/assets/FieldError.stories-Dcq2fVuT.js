import{j as r,p as d}from"./iframe-D9zyyCLm.js";import{$ as m}from"./Form-BKc8ubiD.js";import{$ as a}from"./Input-HAwV3UgY.js";import{$ as s}from"./TextField-C4BM834p.js";import{F as o}from"./FieldError-CW07svXX.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BhB9Kn0J.js";import"./useObjectRef-DW2A_FKT.js";import"./useFormValidation-DU6bMNno.js";import"./useFocusRing-Cyv4kXD7.js";import"./openLink-Dq3aE_9q.js";import"./useHover-CXer1LBh.js";import"./Hidden-BEbPYnKb.js";import"./FieldError-PBAfGMRH.js";import"./Text-DyJll7O5.js";import"./Autocomplete-y5aAoPrH.js";import"./keyboard-DCFt_Vdh.js";import"./getMetaValue-DvVIc-fc.js";import"./useEvent-CgIHwaqr.js";import"./useLabels-Cf60hIuc.js";import"./useLocalizedStringFormatter-Cws02Rph.js";import"./I18nProvider-CFA5Nn83.js";import"./useControlledState-CNVQPQl6.js";import"./Label-8xCw--Gh.js";import"./useTextField-CnV1bkF2.js";import"./useField-BFVTHaKM.js";import"./useLabel-CNCvRjXr.js";import"./useFormReset-fb_8OtZl.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
