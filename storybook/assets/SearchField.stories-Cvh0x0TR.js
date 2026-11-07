import{j as e,B as l,M as T,r as E,p as N}from"./iframe-D9zyyCLm.js";import{S as a}from"./SearchField-s_QrWiyA.js";import{$ as P}from"./Form-BKc8ubiD.js";import{d as c,U as A}from"./index-BJpHCwC2.js";import{F as s}from"./Flex-C2lYLK_a.js";import{T as L}from"./Text-CgjLIcL_.js";import{F as M}from"./FieldLabel-Bco1t6YF.js";import{P as U}from"./PluginHeader-BQTnlTrc.js";import{B as u}from"./ButtonIcon-D9JFIQSe.js";import{B as H}from"./BUIProvider-CorbBPd2.js";import{B as V}from"./Button-CSQDAfAB.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-eiFaSVQp.js";import"./utils-BhB9Kn0J.js";import"./useObjectRef-DW2A_FKT.js";import"./Label-8xCw--Gh.js";import"./Hidden-BEbPYnKb.js";import"./useFocusRing-Cyv4kXD7.js";import"./openLink-Dq3aE_9q.js";import"./useLabel-CNCvRjXr.js";import"./useLabels-Cf60hIuc.js";import"./number-oRZks6E2.js";import"./I18nProvider-CFA5Nn83.js";import"./useButton-Br280P7j.js";import"./usePress-DakPojsx.js";import"./textSelection-B_folLqx.js";import"./getMetaValue-DvVIc-fc.js";import"./useHover-CXer1LBh.js";import"./Input-HAwV3UgY.js";import"./SearchField-BIwjR7hY.js";import"./FieldError-PBAfGMRH.js";import"./Text-DyJll7O5.js";import"./Autocomplete-y5aAoPrH.js";import"./keyboard-DCFt_Vdh.js";import"./useEvent-CgIHwaqr.js";import"./useLocalizedStringFormatter-Cws02Rph.js";import"./useControlledState-CNVQPQl6.js";import"./useTextField-CnV1bkF2.js";import"./useField-BFVTHaKM.js";import"./useFormReset-fb_8OtZl.js";import"./useFormValidation-DU6bMNno.js";import"./FieldError-CW07svXX.js";import"./useCollection-B26EPvJy.js";import"./FocusScope-lLzncA3g.js";import"./Link-CrETciSf.js";import"./useLink-B2hTr1Or.js";import"./Menu-CQeWkge2.js";import"./useLoadMoreSentinel-CSmiezNk.js";import"./ListBox-CLfyKQ5P.js";import"./SelectionIndicator-DYFHwb90.js";import"./useListState-DNv1jxCo.js";import"./Dialog-B4rjAWyQ.js";import"./Heading-B3QLbIIh.js";import"./useOverlayTriggerState-BkEw8wth.js";import"./VisuallyHidden-k2mNg0ke.js";import"./animation-Dc2F1pm8.js";import"./Virtualizer-B6YG3lYk.js";import"./useFilter-HAVuwduG.js";import"./getNodeText-DKIdVNID.js";import"./Link-DZ17BmAx.js";import"./useResolvedHref-CJObg6YS.js";import"./Tooltip-BhAvVrKz.js";import"./VisuallyHidden-DQZkBOu3.js";import"./Tabs-DyHdiEHo.js";import"./useHasTabbableChild-qIq5_-ZX.js";import"./BUIRoutingProvider-CWnqyVtP.js";const t=N.meta({title:"Backstage UI/SearchField",component:a,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"},placeholder:{control:"text"}}}),i=t.story({args:{name:"url",style:{maxWidth:"300px"},"aria-label":"Search"}}),g=t.story({args:{...i.input.args},render:r=>e.jsxs(s,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(a,{...r,size:"small"}),e.jsx(a,{...r,size:"medium"})]})}),x=t.story({args:{...i.input.args,defaultValue:"https://example.com"}}),n=t.story({args:{...i.input.args,label:"Label"}}),h=t.story({args:{...n.input.args,description:"Description"}}),y=t.story({args:{...n.input.args,isRequired:!0}}),S=t.story({args:{...i.input.args,isDisabled:!0}}),m=t.story({args:{...i.input.args},render:r=>e.jsx(a,{...r,placeholder:"Enter a URL",size:"small",icon:e.jsx(A,{})})}),b=t.story({args:{...m.input.args,isDisabled:!0}}),j=t.story({args:{...n.input.args},render:r=>e.jsx(P,{validationErrors:{url:"Invalid URL"},children:e.jsx(a,{...r})})}),F=t.story({args:{...n.input.args,validate:r=>r==="admin"?"Nice try!":null}}),C=t.story({render:()=>e.jsxs(e.Fragment,{children:[e.jsx(M,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(a,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})}),o=t.story({args:{...i.input.args,startCollapsed:!0},render:r=>e.jsxs(s,{direction:"column",gap:"4",children:[e.jsxs(s,{direction:"row",gap:"4",children:[e.jsx(a,{...r,size:"small"}),e.jsx(a,{...r,size:"medium"})]}),e.jsx(a,{...r,size:"small"})]})}),z=t.story({args:{...o.input.args,defaultValue:"https://example.com"},render:r=>e.jsx(a,{...r,size:"small"})}),v=t.story({decorators:[r=>e.jsx(T,{children:e.jsx(H,{children:e.jsx(r,{})})})],render:r=>e.jsx(e.Fragment,{children:e.jsx(U,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(u,{"aria-label":"Cactus icon button",icon:e.jsx(c,{}),size:"small",variant:"secondary"}),e.jsx(a,{"aria-label":"Search",...r,size:"small"}),e.jsx(u,{"aria-label":"Cactus icon button",icon:e.jsx(c,{}),size:"small",variant:"secondary"})]})})})}),f=t.story({args:{...o.input.args},decorators:[r=>e.jsx(T,{children:e.jsx(H,{children:e.jsx(r,{})})})],render:r=>e.jsx(e.Fragment,{children:e.jsx(U,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(u,{"aria-label":"Cactus icon button",icon:e.jsx(c,{}),size:"small",variant:"secondary"}),e.jsx(a,{...r,size:"small"}),e.jsx(u,{"aria-label":"Cactus icon button",icon:e.jsx(c,{}),size:"small",variant:"secondary"})]})})})}),W=t.story({args:{...o.input.args},render:r=>e.jsxs(s,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(a,{...r,size:"small"}),e.jsx(u,{"aria-label":"Cactus icon button",icon:e.jsx(c,{}),size:"small",variant:"secondary"}),e.jsx(V,{size:"small",variant:"secondary",children:"Hello world"}),e.jsx(a,{...r,size:"medium"}),e.jsx(u,{"aria-label":"Cactus icon button",icon:e.jsx(c,{}),size:"medium",variant:"secondary"}),e.jsx(V,{size:"medium",variant:"secondary",children:"Hello world"})]})}),B=t.story({args:{...o.input.args},render:r=>{const p=d=>{console.log("Search value:",d)};return e.jsx(s,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(a,{...r,onChange:p,size:"small"})})}}),w=t.story({args:{...o.input.args},render:function(p){const[d,D]=E.useState("");return e.jsx(s,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(a,{...p,size:"small",value:d,onChange:D})})}}),R=t.story({args:{...o.input.args},render:function(p){const[d,D]=E.useState("Component");return e.jsx(s,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(a,{...p,size:"small",value:d,onChange:D})})}}),I=t.story({render:()=>e.jsxs(s,{direction:"column",gap:"4",children:[e.jsx("div",{style:{maxWidth:"600px"},children:"SearchField automatically detects its parent bg context and increments the neutral level by 1. No prop is needed — it's fully automatic."}),e.jsxs(l,{bg:"neutral",p:"4",children:[e.jsx(L,{children:"Neutral 1 container"}),e.jsx(s,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(a,{"aria-label":"Search",size:"small"})})]}),e.jsx(l,{bg:"neutral",children:e.jsxs(l,{bg:"neutral",p:"4",children:[e.jsx(L,{children:"Neutral 2 container"}),e.jsx(s,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(a,{"aria-label":"Search",size:"small"})})]})}),e.jsx(l,{bg:"neutral",children:e.jsx(l,{bg:"neutral",children:e.jsxs(l,{bg:"neutral",p:"4",children:[e.jsx(L,{children:"Neutral 3 container"}),e.jsx(s,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(a,{"aria-label":"Search",size:"small"})})]})})})]})});i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
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
