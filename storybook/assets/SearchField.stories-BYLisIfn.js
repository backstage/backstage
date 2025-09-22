import{j as e}from"./iframe-hvh2aMf9.js";import{S as a,H as z}from"./SearchField-CCMqEFEu.js";import{$ as v}from"./FieldError-Dpa4RKTU.js";import{I as D,f as i}from"./provider-LAiWxmQL.js";import{F}from"./Flex-DRSIbmAk.js";import{F as I}from"./FieldLabel-BJvaNNPb.js";import{B as n}from"./ButtonIcon-BdVIegcB.js";import{B as y}from"./Button-Ba8Zo8kH.js";import{M as C}from"./index-7QU1_rFp.js";import"./preload-helper-D9Z9MdNV.js";import"./Link-DlFfUI4C.js";import"./utils-A5eb8iUx.js";import"./clsx-B-dksMZM.js";import"./useFocusRing-LjJUE2Ue.js";import"./usePress-85033q8V.js";import"./useStyles-BvFuW9vi.js";import"./Text-1jxKsdSh.js";import"./Tabs-DHqPk3hK.js";import"./Collection-CZVHZ0Qy.js";import"./Hidden-xm9ynEG8.js";import"./FocusScope-CUo4pWDv.js";import"./context-MrHafpZR.js";import"./useControlledState-BNG9s3zG.js";import"./useLabels-6Xd47CM-.js";import"./Button-D-c0dF0y.js";import"./Input-CBfCaqL-.js";import"./useFormReset-bEdoCdCL.js";import"./SearchField-0L4E6SW8.js";import"./Label-BGevpIdz.js";import"./spacing.props-m9PQeFPu.js";const te={title:"Backstage UI/SearchField",component:a,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"},placeholder:{control:"text"}}},s={args:{name:"url",style:{maxWidth:"300px"}}},c={args:{...s.args},render:r=>e.jsxs(F,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(a,{...r,size:"small"}),e.jsx(a,{...r,size:"medium"})]})},d={args:{...s.args,defaultValue:"https://example.com"}},t={args:{...s.args,label:"Label"}},m={args:{...t.args,description:"Description"}},u={args:{...t.args,isRequired:!0}},p={args:{...s.args,isDisabled:!0}},l={args:{...s.args},render:r=>e.jsx(a,{...r,placeholder:"Enter a URL",size:"small",icon:e.jsx(D,{name:"eye"})})},g={args:{...l.args,isDisabled:!0}},x={args:{...t.args},render:r=>e.jsx(v,{validationErrors:{url:"Invalid URL"},children:e.jsx(a,{...r})})},h={args:{...t.args,validate:r=>r==="admin"?"Nice try!":null}},b={render:()=>e.jsxs(e.Fragment,{children:[e.jsx(I,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(a,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})},o={args:{...s.args,startCollapsed:!0},render:r=>e.jsxs(F,{direction:"row",gap:"4",children:[e.jsx(a,{...r,size:"small"}),e.jsx(a,{...r,size:"medium"})]})},S={decorators:[r=>e.jsx(C,{children:e.jsx(r,{})})],render:r=>e.jsx(e.Fragment,{children:e.jsx(z,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(n,{"aria-label":"Cactus icon button",icon:e.jsx(i,{}),size:"small",variant:"secondary"}),e.jsx(a,{...r,size:"small"}),e.jsx(n,{"aria-label":"Cactus icon button",icon:e.jsx(i,{}),size:"small",variant:"secondary"})]})})})},j={args:{...o.args},decorators:[r=>e.jsx(C,{children:e.jsx(r,{})})],render:r=>e.jsx(e.Fragment,{children:e.jsx(z,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(n,{"aria-label":"Cactus icon button",icon:e.jsx(i,{}),size:"small",variant:"secondary"}),e.jsx(a,{...r,size:"small"}),e.jsx(n,{"aria-label":"Cactus icon button",icon:e.jsx(i,{}),size:"small",variant:"secondary"})]})})})},f={args:{...o.args},render:r=>e.jsxs(F,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(a,{...r,size:"small"}),e.jsx(n,{"aria-label":"Cactus icon button",icon:e.jsx(i,{}),size:"small",variant:"secondary"}),e.jsx(y,{size:"small",variant:"secondary",children:"Hello world"}),e.jsx(a,{...r,size:"medium"}),e.jsx(n,{"aria-label":"Cactus icon button",icon:e.jsx(i,{}),size:"medium",variant:"secondary"}),e.jsx(y,{size:"medium",variant:"secondary",children:"Hello world"})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'url',
    style: {
      maxWidth: '300px'
    }
  }
}`,...s.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    defaultValue: 'https://example.com'
  }
}`,...d.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    label: 'Label'
  }
}`,...t.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    description: 'Description'
  }
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    isRequired: true
  }
}`,...u.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    isDisabled: true
  }
}`,...p.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: args => <SearchField {...args} placeholder="Enter a URL" size="small" icon={<Icon name="eye" />} />
}`,...l.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithIcon.args,
    isDisabled: true
  }
}`,...g.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args
  },
  render: args => <Form validationErrors={{
    url: 'Invalid URL'
  }}>
      <SearchField {...args} />
    </Form>
}`,...x.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    validate: value => value === 'admin' ? 'Nice try!' : null
  }
}`,...h.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <>
      <FieldLabel htmlFor="custom-field" id="custom-field-label" label="Custom Field" />
      <SearchField id="custom-field" aria-labelledby="custom-field-label" name="custom-field" defaultValue="Custom Field" />
    </>
}`,...b.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    startCollapsed: true
  },
  render: args => <Flex direction="row" gap="4">
      <SearchField {...args} size="small" />
      <SearchField {...args} size="medium" />
    </Flex>
}`,...o.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <MemoryRouter>
        <Story />
      </MemoryRouter>],
  render: args => <>
      <Header title="Title" customActions={<>
            <ButtonIcon aria-label="Cactus icon button" icon={<RiCactusLine />} size="small" variant="secondary" />
            <SearchField {...args} size="small" />
            <ButtonIcon aria-label="Cactus icon button" icon={<RiCactusLine />} size="small" variant="secondary" />
          </>} />
    </>
}`,...S.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    ...StartCollapsed.args
  },
  decorators: [Story => <MemoryRouter>
        <Story />
      </MemoryRouter>],
  render: args => <>
      <Header title="Title" customActions={<>
            <ButtonIcon aria-label="Cactus icon button" icon={<RiCactusLine />} size="small" variant="secondary" />
            <SearchField {...args} size="small" />
            <ButtonIcon aria-label="Cactus icon button" icon={<RiCactusLine />} size="small" variant="secondary" />
          </>} />
    </>
}`,...j.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    ...StartCollapsed.args
  },
  render: args => <Flex direction="row" gap="2" style={{
    width: '100%',
    maxWidth: '600px'
  }}>
      <SearchField {...args} size="small" />
      <ButtonIcon aria-label="Cactus icon button" icon={<RiCactusLine />} size="small" variant="secondary" />
      <Button size="small" variant="secondary">
        Hello world
      </Button>
      <SearchField {...args} size="medium" />
      <ButtonIcon aria-label="Cactus icon button" icon={<RiCactusLine />} size="medium" variant="secondary" />
      <Button size="medium" variant="secondary">
        Hello world
      </Button>
    </Flex>
}`,...f.parameters?.docs?.source}}};const oe=["Default","Sizes","DefaultValue","WithLabel","WithDescription","Required","Disabled","WithIcon","DisabledWithIcon","ShowError","Validation","CustomField","StartCollapsed","InHeader","StartCollapsedInHeader","StartCollapsedWithButtons"];export{b as CustomField,s as Default,d as DefaultValue,p as Disabled,g as DisabledWithIcon,S as InHeader,u as Required,x as ShowError,c as Sizes,o as StartCollapsed,j as StartCollapsedInHeader,f as StartCollapsedWithButtons,h as Validation,m as WithDescription,l as WithIcon,t as WithLabel,oe as __namedExportsOrder,te as default};
