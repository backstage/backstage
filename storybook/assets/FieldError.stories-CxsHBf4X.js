import{bR as r,c7 as d}from"./iframe-DEB_XKCy.js";import{a as m}from"./useFormValidation-CyDnBQXe.js";import{c as a}from"./Input-BCWvt78D.js";import{$ as s}from"./TextField-uhsUk8nx.js";import{F as o}from"./FieldError-DYOwJyYW.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CrlF93yQ.js";import"./useObjectRef-Ctp5tGlo.js";import"./useFocusRing-DOwaR7bd.js";import"./openLink-D4lCVjTw.js";import"./useHover-BBgMw-bK.js";import"./Hidden-Bcf80zYT.js";import"./FieldError-riGjFw4K.js";import"./Text-C3mE0SGj.js";import"./Autocomplete-DlCmDG_G.js";import"./keyboard-B5QxFQnB.js";import"./useEvent-DFdiJ6W_.js";import"./useLabels-BcoDEarN.js";import"./useLocalizedStringFormatter-BXfXtci2.js";import"./I18nProvider-BHXvn5NR.js";import"./useControlledState-CdUkXr5H.js";import"./Label-CunX4hTS.js";import"./useTextField-AejuSCEH.js";import"./useField-BccbeYM4.js";import"./useLabel-CTUJJsAz.js";import"./useFormReset-BChojrP9.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
