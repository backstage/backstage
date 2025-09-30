import{j as e}from"./iframe-Bqhsa6Sh.js";import{S as a,H as z}from"./SearchField-CmDOJ5Kt.js";import{$ as I}from"./FieldError-B5ivLjaD.js";import{I as L,f as i}from"./provider-BRTIyZ3q.js";import{F as f}from"./Flex-BIcZN3CS.js";import{F as R}from"./FieldLabel-PX9dGVMg.js";import{B as n}from"./ButtonIcon-DAQ5jTSp.js";import{B as y}from"./Button-C0Q1ACNm.js";import{M as v}from"./index-C3od-xDV.js";import"./preload-helper-D9Z9MdNV.js";import"./Link-pW9gniRb.js";import"./utils-BDT67Vbq.js";import"./clsx-B-dksMZM.js";import"./useFocusRing-D-aLorso.js";import"./usePress-Brbl0uE0.js";import"./useStyles-BDeEhgv3.js";import"./Text-B1t1Wcep.js";import"./Tabs-BQ7TlFKd.js";import"./Collection-D62uSxMW.js";import"./Hidden-DF4y3CDj.js";import"./FocusScope--6MtoRgM.js";import"./context-C2tCQ_gy.js";import"./useControlledState-CLnhEdlw.js";import"./useLabels-BLMkIgq1.js";import"./Button-BveOVARF.js";import"./Input-DyCHJENO.js";import"./useFormReset-ClaPug4P.js";import"./SearchField-Bub_2W5t.js";import"./Label-cEl6zfye.js";import"./spacing.props-m9PQeFPu.js";const ne={title:"Backstage UI/SearchField",component:a,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"},placeholder:{control:"text"}}},s={args:{name:"url",style:{maxWidth:"300px"},"aria-label":"Search"}},c={args:{...s.args},render:r=>e.jsxs(f,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(a,{...r,size:"small"}),e.jsx(a,{...r,size:"medium"})]})},d={args:{...s.args,defaultValue:"https://example.com"}},t={args:{...s.args,label:"Label"}},m={args:{...t.args,description:"Description"}},u={args:{...t.args,isRequired:!0}},p={args:{...s.args,isDisabled:!0}},l={args:{...s.args},render:r=>e.jsx(a,{...r,placeholder:"Enter a URL",size:"small",icon:e.jsx(L,{name:"eye"})})},g={args:{...l.args,isDisabled:!0}},h={args:{...t.args},render:r=>e.jsx(I,{validationErrors:{url:"Invalid URL"},children:e.jsx(a,{...r})})},x={args:{...t.args,validate:r=>r==="admin"?"Nice try!":null}},b={render:()=>e.jsxs(e.Fragment,{children:[e.jsx(R,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(a,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})},o={args:{...s.args,startCollapsed:!0},render:r=>e.jsxs(f,{direction:"row",gap:"4",children:[e.jsx(a,{...r,size:"small"}),e.jsx(a,{...r,size:"medium"})]})},S={decorators:[r=>e.jsx(v,{children:e.jsx(r,{})})],render:r=>e.jsx(e.Fragment,{children:e.jsx(z,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(n,{"aria-label":"Cactus icon button",icon:e.jsx(i,{}),size:"small",variant:"secondary"}),e.jsx(a,{"aria-label":"Search",...r,size:"small"}),e.jsx(n,{"aria-label":"Cactus icon button",icon:e.jsx(i,{}),size:"small",variant:"secondary"})]})})})},j={args:{...o.args},decorators:[r=>e.jsx(v,{children:e.jsx(r,{})})],render:r=>e.jsx(e.Fragment,{children:e.jsx(z,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(n,{"aria-label":"Cactus icon button",icon:e.jsx(i,{}),size:"small",variant:"secondary"}),e.jsx(a,{...r,size:"small"}),e.jsx(n,{"aria-label":"Cactus icon button",icon:e.jsx(i,{}),size:"small",variant:"secondary"})]})})})},C={args:{...o.args},render:r=>e.jsxs(f,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(a,{...r,size:"small"}),e.jsx(n,{"aria-label":"Cactus icon button",icon:e.jsx(i,{}),size:"small",variant:"secondary"}),e.jsx(y,{size:"small",variant:"secondary",children:"Hello world"}),e.jsx(a,{...r,size:"medium"}),e.jsx(n,{"aria-label":"Cactus icon button",icon:e.jsx(i,{}),size:"medium",variant:"secondary"}),e.jsx(y,{size:"medium",variant:"secondary",children:"Hello world"})]})},F={args:{...o.args},render:r=>{const W=D=>{console.log("Search value:",D)};return e.jsx(f,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(a,{...r,onChange:W,size:"small"})})}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'url',
    style: {
      maxWidth: '300px'
    },
    'aria-label': 'Search'
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
}`,...g.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args
  },
  render: args => <Form validationErrors={{
    url: 'Invalid URL'
  }}>
      <SearchField {...args} />
    </Form>
}`,...h.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    validate: value => value === 'admin' ? 'Nice try!' : null
  }
}`,...x.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
            <SearchField aria-label="Search" {...args} size="small" />
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
}`,...j.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    ...StartCollapsed.args
  },
  render: args => {
    const handleChange = (value: string) => {
      console.log('Search value:', value);
    };
    return <Flex direction="row" gap="2" style={{
      width: '100%',
      maxWidth: '600px'
    }}>
        <SearchField {...args} onChange={handleChange} size="small" />
      </Flex>;
  }
}`,...F.parameters?.docs?.source}}};const le=["Default","Sizes","DefaultValue","WithLabel","WithDescription","Required","Disabled","WithIcon","DisabledWithIcon","ShowError","Validation","CustomField","StartCollapsed","InHeader","StartCollapsedInHeader","StartCollapsedWithButtons","StartCollapsedWithOnChange"];export{b as CustomField,s as Default,d as DefaultValue,p as Disabled,g as DisabledWithIcon,S as InHeader,u as Required,h as ShowError,c as Sizes,o as StartCollapsed,j as StartCollapsedInHeader,C as StartCollapsedWithButtons,F as StartCollapsedWithOnChange,x as Validation,m as WithDescription,l as WithIcon,t as WithLabel,le as __namedExportsOrder,ne as default};
