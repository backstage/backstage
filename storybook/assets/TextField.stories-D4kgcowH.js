import{p as F,j as e}from"./iframe-M9O-K8SB.js";import{T as x}from"./TextField-_BK-nBF7.js";import{$ as h}from"./Form-BBJy9cFl.js";import{O as b,d as f}from"./index-BKJKY9Wv.js";import{F as y}from"./Flex-Bz2InqMs.js";import{F as D}from"./FieldLabel-Dm8Ex6MU.js";import"./preload-helper-PPVm8Dsz.js";import"./Input-MCe13Yrn.js";import"./useObjectRef-BPFp5snO.js";import"./clsx-B-dksMZM.js";import"./useFocusable-BwFERnd_.js";import"./useFormReset-DJISnqgL.js";import"./useControlledState-DzBnLbpE.js";import"./useField-BgIPqRrs.js";import"./useLabel-COjMvP6r.js";import"./useLabels-C3g0X61E.js";import"./utils-BXllfVt4.js";import"./Hidden-DTd05gNK.js";import"./useFocusRing-COnCKKka.js";import"./TextField-Dsmdajbm.js";import"./FieldError-BifbfugT.js";import"./Text-B7PuQZMK.js";import"./RSPContexts-BdpIjeVF.js";import"./Label-o9S_v-xF.js";import"./useStyles-BRwt6BXn.js";import"./FieldError-Dr6Rp0Rr.js";import"./useSurface-CJaN3YoD.js";const s=F.meta({title:"Backstage UI/TextField",component:x,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"}}}),r=s.story({args:{name:"url",placeholder:"Enter a URL",style:{maxWidth:"300px"}}}),n=s.story({args:{...r.input.args},render:i=>e.jsxs(y,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(x,{...i,size:"small",icon:e.jsx(b,{})}),e.jsx(x,{...i,size:"medium",icon:e.jsx(b,{})})]})}),o=s.story({args:{...r.input.args,defaultValue:"https://example.com"}}),t=s.story({args:{...r.input.args,label:"Label"}}),p=s.story({args:{...t.input.args,description:"Description"}}),u=s.story({args:{...t.input.args,isRequired:!0}}),c=s.story({args:{...r.input.args,isDisabled:!0}}),a=s.story({args:{...r.input.args},render:i=>e.jsx(x,{...i,placeholder:"Enter a URL",size:"small",icon:e.jsx(f,{})})}),d=a.extend({args:{isDisabled:!0}}),l=s.story({args:{...t.input.args},render:i=>e.jsx(h,{validationErrors:{url:"Invalid URL"},children:e.jsx(x,{...i})})}),m=s.story({args:{...t.input.args,validate:i=>i==="admin"?"Nice try!":null}}),g=s.story({render:()=>e.jsxs(e.Fragment,{children:[e.jsx(D,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(x,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const Default = () => (
  <TextField
    name="url"
    placeholder="Enter a URL"
    style={{
      maxWidth: "300px",
    }}
  />
);
`,...r.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{code:`const Sizes = () => (
  <Flex direction="row" gap="4" style={{ width: "100%", maxWidth: "600px" }}>
    <TextField size="small" icon={<RiSparklingLine />} />
    <TextField size="medium" icon={<RiSparklingLine />} />
  </Flex>
);
`,...n.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{code:`const DefaultValue = () => <TextField defaultValue="https://example.com" />;
`,...o.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{code:`const WithLabel = () => <TextField label="Label" />;
`,...t.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{code:`const WithDescription = () => <TextField description="Description" />;
`,...p.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{code:`const Required = () => <TextField isRequired />;
`,...u.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{code:`const Disabled = () => <TextField isDisabled />;
`,...c.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{code:`const WithIcon = () => (
  <TextField placeholder="Enter a URL" size="small" icon={<RiEyeLine />} />
);
`,...a.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{code:`const DisabledWithIcon = () => <TextField isDisabled />;
`,...d.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{code:`const ShowError = () => (
  <Form validationErrors={{ url: "Invalid URL" }}>
    <TextField />
  </Form>
);
`,...l.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{code:`const Validation = () => (
  <TextField validate={(value) => (value === "admin" ? "Nice try!" : null)} />
);
`,...m.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{code:`const CustomField = () => (
  <>
    <FieldLabel
      htmlFor="custom-field"
      id="custom-field-label"
      label="Custom Field"
    />
    <TextField
      id="custom-field"
      aria-labelledby="custom-field-label"
      name="custom-field"
      defaultValue="Custom Field"
    />
  </>
);
`,...g.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    name: 'url',
    placeholder: 'Enter a URL',
    style: {
      maxWidth: '300px'
    }
  }
})`,...r.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...n.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    defaultValue: 'https://example.com'
  }
})`,...o.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    label: 'Label'
  }
})`,...t.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    description: 'Description'
  }
})`,...p.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    isRequired: true
  }
})`,...u.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true
  }
})`,...c.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <TextField {...args} placeholder="Enter a URL" size="small" icon={<RiEyeLine />} />
})`,...a.input.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`WithIcon.extend({
  args: {
    isDisabled: true
  }
})`,...d.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args
  },
  render: args => <Form validationErrors={{
    url: 'Invalid URL'
  }}>
      <TextField {...args} />
    </Form>
})`,...l.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    validate: value => value === 'admin' ? 'Nice try!' : null
  }
})`,...m.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <>
      <FieldLabel htmlFor="custom-field" id="custom-field-label" label="Custom Field" />
      <TextField id="custom-field" aria-labelledby="custom-field-label" name="custom-field" defaultValue="Custom Field" />
    </>
})`,...g.input.parameters?.docs?.source}}};const M=["Default","Sizes","DefaultValue","WithLabel","WithDescription","Required","Disabled","WithIcon","DisabledWithIcon","ShowError","Validation","CustomField"];export{g as CustomField,r as Default,o as DefaultValue,c as Disabled,d as DisabledWithIcon,u as Required,l as ShowError,n as Sizes,m as Validation,p as WithDescription,a as WithIcon,t as WithLabel,M as __namedExportsOrder};
