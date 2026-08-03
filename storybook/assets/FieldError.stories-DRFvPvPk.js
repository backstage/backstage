import{bR as r,c7 as d}from"./iframe-BErNvpjr.js";import{a as m}from"./useFormValidation-CVK9l0hq.js";import{c as a}from"./Input-BVdpaGN9.js";import{$ as s}from"./TextField-BQLa5hdE.js";import{F as o}from"./FieldError-CMLOHIaR.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CkI-fiaI.js";import"./useObjectRef-BTVJqnIZ.js";import"./useFocusRing-DhH0pnm8.js";import"./openLink-VEX9Ze2_.js";import"./useHover-n_zdByGl.js";import"./Hidden-BXpNp4mY.js";import"./FieldError-B0J3oIAj.js";import"./Text-m3plxjD3.js";import"./Autocomplete-wiZIjKv7.js";import"./keyboard-ZpJRXcMx.js";import"./useEvent-lGzlaYoH.js";import"./useLabels-BfB1Y_Ok.js";import"./useLocalizedStringFormatter-zvzfXQUD.js";import"./I18nProvider-Co2RDX0c.js";import"./useControlledState-DHvityQM.js";import"./Label-CdvKSS9p.js";import"./useTextField-D2kqKQ27.js";import"./useField-DXkN9cJL.js";import"./useLabel-0LCDbxSL.js";import"./useFormReset-1WyntnJY.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
