import{j as e,B as l,M as T,r as E,p as N}from"./iframe-BYYe_BET.js";import{S as a}from"./SearchField-DKGkPkNu.js";import{$ as P}from"./Form-DuiANyPI.js";import{d as c,U as A}from"./index-COE7Jz9g.js";import{F as s}from"./Flex-BpRR8em9.js";import{T as L}from"./Text-B33oXa7b.js";import{F as M}from"./FieldLabel-CSp54EM_.js";import{P as U}from"./PluginHeader-DlWuLMuq.js";import{B as u}from"./ButtonIcon-I4aSAKuo.js";import{B as H}from"./BUIProvider-By5rpXjK.js";import{B as V}from"./Button-DLV4nrO1.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-DEPxcD8C.js";import"./utils-CJSyyO3-.js";import"./useObjectRef-9OXtpzcu.js";import"./Label-Bs-x77sn.js";import"./Hidden-c60OiMP4.js";import"./useFocusRing-BRx5O8Da.js";import"./openLink-BON_CNZm.js";import"./useLabel-dcXziXhr.js";import"./useLabels-4i8ghj68.js";import"./number-CtW1NSkQ.js";import"./I18nProvider-rRNMaJeu.js";import"./useButton-f7nJByYc.js";import"./usePress-CdThG8-6.js";import"./textSelection-D5BzNUOh.js";import"./getMetaValue-Bn1etyTW.js";import"./useHover-DawSjhGk.js";import"./Input-BCQuwCc2.js";import"./SearchField-DO5H9G35.js";import"./FieldError-lvCPLHt0.js";import"./Text-DCKtGqqk.js";import"./Autocomplete-DPgl-JtA.js";import"./keyboard-DfJpn7U5.js";import"./useEvent-B1WEd5Ze.js";import"./useLocalizedStringFormatter-yKTdty33.js";import"./useControlledState-DguQehpe.js";import"./useTextField-D_S0Erlu.js";import"./useField-CTlO1gOc.js";import"./useFormReset-CgEuTYmc.js";import"./useFormValidation-DJxngnhN.js";import"./FieldError-DHcVDA2P.js";import"./useCollection-DqLEpLDM.js";import"./FocusScope-D48ubNpo.js";import"./Link-Cm2DuzGn.js";import"./useLink-PyDueBaS.js";import"./Menu-C2kjSQqD.js";import"./useLoadMoreSentinel-CNEYEidD.js";import"./ListBox-D6VaTCxL.js";import"./SelectionIndicator-kuT3rs5m.js";import"./useListState-BNvxBoXz.js";import"./Dialog-5N2H3Til.js";import"./Heading-BulpGcy4.js";import"./useOverlayTriggerState-B9znxEmb.js";import"./VisuallyHidden-DOvpC764.js";import"./animation-DtpQ2ZDK.js";import"./Virtualizer-B586PFaq.js";import"./useFilter-CZi588_R.js";import"./getNodeText-Bdrh_1kq.js";import"./Link-1Yd9vpsu.js";import"./useResolvedHref-C1qAVxpR.js";import"./Tooltip-B3Py3aUh.js";import"./VisuallyHidden-BzfP5imd.js";import"./Tabs-uA2wGW7X.js";import"./useHasTabbableChild-C_riEbXC.js";import"./BUIRoutingProvider-DagVjI_D.js";const t=N.meta({title:"Backstage UI/SearchField",component:a,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"},placeholder:{control:"text"}}}),i=t.story({args:{name:"url",style:{maxWidth:"300px"},"aria-label":"Search"}}),g=t.story({args:{...i.input.args},render:r=>e.jsxs(s,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(a,{...r,size:"small"}),e.jsx(a,{...r,size:"medium"})]})}),x=t.story({args:{...i.input.args,defaultValue:"https://example.com"}}),n=t.story({args:{...i.input.args,label:"Label"}}),h=t.story({args:{...n.input.args,description:"Description"}}),y=t.story({args:{...n.input.args,isRequired:!0}}),S=t.story({args:{...i.input.args,isDisabled:!0}}),m=t.story({args:{...i.input.args},render:r=>e.jsx(a,{...r,placeholder:"Enter a URL",size:"small",icon:e.jsx(A,{})})}),b=t.story({args:{...m.input.args,isDisabled:!0}}),j=t.story({args:{...n.input.args},render:r=>e.jsx(P,{validationErrors:{url:"Invalid URL"},children:e.jsx(a,{...r})})}),F=t.story({args:{...n.input.args,validate:r=>r==="admin"?"Nice try!":null}}),C=t.story({render:()=>e.jsxs(e.Fragment,{children:[e.jsx(M,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(a,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})}),o=t.story({args:{...i.input.args,startCollapsed:!0},render:r=>e.jsxs(s,{direction:"column",gap:"4",children:[e.jsxs(s,{direction:"row",gap:"4",children:[e.jsx(a,{...r,size:"small"}),e.jsx(a,{...r,size:"medium"})]}),e.jsx(a,{...r,size:"small"})]})}),z=t.story({args:{...o.input.args,defaultValue:"https://example.com"},render:r=>e.jsx(a,{...r,size:"small"})}),v=t.story({decorators:[r=>e.jsx(T,{children:e.jsx(H,{children:e.jsx(r,{})})})],render:r=>e.jsx(e.Fragment,{children:e.jsx(U,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(u,{"aria-label":"Cactus icon button",icon:e.jsx(c,{}),size:"small",variant:"secondary"}),e.jsx(a,{"aria-label":"Search",...r,size:"small"}),e.jsx(u,{"aria-label":"Cactus icon button",icon:e.jsx(c,{}),size:"small",variant:"secondary"})]})})})}),f=t.story({args:{...o.input.args},decorators:[r=>e.jsx(T,{children:e.jsx(H,{children:e.jsx(r,{})})})],render:r=>e.jsx(e.Fragment,{children:e.jsx(U,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(u,{"aria-label":"Cactus icon button",icon:e.jsx(c,{}),size:"small",variant:"secondary"}),e.jsx(a,{...r,size:"small"}),e.jsx(u,{"aria-label":"Cactus icon button",icon:e.jsx(c,{}),size:"small",variant:"secondary"})]})})})}),W=t.story({args:{...o.input.args},render:r=>e.jsxs(s,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(a,{...r,size:"small"}),e.jsx(u,{"aria-label":"Cactus icon button",icon:e.jsx(c,{}),size:"small",variant:"secondary"}),e.jsx(V,{size:"small",variant:"secondary",children:"Hello world"}),e.jsx(a,{...r,size:"medium"}),e.jsx(u,{"aria-label":"Cactus icon button",icon:e.jsx(c,{}),size:"medium",variant:"secondary"}),e.jsx(V,{size:"medium",variant:"secondary",children:"Hello world"})]})}),B=t.story({args:{...o.input.args},render:r=>{const p=d=>{console.log("Search value:",d)};return e.jsx(s,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(a,{...r,onChange:p,size:"small"})})}}),w=t.story({args:{...o.input.args},render:function(p){const[d,D]=E.useState("");return e.jsx(s,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(a,{...p,size:"small",value:d,onChange:D})})}}),R=t.story({args:{...o.input.args},render:function(p){const[d,D]=E.useState("Component");return e.jsx(s,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(a,{...p,size:"small",value:d,onChange:D})})}}),I=t.story({render:()=>e.jsxs(s,{direction:"column",gap:"4",children:[e.jsx("div",{style:{maxWidth:"600px"},children:"SearchField automatically detects its parent bg context and increments the neutral level by 1. No prop is needed — it's fully automatic."}),e.jsxs(l,{bg:"neutral",p:"4",children:[e.jsx(L,{children:"Neutral 1 container"}),e.jsx(s,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(a,{"aria-label":"Search",size:"small"})})]}),e.jsx(l,{bg:"neutral",children:e.jsxs(l,{bg:"neutral",p:"4",children:[e.jsx(L,{children:"Neutral 2 container"}),e.jsx(s,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(a,{"aria-label":"Search",size:"small"})})]})}),e.jsx(l,{bg:"neutral",children:e.jsx(l,{bg:"neutral",children:e.jsxs(l,{bg:"neutral",p:"4",children:[e.jsx(L,{children:"Neutral 3 container"}),e.jsx(s,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(a,{"aria-label":"Search",size:"small"})})]})})})]})});i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...x.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    label: 'Label'
  }
})`,...n.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...C.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...o.input.parameters?.docs?.source}}};z.input.parameters={...z.input.parameters,docs:{...z.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...I.input.parameters?.docs?.source}}};const er=["Default","Sizes","DefaultValue","WithLabel","WithDescription","Required","Disabled","WithIcon","DisabledWithIcon","ShowError","Validation","CustomField","StartCollapsed","StartCollapsedWithValue","InHeader","StartCollapsedInHeader","StartCollapsedWithButtons","StartCollapsedWithOnChange","StartCollapsedControlledEmpty","StartCollapsedControlledWithValue","AutoBg"];export{I as AutoBg,C as CustomField,i as Default,x as DefaultValue,S as Disabled,b as DisabledWithIcon,v as InHeader,y as Required,j as ShowError,g as Sizes,o as StartCollapsed,w as StartCollapsedControlledEmpty,R as StartCollapsedControlledWithValue,f as StartCollapsedInHeader,W as StartCollapsedWithButtons,B as StartCollapsedWithOnChange,z as StartCollapsedWithValue,F as Validation,h as WithDescription,m as WithIcon,n as WithLabel,er as __namedExportsOrder};
