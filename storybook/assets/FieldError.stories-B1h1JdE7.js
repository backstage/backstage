import{j as r,p as d}from"./iframe-BkP0WlJq.js";import{$ as m}from"./useFormValidation-DdoBKiVP.js";import{$ as a}from"./Input-ByYqn8b2.js";import{$ as s}from"./TextField-uU_SiNBX.js";import{F as o}from"./FieldError-Bd5ieprW.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DHN8Cm_h.js";import"./useObjectRef-Mf4vhbTH.js";import"./useGlobalListeners-BQ7uMXZm.js";import"./openLink-DB0Ca1x8.js";import"./useHover-eAsT_Ppr.js";import"./Hidden-BXffHnFQ.js";import"./FieldError-CXhtOli2.js";import"./Text-DkMI-_Pd.js";import"./Autocomplete-J1lADh76.js";import"./keyboard-D1MAaepU.js";import"./useEvent-CwHxOE_a.js";import"./useLabels-B-zEBY3m.js";import"./useLocalizedStringFormatter-Cg_1Wz50.js";import"./I18nProvider-DmxvoEIH.js";import"./useControlledState-BVQM9Nh9.js";import"./Label-BK2ZKRuT.js";import"./useTextField-BzdYefQX.js";import"./useField-DMvdg4ts.js";import"./useLabel-5YOqhmr6.js";import"./useFormReset-C4fnlQFd.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
