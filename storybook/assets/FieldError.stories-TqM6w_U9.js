import{bR as r,c7 as d}from"./iframe-CMKJKLUT.js";import{a as m}from"./useFormValidation-B_x2cwZk.js";import{c as a}from"./Input-D5Dwk_-N.js";import{$ as s}from"./TextField-DbyJ0qNS.js";import{F as o}from"./FieldError-xhX5biKf.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CvvRR5aT.js";import"./useObjectRef-BuVj0MY8.js";import"./useFocusRing-BsrOlbwX.js";import"./openLink-CuYP7gPT.js";import"./useHover-b_v_F8vi.js";import"./Hidden-yy8u865W.js";import"./FieldError-CCF7VJYp.js";import"./Text-EDMS0XYX.js";import"./Autocomplete-CmhvEYa5.js";import"./keyboard-C7TJsoqE.js";import"./useEvent-CYmdv-XJ.js";import"./useLabels-s9NhyS06.js";import"./useLocalizedStringFormatter-DjHS54sp.js";import"./I18nProvider-DNttPEDV.js";import"./useControlledState-v_oGfpQe.js";import"./Label-CdTMbHUG.js";import"./useTextField-BCVN-mBu.js";import"./useField-DLP5oS0R.js";import"./useLabel-DYjQeQ13.js";import"./useFormReset-DrwEtMky.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
