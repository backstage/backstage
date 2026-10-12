import{j as r,p as d}from"./iframe-D5t0zV2Z.js";import{$ as m}from"./Form-RnyeY1Wv.js";import{$ as a}from"./Input-B8KQxdZr.js";import{$ as s}from"./TextField-BAG-f8EB.js";import{F as o}from"./FieldError-DH87wofE.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-C39--9xx.js";import"./useObjectRef-kGsiECgS.js";import"./useFormValidation-DF0-wOxW.js";import"./useFocusRing-vtWZMyzl.js";import"./openLink-DJ_oJLh5.js";import"./useHover-CMgWw-jG.js";import"./Hidden-Dsa08sWj.js";import"./FieldError-BufNcm74.js";import"./Text--erJL1eo.js";import"./Autocomplete-C2BxSGXK.js";import"./keyboard-vsvxufhh.js";import"./getMetaValue-lPtVOvv4.js";import"./useEvent-Ky4nwph9.js";import"./useLabels-D8GfqFut.js";import"./useLocalizedStringFormatter-Dq7SKV2-.js";import"./I18nProvider-CnCaeKRg.js";import"./useControlledState-CWsOmoBN.js";import"./Label-DaItaSZn.js";import"./useTextField-BqFVkvRL.js";import"./useField-B9NwoH1a.js";import"./useLabel-32i4SIb0.js";import"./useFormReset-B281acCK.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
