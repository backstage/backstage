import{j as e}from"./jsx-runtime-hv06LKfz.js";import{S as s}from"./SearchField-CwHyjEdM.js";import{$ as j}from"./FieldError-1gSpcCTl.js";import{I as z,f as b}from"./provider-C6Ma5UVL.js";import{F as f}from"./Flex-C_LlPGvM.js";import{F as D}from"./FieldLabel-Bmb1Qquy.js";import{B as S}from"./ButtonIcon-Czjbh3pg.js";import{B as F}from"./Button-DuK7rGK8.js";import"./index-D8-PC79C.js";import"./Button-U0_f04OL.js";import"./utils-SVxEJA3c.js";import"./clsx-B-dksMZM.js";import"./Hidden-Bl3CD3Sw.js";import"./useFocusRing-CSBfGNH9.js";import"./usePress-BiO5y4q0.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./Input-DmMKXuNi.js";import"./useFormReset-JKupIHyW.js";import"./useControlledState-hFzvQclK.js";import"./SearchField-5B6KmH8T.js";import"./Label-x6hg8m87.js";import"./context-C8UuisDZ.js";import"./useStyles-Dc-DqJ_c.js";import"./useLabels-CXdioV2U.js";import"./spacing.props-m9PQeFPu.js";const Q={title:"Backstage UI/SearchField",component:s,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"},placeholder:{control:"text"}}},a={args:{name:"url",style:{maxWidth:"300px"}}},l={args:{...a.args},render:r=>e.jsxs(f,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(s,{...r,size:"small"}),e.jsx(s,{...r,size:"medium"})]})},n={args:{...a.args,defaultValue:"https://example.com"}},o={args:{...a.args,label:"Label"}},c={args:{...o.args,description:"Description"}},d={args:{...o.args,isRequired:!0}},m={args:{...a.args,isDisabled:!0}},t={args:{...a.args},render:r=>e.jsx(s,{...r,placeholder:"Enter a URL",size:"small",icon:e.jsx(z,{name:"eye"})})},u={args:{...t.args,isDisabled:!0}},p={args:{...o.args},render:r=>e.jsx(j,{validationErrors:{url:"Invalid URL"},children:e.jsx(s,{...r})})},g={args:{...o.args,validate:r=>r==="admin"?"Nice try!":null}},h={render:()=>e.jsxs(e.Fragment,{children:[e.jsx(D,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(s,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})},i={args:{...a.args,startCollapsed:!0},render:r=>e.jsxs(f,{direction:"row",gap:"4",children:[e.jsx(s,{...r,size:"small"}),e.jsx(s,{...r,size:"medium"})]})},x={args:{...i.args},render:r=>e.jsxs(f,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(s,{...r,size:"small"}),e.jsx(S,{icon:e.jsx(b,{}),size:"small",variant:"secondary"}),e.jsx(F,{size:"small",variant:"secondary",children:"Hello world"}),e.jsx(s,{...r,size:"medium"}),e.jsx(S,{icon:e.jsx(b,{}),size:"medium",variant:"secondary"}),e.jsx(F,{size:"medium",variant:"secondary",children:"Hello world"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'url',
    style: {
      maxWidth: '300px'
    }
  }
}`,...a.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: args => <Flex direction="row" gap="4" style={{
    width: '100%',
    maxWidth: '600px'
  }}>
      <SearchField {...args} size="small" />
      <SearchField {...args} size="medium" />
    </Flex>
}`,...l.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    defaultValue: 'https://example.com'
  }
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    label: 'Label'
  }
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    description: 'Description'
  }
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    isRequired: true
  }
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    isDisabled: true
  }
}`,...m.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: args => <SearchField {...args} placeholder="Enter a URL" size="small" icon={<Icon name="eye" />} />
}`,...t.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithIcon.args,
    isDisabled: true
  }
}`,...u.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args
  },
  render: args => <Form validationErrors={{
    url: 'Invalid URL'
  }}>
      <SearchField {...args} />
    </Form>
}`,...p.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    validate: value => value === 'admin' ? 'Nice try!' : null
  }
}`,...g.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <>
      <FieldLabel htmlFor="custom-field" id="custom-field-label" label="Custom Field" />
      <SearchField id="custom-field" aria-labelledby="custom-field-label" name="custom-field" defaultValue="Custom Field" />
    </>
}`,...h.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    startCollapsed: true
  },
  render: args => <Flex direction="row" gap="4">
      <SearchField {...args} size="small" />
      <SearchField {...args} size="medium" />
    </Flex>
}`,...i.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    ...StartCollapsed.args
  },
  render: args => <Flex direction="row" gap="2" style={{
    width: '100%',
    maxWidth: '600px'
  }}>
      <SearchField {...args} size="small" />
      <ButtonIcon icon={<RiCactusLine />} size="small" variant="secondary" />
      <Button size="small" variant="secondary">
        Hello world
      </Button>
      <SearchField {...args} size="medium" />
      <ButtonIcon icon={<RiCactusLine />} size="medium" variant="secondary" />
      <Button size="medium" variant="secondary">
        Hello world
      </Button>
    </Flex>
}`,...x.parameters?.docs?.source}}};const X=["Default","Sizes","DefaultValue","WithLabel","WithDescription","Required","Disabled","WithIcon","DisabledWithIcon","ShowError","Validation","CustomField","StartCollapsed","StartCollapsedWithButtons"];export{h as CustomField,a as Default,n as DefaultValue,m as Disabled,u as DisabledWithIcon,d as Required,p as ShowError,l as Sizes,i as StartCollapsed,x as StartCollapsedWithButtons,g as Validation,c as WithDescription,t as WithIcon,o as WithLabel,X as __namedExportsOrder,Q as default};
