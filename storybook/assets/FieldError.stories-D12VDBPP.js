import{j as r,p as d}from"./iframe-bgo7e1e-.js";import{$ as m}from"./Form-3GgSwjy3.js";import{$ as a}from"./Input-UoES9vPn.js";import{$ as s}from"./TextField-LHDFqkml.js";import{F as o}from"./FieldError-FiS2FkPv.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-JzHJCY_V.js";import"./useObjectRef-CabhlhRH.js";import"./useFormValidation-DlvMgxhK.js";import"./useFocusRing-DOOJwv5m.js";import"./openLink-CoSKtbHP.js";import"./useHover-C9083PQk.js";import"./Hidden-DUW6jk9t.js";import"./FieldError-CMlcXu_V.js";import"./Text-DJaB50CO.js";import"./Autocomplete-CX9a_7R4.js";import"./keyboard-CofsTAMo.js";import"./getMetaValue-BiI45Giv.js";import"./useEvent-D0SamW91.js";import"./useLabels-Bim8pLbU.js";import"./useLocalizedStringFormatter-Ddoy7_EZ.js";import"./I18nProvider-8UDR-sqk.js";import"./useControlledState-D401CQPw.js";import"./Label-CxmmfCmf.js";import"./useTextField-CEqGEAML.js";import"./useField-B6TWCboz.js";import"./useLabel--gwqzVgP.js";import"./useFormReset-8GFVl-Zj.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
