import{j as r,p as d}from"./iframe-CxlUpTpq.js";import{$ as m}from"./useFormValidation-CsOIPDNg.js";import{$ as a}from"./Input-cUEZAZ1h.js";import{$ as s}from"./TextField-brCETjND.js";import{F as o}from"./FieldError-BqeaqOrJ.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BiH69BEF.js";import"./useObjectRef-Dh3jViZn.js";import"./useFocusRing-DKBxNAkp.js";import"./openLink-DT4-HiOA.js";import"./useHover-DMFi8o2f.js";import"./Hidden-f_G1o6Y7.js";import"./FieldError-CbBZt737.js";import"./Text-BTU8fM3z.js";import"./Autocomplete-DKAPF810.js";import"./keyboard-Cx6bvV3F.js";import"./useEvent-Duv0WJvN.js";import"./useLabels-ZAvHqBgR.js";import"./useLocalizedStringFormatter-CusjQb-x.js";import"./I18nProvider-g-YIgX08.js";import"./useControlledState-CxsccuSa.js";import"./Label-Ci2BW9le.js";import"./useTextField-BOI3orl0.js";import"./useField-Bu9yMuoU.js";import"./useLabel-DDDO_Y6W.js";import"./useFormReset-BXjwexTG.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
