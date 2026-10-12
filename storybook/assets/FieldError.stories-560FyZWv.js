import{j as r,p as d}from"./iframe-5xJVwFMl.js";import{$ as m}from"./Form-fpgMP67S.js";import{$ as a}from"./Input-DHEuej01.js";import{$ as s}from"./TextField-7ACtxOTE.js";import{F as o}from"./FieldError-pvGoUCZa.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-g1c0Kr3k.js";import"./useObjectRef-COysk4Ng.js";import"./useFormValidation-Bionm8Qj.js";import"./useFocusRing-CL8Atm-X.js";import"./openLink-CN5IUfel.js";import"./useHover-0u_T0iEc.js";import"./Hidden-BbW38WTn.js";import"./FieldError-Yfpcergq.js";import"./Text-MPpkcO3C.js";import"./Autocomplete-BSWzw426.js";import"./keyboard-Do48IGOY.js";import"./getMetaValue-CQBj6zNl.js";import"./useEvent-BJYs4tdM.js";import"./useLabels-ClOBW_ex.js";import"./useLocalizedStringFormatter-DPT4WBHg.js";import"./I18nProvider-CF59bDP3.js";import"./useControlledState-DeUghDUN.js";import"./Label-xTQOkMYl.js";import"./useTextField-BtKb3rjA.js";import"./useField-BdW6ZByv.js";import"./useLabel-DMuCEq2v.js";import"./useFormReset-DWokUbV3.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
