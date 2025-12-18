import{a3 as f,j as e}from"./iframe-BY8lR-L8.js";import{T as n}from"./TextField-kHgSqWZ2.js";import{$ as y}from"./Form-B7AsXGvr.js";import{O as b,c as h}from"./index-BNUW6RWV.js";import{F}from"./Flex-evfLyDkg.js";import{F as D}from"./FieldLabel-CFAagGUM.js";import"./preload-helper-PPVm8Dsz.js";import"./Input-Cwa4mYR8.js";import"./useFocusable-C9C81vz2.js";import"./useObjectRef-BqHG6lM5.js";import"./clsx-B-dksMZM.js";import"./useFormReset-SyrVROTP.js";import"./useControlledState--yapVw-x.js";import"./Text-BKaXOxx7.js";import"./useLabel-C6JDtQl3.js";import"./useLabels-BYtztTEe.js";import"./utils-Bfoe0K7S.js";import"./Hidden-BOGSyjem.js";import"./useFocusRing-BEbWKVlK.js";import"./TextField-DbAvWVb8.js";import"./FieldError-j_Sj5TL2.js";import"./RSPContexts-CKOFLTkU.js";import"./Label-g_-FIzgL.js";import"./useStyles-DPxfsz7Y.js";import"./FieldError-RReYZ_oD.js";const r=f.meta({title:"Backstage UI/TextField",component:n,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"}}}),t=r.story({args:{name:"url",placeholder:"Enter a URL",style:{maxWidth:"300px"}}}),o=r.story({args:{...t.input.args},render:a=>e.jsxs(F,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(n,{...a,size:"small",icon:e.jsx(b,{})}),e.jsx(n,{...a,size:"medium",icon:e.jsx(b,{})})]})}),p=r.story({args:{...t.input.args,defaultValue:"https://example.com"}}),s=r.story({args:{...t.input.args,label:"Label"}}),u=r.story({args:{...s.input.args,description:"Description"}}),l=r.story({args:{...s.input.args,isRequired:!0}}),m=r.story({args:{...t.input.args,isDisabled:!0}}),i=r.story({args:{...t.input.args},render:a=>e.jsx(n,{...a,placeholder:"Enter a URL",size:"small",icon:e.jsx(h,{})})}),c=r.story({args:{...i.input.args,isDisabled:!0},render:i.input.render}),d=r.story({args:{...s.input.args},render:a=>e.jsx(y,{validationErrors:{url:"Invalid URL"},children:e.jsx(n,{...a})})}),g=r.story({args:{...s.input.args,validate:a=>a==="admin"?"Nice try!":null}}),x=r.story({render:()=>e.jsxs(e.Fragment,{children:[e.jsx(D,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(n,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    name: 'url',
    placeholder: 'Enter a URL',
    style: {
      maxWidth: '300px'
    }
  }
})`,...t.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <Flex direction="row" gap="4" style={{
    width: '100%',
    maxWidth: '600px'
  }}>
      <TextField {...args} size="small" icon={<RiSparklingLine />} />
      <TextField {...args} size="medium" icon={<RiSparklingLine />} />
    </Flex>
})`,...o.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    defaultValue: 'https://example.com'
  }
})`,...p.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    label: 'Label'
  }
})`,...s.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    description: 'Description'
  }
})`,...u.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    isRequired: true
  }
})`,...l.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true
  }
})`,...m.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <TextField {...args} placeholder="Enter a URL" size="small" icon={<RiEyeLine />} />
})`,...i.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithIcon.input.args,
    isDisabled: true
  },
  render: WithIcon.input.render
})`,...c.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args
  },
  render: args => <Form validationErrors={{
    url: 'Invalid URL'
  }}>
      <TextField {...args} />
    </Form>
})`,...d.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    validate: value => value === 'admin' ? 'Nice try!' : null
  }
})`,...g.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <>
      <FieldLabel htmlFor="custom-field" id="custom-field-label" label="Custom Field" />
      <TextField id="custom-field" aria-labelledby="custom-field-label" name="custom-field" defaultValue="Custom Field" />
    </>
})`,...x.input.parameters?.docs?.source}}};const J=["Default","Sizes","DefaultValue","WithLabel","WithDescription","Required","Disabled","WithIcon","DisabledWithIcon","ShowError","Validation","CustomField"];export{x as CustomField,t as Default,p as DefaultValue,m as Disabled,c as DisabledWithIcon,l as Required,d as ShowError,o as Sizes,g as Validation,u as WithDescription,i as WithIcon,s as WithLabel,J as __namedExportsOrder};
