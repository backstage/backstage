import{j as r,p as d}from"./iframe-BIybnMXI.js";import{$ as m}from"./Form-BtbuUqgK.js";import{$ as a}from"./Input-DW6Ftfr4.js";import{$ as s}from"./TextField-DDukL27B.js";import{F as o}from"./FieldError-Cpue-Cqu.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BNWuCLNS.js";import"./useObjectRef-CbQSD8dp.js";import"./useFormValidation-CvU55wbv.js";import"./useFocusRing-14fD-rIq.js";import"./openLink-_nIoHyS5.js";import"./useHover-S-WcK3-g.js";import"./Hidden-CFw0S2EP.js";import"./FieldError-BHpvYtcE.js";import"./Text-BmQ5Jf8N.js";import"./Autocomplete-Dq4_Bll7.js";import"./keyboard-QYh7qiEd.js";import"./getMetaValue-BRyplxPo.js";import"./useEvent-DIefrTiE.js";import"./useLabels-BYUTWxfw.js";import"./useLocalizedStringFormatter-DqXT6BB6.js";import"./I18nProvider-CQNLYzfm.js";import"./useControlledState-CPQ03ATl.js";import"./Label-DU9qK1mL.js";import"./useTextField-DTDPL3Jy.js";import"./useField-Di3KpqBE.js";import"./useLabel-DOK2Qr8p.js";import"./useFormReset-DCi4NeAi.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
