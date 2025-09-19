import{j as e}from"./iframe-hd6BgcQH.js";import{T as t}from"./TextField-DEXc-cpw.js";import{$ as b}from"./FieldError-BYYuSldw.js";import{I as x}from"./provider-BiXgmWxm.js";import{F as f}from"./Flex-gewXFhM7.js";import{F as h}from"./FieldLabel-D_9v6CaC.js";import"./preload-helper-D9Z9MdNV.js";import"./Input-DaqZ6lGB.js";import"./useFocusRing-DYu6-wAz.js";import"./utils-lSa6AnOl.js";import"./clsx-B-dksMZM.js";import"./useFormReset-CSASQwFs.js";import"./useControlledState-D6qSrXAF.js";import"./Hidden-BIZGIbFJ.js";import"./TextField-DjzocSk1.js";import"./Label-wKmcEZ58.js";import"./useStyles-B-Ra1ZQX.js";import"./useLabels-DMx9K91R.js";import"./spacing.props-m9PQeFPu.js";const $={title:"Backstage UI/TextField",component:t,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"}}},r={args:{name:"url",placeholder:"Enter a URL",style:{maxWidth:"300px"}}},i={args:{...r.args},render:a=>e.jsxs(f,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(t,{...a,size:"small",icon:e.jsx(x,{name:"sparkling"})}),e.jsx(t,{...a,size:"medium",icon:e.jsx(x,{name:"sparkling"})})]})},n={args:{...r.args,defaultValue:"https://example.com"}},s={args:{...r.args,label:"Label"}},l={args:{...s.args,description:"Description"}},c={args:{...s.args,isRequired:!0}},d={args:{...r.args,isDisabled:!0}},o={args:{...r.args},render:a=>e.jsx(t,{...a,placeholder:"Enter a URL",size:"small",icon:e.jsx(x,{name:"eye"})})},m={args:{...o.args,isDisabled:!0},render:o.render},p={args:{...s.args},render:a=>e.jsx(b,{validationErrors:{url:"Invalid URL"},children:e.jsx(t,{...a})})},u={args:{...s.args,validate:a=>a==="admin"?"Nice try!":null}},g={render:()=>e.jsxs(e.Fragment,{children:[e.jsx(h,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(t,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'url',
    placeholder: 'Enter a URL',
    style: {
      maxWidth: '300px'
    }
  }
}`,...r.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: args => <Flex direction="row" gap="4" style={{
    width: '100%',
    maxWidth: '600px'
  }}>
      <TextField {...args} size="small" icon={<Icon name="sparkling" />} />
      <TextField {...args} size="medium" icon={<Icon name="sparkling" />} />
    </Flex>
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    defaultValue: 'https://example.com'
  }
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    label: 'Label'
  }
}`,...s.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    description: 'Description'
  }
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    isRequired: true
  }
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    isDisabled: true
  }
}`,...d.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: args => <TextField {...args} placeholder="Enter a URL" size="small" icon={<Icon name="eye" />} />
}`,...o.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithIcon.args,
    isDisabled: true
  },
  render: WithIcon.render
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args
  },
  render: args => <Form validationErrors={{
    url: 'Invalid URL'
  }}>
      <TextField {...args} />
    </Form>
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    validate: value => value === 'admin' ? 'Nice try!' : null
  }
}`,...u.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <>
      <FieldLabel htmlFor="custom-field" id="custom-field-label" label="Custom Field" />
      <TextField id="custom-field" aria-labelledby="custom-field-label" name="custom-field" defaultValue="Custom Field" />
    </>
}`,...g.parameters?.docs?.source}}};const N=["Default","Sizes","DefaultValue","WithLabel","WithDescription","Required","Disabled","WithIcon","DisabledWithIcon","ShowError","Validation","CustomField"];export{g as CustomField,r as Default,n as DefaultValue,d as Disabled,m as DisabledWithIcon,c as Required,p as ShowError,i as Sizes,u as Validation,l as WithDescription,o as WithIcon,s as WithLabel,N as __namedExportsOrder,$ as default};
