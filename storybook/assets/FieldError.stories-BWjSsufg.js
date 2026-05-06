import{j as r,p as d}from"./iframe-CwGYDpYH.js";import{$ as m}from"./useFormValidation-DBKMYoZ7.js";import{$ as a}from"./Input-o-KIrBdv.js";import{$ as s}from"./TextField-BtqCyIZU.js";import{F as o}from"./FieldError-Bg8SOMos.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-Cp-Yx8Dx.js";import"./useObjectRef-BLdCmDNN.js";import"./useFocusRing-CsY8JheF.js";import"./openLink-Ds4I99G_.js";import"./useHover-Be8TzpC8.js";import"./Hidden-BIN5-_pJ.js";import"./FieldError-CECOOI2C.js";import"./Text-DBUj1pnT.js";import"./Autocomplete-BrgDjI-e.js";import"./keyboard-DLLhyonf.js";import"./useEvent-DYwbjjw0.js";import"./useLabels-CfNqgJqs.js";import"./useLocalizedStringFormatter-DMuSLF1w.js";import"./I18nProvider-SX5Amjdy.js";import"./useControlledState-Cn52zD0h.js";import"./Label-VngP_PCJ.js";import"./useTextField-DoWt_bQy.js";import"./useField-QJgOwdZz.js";import"./useLabel-4uvRVmKe.js";import"./useFormReset-DmlFrmJI.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
