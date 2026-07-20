import{bR as e,i as l,w as T,ca as E,c7 as N}from"./iframe-e_Pbc_6f.js";import{S as t}from"./SearchField-BJTSW2DR.js";import{a as P}from"./useFormValidation-Dq2pDWRi.js";import{e as c,U as A}from"./index-D1GUm7TG.js";import{F as s}from"./Flex-DQK7M4jB.js";import{T as L}from"./Text-uEMQqrD_.js";import{F as q}from"./FieldLabel-B1Pe9T9M.js";import{P as U}from"./PluginHeader-Dheqh1k7.js";import{B as u}from"./ButtonIcon-8ef_tIDz.js";import{B as H}from"./BUIProvider-YvBoGo4d.js";import{B as V}from"./Button-BpepNnyF.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-D1InRcXf.js";import"./utils-DxA9yzz1.js";import"./useObjectRef-DrJIir3F.js";import"./Label-C-UeOlhu.js";import"./Hidden-C1Rvfh0a.js";import"./useFocusRing-KWUxPK8x.js";import"./openLink-DeVBsZVT.js";import"./useLabel-DuGYdeVZ.js";import"./useLabels-C5Sb3eQn.js";import"./number-CnABZTeS.js";import"./I18nProvider-CEYf4yN0.js";import"./useButton-B-tc2orz.js";import"./usePress-DUFujYJV.js";import"./textSelection-CmT3bbJB.js";import"./useHover-C40GJDws.js";import"./Input-D0qkWHrE.js";import"./SearchField--zMKMabY.js";import"./FieldError-R8gf8j-5.js";import"./Text-kgP67g1L.js";import"./Autocomplete-FbP99aZV.js";import"./keyboard-8KwQEgaY.js";import"./useEvent-CdwABQDt.js";import"./useLocalizedStringFormatter-DiezMxYB.js";import"./useControlledState-DA3BLMuY.js";import"./useTextField-BeKMltDD.js";import"./useField-BxXW_0MU.js";import"./useFormReset-BF8qzp5Y.js";import"./FieldError-DxxVTnAm.js";import"./useCollection-D77l3K3S.js";import"./FocusScope-DyJjlp03.js";import"./Link-7UMdgDHJ.js";import"./useLink-C3g6zDAO.js";import"./Menu-tK0eMXg7.js";import"./getItemCount-D4KD3X2x.js";import"./ListBox-BqHkkENg.js";import"./useListState-CPlAgzVx.js";import"./Dialog-C-xzIvD4.js";import"./Heading-Boz8J-3b.js";import"./useOverlayTriggerState-CP5VgdLu.js";import"./VisuallyHidden-Cf_DEQs1.js";import"./animation-yDPRJL1t.js";import"./Virtualizer-gBMOw2Uc.js";import"./useFilter-CUNITVuy.js";import"./getNodeText-Clib3ygy.js";import"./Link-BAgUrxJs.js";import"./useResolvedHref-6YPNP1wf.js";import"./Tooltip-BvBLCeHz.js";import"./VisuallyHidden-ChlmTVpq.js";import"./Tabs-BgFpNnjj.js";import"./useHasTabbableChild-BezigKkY.js";const a=N.meta({title:"Backstage UI/SearchField",component:t,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"},placeholder:{control:"text"}}}),i=a.story({args:{name:"url",style:{maxWidth:"300px"},"aria-label":"Search"}}),g=a.story({args:{...i.input.args},render:r=>e.jsxs(s,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(t,{...r,size:"small"}),e.jsx(t,{...r,size:"medium"})]})}),x=a.story({args:{...i.input.args,defaultValue:"https://example.com"}}),o=a.story({args:{...i.input.args,label:"Label"}}),h=a.story({args:{...o.input.args,description:"Description"}}),y=a.story({args:{...o.input.args,isRequired:!0}}),S=a.story({args:{...i.input.args,isDisabled:!0}}),m=a.story({args:{...i.input.args},render:r=>e.jsx(t,{...r,placeholder:"Enter a URL",size:"small",icon:e.jsx(A,{})})}),b=a.story({args:{...m.input.args,isDisabled:!0}}),j=a.story({args:{...o.input.args},render:r=>e.jsx(P,{validationErrors:{url:"Invalid URL"},children:e.jsx(t,{...r})})}),F=a.story({args:{...o.input.args,validate:r=>r==="admin"?"Nice try!":null}}),C=a.story({render:()=>e.jsxs(e.Fragment,{children:[e.jsx(q,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(t,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})}),n=a.story({args:{...i.input.args,startCollapsed:!0},render:r=>e.jsxs(s,{direction:"column",gap:"4",children:[e.jsxs(s,{direction:"row",gap:"4",children:[e.jsx(t,{...r,size:"small"}),e.jsx(t,{...r,size:"medium"})]}),e.jsx(t,{...r,size:"small"})]})}),z=a.story({args:{...n.input.args,defaultValue:"https://example.com"},render:r=>e.jsx(t,{...r,size:"small"})}),v=a.story({decorators:[r=>e.jsx(T,{children:e.jsx(H,{children:e.jsx(r,{})})})],render:r=>e.jsx(e.Fragment,{children:e.jsx(U,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(u,{"aria-label":"Cactus icon button",icon:e.jsx(c,{}),size:"small",variant:"secondary"}),e.jsx(t,{"aria-label":"Search",...r,size:"small"}),e.jsx(u,{"aria-label":"Cactus icon button",icon:e.jsx(c,{}),size:"small",variant:"secondary"})]})})})}),f=a.story({args:{...n.input.args},decorators:[r=>e.jsx(T,{children:e.jsx(H,{children:e.jsx(r,{})})})],render:r=>e.jsx(e.Fragment,{children:e.jsx(U,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(u,{"aria-label":"Cactus icon button",icon:e.jsx(c,{}),size:"small",variant:"secondary"}),e.jsx(t,{...r,size:"small"}),e.jsx(u,{"aria-label":"Cactus icon button",icon:e.jsx(c,{}),size:"small",variant:"secondary"})]})})})}),W=a.story({args:{...n.input.args},render:r=>e.jsxs(s,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(t,{...r,size:"small"}),e.jsx(u,{"aria-label":"Cactus icon button",icon:e.jsx(c,{}),size:"small",variant:"secondary"}),e.jsx(V,{size:"small",variant:"secondary",children:"Hello world"}),e.jsx(t,{...r,size:"medium"}),e.jsx(u,{"aria-label":"Cactus icon button",icon:e.jsx(c,{}),size:"medium",variant:"secondary"}),e.jsx(V,{size:"medium",variant:"secondary",children:"Hello world"})]})}),B=a.story({args:{...n.input.args},render:r=>{const p=d=>{console.log("Search value:",d)};return e.jsx(s,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(t,{...r,onChange:p,size:"small"})})}}),w=a.story({args:{...n.input.args},render:function(p){const[d,D]=E.useState("");return e.jsx(s,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(t,{...p,size:"small",value:d,onChange:D})})}}),R=a.story({args:{...n.input.args},render:function(p){const[d,D]=E.useState("Component");return e.jsx(s,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(t,{...p,size:"small",value:d,onChange:D})})}}),I=a.story({render:()=>e.jsxs(s,{direction:"column",gap:"4",children:[e.jsx("div",{style:{maxWidth:"600px"},children:"SearchField automatically detects its parent bg context and increments the neutral level by 1. No prop is needed — it's fully automatic."}),e.jsxs(l,{bg:"neutral",p:"4",children:[e.jsx(L,{children:"Neutral 1 container"}),e.jsx(s,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(t,{"aria-label":"Search",size:"small"})})]}),e.jsx(l,{bg:"neutral",children:e.jsxs(l,{bg:"neutral",p:"4",children:[e.jsx(L,{children:"Neutral 2 container"}),e.jsx(s,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(t,{"aria-label":"Search",size:"small"})})]})}),e.jsx(l,{bg:"neutral",children:e.jsx(l,{bg:"neutral",children:e.jsxs(l,{bg:"neutral",p:"4",children:[e.jsx(L,{children:"Neutral 3 container"}),e.jsx(s,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(t,{"aria-label":"Search",size:"small"})})]})})})]})});i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
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
