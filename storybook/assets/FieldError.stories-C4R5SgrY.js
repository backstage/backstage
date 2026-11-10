import{j as r,p as d}from"./iframe-DxBRWUiK.js";import{$ as m}from"./Form-CqE-IOxT.js";import{$ as a}from"./Input-vC6TU_h8.js";import{$ as s}from"./TextField-CwHfVAvJ.js";import{F as o}from"./FieldError-CYXXKCAS.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-Cv-9sHfj.js";import"./useObjectRef-VkTcKCoy.js";import"./useFormValidation-CppbXsgq.js";import"./useFocusRing-BqPZGEXT.js";import"./openLink-a1B1hwMM.js";import"./useHover-Cr5thQm_.js";import"./Hidden-BdHYJNpU.js";import"./FieldError-BdSj5mJC.js";import"./Text-B4ka2W6z.js";import"./Autocomplete-Cuv0f5M3.js";import"./keyboard-OKXMLejU.js";import"./getMetaValue-CUMJm42D.js";import"./useEvent-CbVpGXN4.js";import"./useLabels-DXt0FSFN.js";import"./useLocalizedStringFormatter-DVlYVXvg.js";import"./I18nProvider-C0Z_fwek.js";import"./useControlledState-bDAdDYhT.js";import"./Label-DB2E6Ibv.js";import"./useTextField-CRwhSld1.js";import"./useField-J-UNgQo7.js";import"./useLabel-DFfcinVE.js";import"./useFormReset-DZizIjt8.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
