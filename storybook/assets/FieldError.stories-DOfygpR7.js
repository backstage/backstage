import{j as r,p as d}from"./iframe-VdnJkTLn.js";import{$ as m}from"./Form-CzyO95mO.js";import{$ as a}from"./Input-D2uS1ljc.js";import{$ as s}from"./TextField-BXXDP7wE.js";import{F as o}from"./FieldError-0qd6BDyW.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-e0WViHPf.js";import"./useObjectRef-DROp5jky.js";import"./useFormValidation-DfF2vLy2.js";import"./useFocusRing-Co2F4F7Z.js";import"./openLink-CXHSNm_V.js";import"./useHover-g0RbdZFi.js";import"./Hidden-CrjggcFY.js";import"./FieldError-B3u2kknD.js";import"./Text-7WPcyscW.js";import"./Autocomplete-u1URa5fd.js";import"./keyboard-4UFf3oj2.js";import"./getMetaValue-Bnreontc.js";import"./useEvent-Bizq2OSF.js";import"./useLabels-BVBXvlsz.js";import"./useLocalizedStringFormatter-CHFqquPO.js";import"./I18nProvider-DuHW1abH.js";import"./useControlledState-BaeUY-xI.js";import"./Label-DrU_Nnv8.js";import"./useTextField-BekYY1fq.js";import"./useField-CsdjVyDw.js";import"./useLabel-Bo0JsgFk.js";import"./useFormReset-B9eW7vtg.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
