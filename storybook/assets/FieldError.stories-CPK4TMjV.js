import{j as r,p as d}from"./iframe-a5iorYt_.js";import{$ as m}from"./Form-9OpxVQln.js";import{$ as a}from"./Input-CaBktYIq.js";import{$ as s}from"./TextField-C0MhGzXi.js";import{F as o}from"./FieldError-DTLXiL5V.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CKuAz2Wi.js";import"./useObjectRef-DomNprMl.js";import"./useFormValidation-S2CY6qm2.js";import"./useFocusRing-BW-GobYG.js";import"./useHover-D7-ycX7p.js";import"./Hidden-Bu-9bwhW.js";import"./FieldError-BwiCreHd.js";import"./Text-BzXkZD1r.js";import"./Autocomplete-C-CgF1zY.js";import"./keyboard-D4TVu98T.js";import"./getMetaValue-BDmRRgum.js";import"./useEvent-CWwVnFif.js";import"./useLabels-BoVBLTQ5.js";import"./useLocalizedStringFormatter-CEuruQsY.js";import"./I18nProvider-Cha0UYwj.js";import"./useControlledState-x1Vpl6eH.js";import"./Label-Orfe5toA.js";import"./useTextField-BDxLzRUI.js";import"./useField-DZ_E8vUK.js";import"./useLabel-Bgchr9R9.js";import"./useFormReset-CbHbRAHO.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
