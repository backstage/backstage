import{bR as e,i as l,w as T,ca as E,c7 as N}from"./iframe-Bfeun6FV.js";import{S as t}from"./SearchField-BIyqMjll.js";import{a as P}from"./useFormValidation-BCBDK8Qf.js";import{e as c,U as A}from"./index-CVNQhIDx.js";import{F as s}from"./Flex-BPeu8iFE.js";import{T as L}from"./Text-Cgoj6p6V.js";import{F as q}from"./FieldLabel-DhcYpfqa.js";import{P as U}from"./PluginHeader-CkWQTk-6.js";import{B as u}from"./ButtonIcon-Dk4ShQ2Z.js";import{B as H}from"./BUIProvider-B3JZ5_CR.js";import{B as V}from"./Button-Ub9l0lJ4.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-CXBJEZu8.js";import"./utils-C1fACjU5.js";import"./useObjectRef-DpvjfcTN.js";import"./Label-CMwfur8h.js";import"./Hidden-sFV-2aQN.js";import"./useFocusRing-D2D9w2h7.js";import"./openLink-Z9FeXa0N.js";import"./useLabel-fE5WpueX.js";import"./useLabels-ClA9bczX.js";import"./number-3AeMSo45.js";import"./I18nProvider-TylybwwN.js";import"./useButton-35EaW1qC.js";import"./usePress-TbacPce5.js";import"./textSelection-DZyb17vv.js";import"./useHover-Bl99Bvws.js";import"./Input-D48E8LcP.js";import"./SearchField-CBhic2oo.js";import"./FieldError-BWjgqGMr.js";import"./Text-DOL3ix9A.js";import"./Autocomplete-DZ5iwN9X.js";import"./keyboard-BTOl7xVT.js";import"./useEvent-vC-ysoRO.js";import"./useLocalizedStringFormatter-D_4gFDnf.js";import"./useControlledState-CC8JDBnw.js";import"./useTextField-h-cI21RN.js";import"./useField-BxvGjrCe.js";import"./useFormReset-DCGdCl6y.js";import"./FieldError-DsJ-fXjs.js";import"./useCollection-DeX7otQ8.js";import"./FocusScope-Bv6PArKX.js";import"./Link-C6OtGdpE.js";import"./useLink-aS6vWmzD.js";import"./Menu-DEicnal5.js";import"./getItemCount-C_eYKaFf.js";import"./ListBox-D-ejC2JJ.js";import"./useListState-EmLhgg1p.js";import"./Dialog-CRthzS2b.js";import"./Heading-BcnG0VjG.js";import"./useOverlayTriggerState-DF5r881j.js";import"./VisuallyHidden-CtLKqaVY.js";import"./animation-DPrX5Bmr.js";import"./Virtualizer-D0G2ErKL.js";import"./useFilter-MUPmUk7G.js";import"./getNodeText-CEzbLUrP.js";import"./Link-DpJxa_fz.js";import"./useResolvedHref-C1ukixa2.js";import"./Tooltip-BAHNPtWJ.js";import"./VisuallyHidden-CObAhBM3.js";import"./Tabs-D9ynpCun.js";import"./useHasTabbableChild-CC7bVvAe.js";const a=N.meta({title:"Backstage UI/SearchField",component:t,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"},placeholder:{control:"text"}}}),i=a.story({args:{name:"url",style:{maxWidth:"300px"},"aria-label":"Search"}}),g=a.story({args:{...i.input.args},render:r=>e.jsxs(s,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(t,{...r,size:"small"}),e.jsx(t,{...r,size:"medium"})]})}),x=a.story({args:{...i.input.args,defaultValue:"https://example.com"}}),o=a.story({args:{...i.input.args,label:"Label"}}),h=a.story({args:{...o.input.args,description:"Description"}}),y=a.story({args:{...o.input.args,isRequired:!0}}),S=a.story({args:{...i.input.args,isDisabled:!0}}),m=a.story({args:{...i.input.args},render:r=>e.jsx(t,{...r,placeholder:"Enter a URL",size:"small",icon:e.jsx(A,{})})}),b=a.story({args:{...m.input.args,isDisabled:!0}}),j=a.story({args:{...o.input.args},render:r=>e.jsx(P,{validationErrors:{url:"Invalid URL"},children:e.jsx(t,{...r})})}),F=a.story({args:{...o.input.args,validate:r=>r==="admin"?"Nice try!":null}}),C=a.story({render:()=>e.jsxs(e.Fragment,{children:[e.jsx(q,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(t,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})}),n=a.story({args:{...i.input.args,startCollapsed:!0},render:r=>e.jsxs(s,{direction:"column",gap:"4",children:[e.jsxs(s,{direction:"row",gap:"4",children:[e.jsx(t,{...r,size:"small"}),e.jsx(t,{...r,size:"medium"})]}),e.jsx(t,{...r,size:"small"})]})}),z=a.story({args:{...n.input.args,defaultValue:"https://example.com"},render:r=>e.jsx(t,{...r,size:"small"})}),v=a.story({decorators:[r=>e.jsx(T,{children:e.jsx(H,{children:e.jsx(r,{})})})],render:r=>e.jsx(e.Fragment,{children:e.jsx(U,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(u,{"aria-label":"Cactus icon button",icon:e.jsx(c,{}),size:"small",variant:"secondary"}),e.jsx(t,{"aria-label":"Search",...r,size:"small"}),e.jsx(u,{"aria-label":"Cactus icon button",icon:e.jsx(c,{}),size:"small",variant:"secondary"})]})})})}),f=a.story({args:{...n.input.args},decorators:[r=>e.jsx(T,{children:e.jsx(H,{children:e.jsx(r,{})})})],render:r=>e.jsx(e.Fragment,{children:e.jsx(U,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(u,{"aria-label":"Cactus icon button",icon:e.jsx(c,{}),size:"small",variant:"secondary"}),e.jsx(t,{...r,size:"small"}),e.jsx(u,{"aria-label":"Cactus icon button",icon:e.jsx(c,{}),size:"small",variant:"secondary"})]})})})}),W=a.story({args:{...n.input.args},render:r=>e.jsxs(s,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(t,{...r,size:"small"}),e.jsx(u,{"aria-label":"Cactus icon button",icon:e.jsx(c,{}),size:"small",variant:"secondary"}),e.jsx(V,{size:"small",variant:"secondary",children:"Hello world"}),e.jsx(t,{...r,size:"medium"}),e.jsx(u,{"aria-label":"Cactus icon button",icon:e.jsx(c,{}),size:"medium",variant:"secondary"}),e.jsx(V,{size:"medium",variant:"secondary",children:"Hello world"})]})}),B=a.story({args:{...n.input.args},render:r=>{const p=d=>{console.log("Search value:",d)};return e.jsx(s,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(t,{...r,onChange:p,size:"small"})})}}),w=a.story({args:{...n.input.args},render:function(p){const[d,D]=E.useState("");return e.jsx(s,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(t,{...p,size:"small",value:d,onChange:D})})}}),R=a.story({args:{...n.input.args},render:function(p){const[d,D]=E.useState("Component");return e.jsx(s,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(t,{...p,size:"small",value:d,onChange:D})})}}),I=a.story({render:()=>e.jsxs(s,{direction:"column",gap:"4",children:[e.jsx("div",{style:{maxWidth:"600px"},children:"SearchField automatically detects its parent bg context and increments the neutral level by 1. No prop is needed — it's fully automatic."}),e.jsxs(l,{bg:"neutral",p:"4",children:[e.jsx(L,{children:"Neutral 1 container"}),e.jsx(s,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(t,{"aria-label":"Search",size:"small"})})]}),e.jsx(l,{bg:"neutral",children:e.jsxs(l,{bg:"neutral",p:"4",children:[e.jsx(L,{children:"Neutral 2 container"}),e.jsx(s,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(t,{"aria-label":"Search",size:"small"})})]})}),e.jsx(l,{bg:"neutral",children:e.jsx(l,{bg:"neutral",children:e.jsxs(l,{bg:"neutral",p:"4",children:[e.jsx(L,{children:"Neutral 3 container"}),e.jsx(s,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(t,{"aria-label":"Search",size:"small"})})]})})})]})});i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    name: 'url',
    style: {
      maxWidth: '300px'
    },
    'aria-label': 'Search'
  }
})`,...i.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <Flex direction="row" gap="4" style={{
    width: '100%',
    maxWidth: '600px'
  }}>
      <SearchField {...args} size="small" />
      <SearchField {...args} size="medium" />
    </Flex>
})`,...g.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    defaultValue: 'https://example.com'
  }
})`,...x.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    label: 'Label'
  }
})`,...o.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    description: 'Description'
  }
})`,...h.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    isRequired: true
  }
})`,...y.input.parameters?.docs?.source}}};S.input.parameters={...S.input.parameters,docs:{...S.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true
  }
})`,...S.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <SearchField {...args} placeholder="Enter a URL" size="small" icon={<RiEBike2Line />} />
})`,...m.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithIcon.input.args,
    isDisabled: true
  }
})`,...b.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args
  },
  render: args => <Form validationErrors={{
    url: 'Invalid URL'
  }}>
      <SearchField {...args} />
    </Form>
})`,...j.input.parameters?.docs?.source}}};F.input.parameters={...F.input.parameters,docs:{...F.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    validate: value => value === 'admin' ? 'Nice try!' : null
  }
})`,...F.input.parameters?.docs?.source}}};C.input.parameters={...C.input.parameters,docs:{...C.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <>
      <FieldLabel htmlFor="custom-field" id="custom-field-label" label="Custom Field" />
      <SearchField id="custom-field" aria-labelledby="custom-field-label" name="custom-field" defaultValue="Custom Field" />
    </>
})`,...C.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    startCollapsed: true
  },
  render: args => <Flex direction="column" gap="4">
      <Flex direction="row" gap="4">
        <SearchField {...args} size="small" />
        <SearchField {...args} size="medium" />
      </Flex>
      <SearchField {...args} size="small" />
    </Flex>
})`,...n.input.parameters?.docs?.source}}};z.input.parameters={...z.input.parameters,docs:{...z.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...StartCollapsed.input.args,
    defaultValue: 'https://example.com'
  },
  render: args => <SearchField {...args} size="small" />
})`,...z.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [Story => <MemoryRouter>
        <BUIProvider>
          <Story />
        </BUIProvider>
      </MemoryRouter>],
  render: args => <>
      <PluginHeader title="Title" customActions={<>
            <ButtonIcon aria-label="Cactus icon button" icon={<RiCactusLine />} size="small" variant="secondary" />
            <SearchField aria-label="Search" {...args} size="small" />
            <ButtonIcon aria-label="Cactus icon button" icon={<RiCactusLine />} size="small" variant="secondary" />
          </>} />
    </>
})`,...v.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...StartCollapsed.input.args
  },
  decorators: [Story => <MemoryRouter>
        <BUIProvider>
          <Story />
        </BUIProvider>
      </MemoryRouter>],
  render: args => <>
      <PluginHeader title="Title" customActions={<>
            <ButtonIcon aria-label="Cactus icon button" icon={<RiCactusLine />} size="small" variant="secondary" />
            <SearchField {...args} size="small" />
            <ButtonIcon aria-label="Cactus icon button" icon={<RiCactusLine />} size="small" variant="secondary" />
          </>} />
    </>
})`,...f.input.parameters?.docs?.source}}};W.input.parameters={...W.input.parameters,docs:{...W.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...StartCollapsed.input.args
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
})`,...W.input.parameters?.docs?.source}}};B.input.parameters={...B.input.parameters,docs:{...B.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...StartCollapsed.input.args
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
})`,...B.input.parameters?.docs?.source}}};w.input.parameters={...w.input.parameters,docs:{...w.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...StartCollapsed.input.args
  },
  render: function Render(args) {
    const [value, setValue] = useState('');
    return <Flex direction="row" gap="2" style={{
      width: '100%',
      maxWidth: '600px'
    }}>
        <SearchField {...args} size="small" value={value} onChange={setValue} />
      </Flex>;
  }
})`,...w.input.parameters?.docs?.source}}};R.input.parameters={...R.input.parameters,docs:{...R.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...StartCollapsed.input.args
  },
  render: function Render(args) {
    const [value, setValue] = useState('Component');
    return <Flex direction="row" gap="2" style={{
      width: '100%',
      maxWidth: '600px'
    }}>
        <SearchField {...args} size="small" value={value} onChange={setValue} />
      </Flex>;
  }
})`,...R.input.parameters?.docs?.source}}};I.input.parameters={...I.input.parameters,docs:{...I.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <div style={{
      maxWidth: '600px'
    }}>
        SearchField automatically detects its parent bg context and increments
        the neutral level by 1. No prop is needed — it's fully automatic.
      </div>
      <Box bg="neutral" p="4">
        <Text>Neutral 1 container</Text>
        <Flex mt="2" style={{
        maxWidth: '300px'
      }}>
          <SearchField aria-label="Search" size="small" />
        </Flex>
      </Box>
      <Box bg="neutral">
        <Box bg="neutral" p="4">
          <Text>Neutral 2 container</Text>
          <Flex mt="2" style={{
          maxWidth: '300px'
        }}>
            <SearchField aria-label="Search" size="small" />
          </Flex>
        </Box>
      </Box>
      <Box bg="neutral">
        <Box bg="neutral">
          <Box bg="neutral" p="4">
            <Text>Neutral 3 container</Text>
            <Flex mt="2" style={{
            maxWidth: '300px'
          }}>
              <SearchField aria-label="Search" size="small" />
            </Flex>
          </Box>
        </Box>
      </Box>
    </Flex>
})`,...I.input.parameters?.docs?.source}}};const Qe=["Default","Sizes","DefaultValue","WithLabel","WithDescription","Required","Disabled","WithIcon","DisabledWithIcon","ShowError","Validation","CustomField","StartCollapsed","StartCollapsedWithValue","InHeader","StartCollapsedInHeader","StartCollapsedWithButtons","StartCollapsedWithOnChange","StartCollapsedControlledEmpty","StartCollapsedControlledWithValue","AutoBg"];export{I as AutoBg,C as CustomField,i as Default,x as DefaultValue,S as Disabled,b as DisabledWithIcon,v as InHeader,y as Required,j as ShowError,g as Sizes,n as StartCollapsed,w as StartCollapsedControlledEmpty,R as StartCollapsedControlledWithValue,f as StartCollapsedInHeader,W as StartCollapsedWithButtons,B as StartCollapsedWithOnChange,z as StartCollapsedWithValue,F as Validation,h as WithDescription,m as WithIcon,o as WithLabel,Qe as __namedExportsOrder};
