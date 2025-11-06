import{r as g,j as e}from"./iframe-D4YkWMPd.js";import{$ as Y}from"./Button-D2eZfW-4.js";import{$ as ee}from"./Input-DS9mHWJ4.js";import{$ as ae}from"./SearchField-BWCEFQwP.js";import{c as m}from"./clsx-B-dksMZM.js";import{Z as re,A as se,U as te,e as o}from"./index-CD_2jLbB.js";import{u as le}from"./useStyles-Dj9KEUsZ.js";import{F as E}from"./FieldLabel-D2safqZo.js";import{F as ie}from"./FieldError-aa2tuK7m.js";import{$ as oe}from"./Form-Cj9eoAUB.js";import{F as W}from"./Flex-BApT9WnH.js";import{H}from"./Header-DeQMoBxY.js";import{M as T}from"./index-Cb5ApCX3.js";import{B as n}from"./ButtonIcon-DHc9zKoy.js";import{B as N}from"./Button-B5RBvaOD.js";import"./preload-helper-D9Z9MdNV.js";import"./utils-DC4lCrYp.js";import"./Hidden-h5lpMBrE.js";import"./useFocusRing-BB2_8xTe.js";import"./usePress-xT3Tq1ZD.js";import"./useFormReset-gog8c8Xs.js";import"./useControlledState-D2kbQZKm.js";import"./Text-BAEVBR3H.js";import"./useLabels-CUySVsUf.js";import"./FieldError-DWLPrlO-.js";import"./RSPContexts-CaU8v6lP.js";import"./Label-D5ROKj0e.js";import"./useLocalizedStringFormatter-BFqMry8S.js";import"./context-5SX1E9i3.js";import"./Link-zClY7dUw.js";import"./Text-CO-IAJCE.js";import"./Tabs-DF8d3nKk.js";import"./useListState-OxYjtzOI.js";import"./useEvent-Dou5Apax.js";import"./SelectionIndicator-BH7Lx6i2.js";import"./useHasTabbableChild-Cq6xd4nB.js";import"./Button.module-BHYJStbY.js";const u={"bui-SearchField":"_bui-SearchField_xdbqz_20","bui-SearchFieldClear":"_bui-SearchFieldClear_xdbqz_29","bui-SearchFieldInput":"_bui-SearchFieldInput_xdbqz_56","bui-SearchFieldWrapper":"_bui-SearchFieldWrapper_xdbqz_68","bui-SearchFieldInputIcon":"_bui-SearchFieldInputIcon_xdbqz_101"},r=g.forwardRef((a,L)=>{const{label:c,"aria-label":B,"aria-labelledby":D}=a,[A,q]=g.useState(!1),[V,$]=g.useState(!0);g.useEffect(()=>{!c&&!B&&!D&&console.warn("SearchField requires either a visible label, aria-label, or aria-labelledby for accessibility")},[c,B,D]);const{classNames:s,dataAttributes:h,style:U,cleanedProps:k}=le("SearchField",{size:"small",placeholder:"Search",startCollapsed:!1,...a}),{className:M,description:P,icon:_,isRequired:O,secondaryLabel:Z,placeholder:G,startCollapsed:ne,...J}=k,K=Z||(O?"Required":null),Q=d=>{a.onFocusChange?.(d),V&&q(!!d)},X=d=>{a.onChange?.(d),d.length>0?$(!1):$(!0)};return e.jsxs(ae,{className:m(s.root,u[s.root],M),...h,"aria-label":B,"aria-labelledby":D,"data-collapsed":A,onFocusChange:Q,onChange:X,style:U,...J,ref:L,children:[e.jsx(E,{label:c,secondaryLabel:K,description:P}),e.jsxs("div",{className:m(s.inputWrapper,u[s.inputWrapper]),"data-size":h["data-size"],children:[_!==!1&&e.jsx("div",{className:m(s.inputIcon,u[s.inputIcon]),"data-size":h["data-size"],"aria-hidden":"true",children:_||e.jsx(re,{})}),e.jsx(ee,{className:m(s.input,u[s.input]),..._!==!1&&{"data-icon":!0},placeholder:G}),e.jsx(Y,{className:m(s.clear,u[s.clear]),"data-size":h["data-size"],children:e.jsx(se,{})})]}),e.jsx(ie,{})]})});r.displayName="searchField";r.__docgenInfo={description:"@public",methods:[],displayName:"searchField",props:{icon:{required:!1,tsType:{name:"union",raw:"ReactNode | false",elements:[{name:"ReactNode"},{name:"literal",value:"false"}]},description:"An icon to render before the input"},size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the text field
@defaultValue 'medium'`},placeholder:{required:!1,tsType:{name:"string"},description:"The placeholder text for the input"},startCollapsed:{required:!1,tsType:{name:"boolean"},description:"Controls whether the SearchField starts in a collapsed state."}},composes:["AriaSearchFieldProps","Omit"]};const Oe={title:"Backstage UI/SearchField",component:r,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"},placeholder:{control:"text"}}},t={args:{name:"url",style:{maxWidth:"300px"},"aria-label":"Search"}},b={args:{...t.args},render:a=>e.jsxs(W,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(r,{...a,size:"small"}),e.jsx(r,{...a,size:"medium"})]})},x={args:{...t.args,defaultValue:"https://example.com"}},l={args:{...t.args,label:"Label"}},f={args:{...l.args,description:"Description"}},S={args:{...l.args,isRequired:!0}},F={args:{...t.args,isDisabled:!0}},p={args:{...t.args},render:a=>e.jsx(r,{...a,placeholder:"Enter a URL",size:"small",icon:e.jsx(te,{})})},C={args:{...p.args,isDisabled:!0}},j={args:{...l.args},render:a=>e.jsx(oe,{validationErrors:{url:"Invalid URL"},children:e.jsx(r,{...a})})},y={args:{...l.args,validate:a=>a==="admin"?"Nice try!":null}},z={render:()=>e.jsxs(e.Fragment,{children:[e.jsx(E,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(r,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})},i={args:{...t.args,startCollapsed:!0},render:a=>e.jsxs(W,{direction:"row",gap:"4",children:[e.jsx(r,{...a,size:"small"}),e.jsx(r,{...a,size:"medium"})]})},v={decorators:[a=>e.jsx(T,{children:e.jsx(a,{})})],render:a=>e.jsx(e.Fragment,{children:e.jsx(H,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(n,{"aria-label":"Cactus icon button",icon:e.jsx(o,{}),size:"small",variant:"secondary"}),e.jsx(r,{"aria-label":"Search",...a,size:"small"}),e.jsx(n,{"aria-label":"Cactus icon button",icon:e.jsx(o,{}),size:"small",variant:"secondary"})]})})})},R={args:{...i.args},decorators:[a=>e.jsx(T,{children:e.jsx(a,{})})],render:a=>e.jsx(e.Fragment,{children:e.jsx(H,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(n,{"aria-label":"Cactus icon button",icon:e.jsx(o,{}),size:"small",variant:"secondary"}),e.jsx(r,{...a,size:"small"}),e.jsx(n,{"aria-label":"Cactus icon button",icon:e.jsx(o,{}),size:"small",variant:"secondary"})]})})})},w={args:{...i.args},render:a=>e.jsxs(W,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(r,{...a,size:"small"}),e.jsx(n,{"aria-label":"Cactus icon button",icon:e.jsx(o,{}),size:"small",variant:"secondary"}),e.jsx(N,{size:"small",variant:"secondary",children:"Hello world"}),e.jsx(r,{...a,size:"medium"}),e.jsx(n,{"aria-label":"Cactus icon button",icon:e.jsx(o,{}),size:"medium",variant:"secondary"}),e.jsx(N,{size:"medium",variant:"secondary",children:"Hello world"})]})},I={args:{...i.args},render:a=>{const L=c=>{console.log("Search value:",c)};return e.jsx(W,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(r,{...a,onChange:L,size:"small"})})}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'url',
    style: {
      maxWidth: '300px'
    },
    'aria-label': 'Search'
  }
}`,...t.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    defaultValue: 'https://example.com'
  }
}`,...x.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    label: 'Label'
  }
}`,...l.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    description: 'Description'
  }
}`,...f.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    isRequired: true
  }
}`,...S.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    isDisabled: true
  }
}`,...F.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: args => <SearchField {...args} placeholder="Enter a URL" size="small" icon={<RiEBike2Line />} />
}`,...p.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithIcon.args,
    isDisabled: true
  }
}`,...C.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args
  },
  render: args => <Form validationErrors={{
    url: 'Invalid URL'
  }}>
      <SearchField {...args} />
    </Form>
}`,...j.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    validate: value => value === 'admin' ? 'Nice try!' : null
  }
}`,...y.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: () => <>
      <FieldLabel htmlFor="custom-field" id="custom-field-label" label="Custom Field" />
      <SearchField id="custom-field" aria-labelledby="custom-field-label" name="custom-field" defaultValue="Custom Field" />
    </>
}`,...z.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    startCollapsed: true
  },
  render: args => <Flex direction="row" gap="4">
      <SearchField {...args} size="small" />
      <SearchField {...args} size="medium" />
    </Flex>
}`,...i.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
}`,...R.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}};const Ze=["Default","Sizes","DefaultValue","WithLabel","WithDescription","Required","Disabled","WithIcon","DisabledWithIcon","ShowError","Validation","CustomField","StartCollapsed","InHeader","StartCollapsedInHeader","StartCollapsedWithButtons","StartCollapsedWithOnChange"];export{z as CustomField,t as Default,x as DefaultValue,F as Disabled,C as DisabledWithIcon,v as InHeader,S as Required,j as ShowError,b as Sizes,i as StartCollapsed,R as StartCollapsedInHeader,w as StartCollapsedWithButtons,I as StartCollapsedWithOnChange,y as Validation,f as WithDescription,p as WithIcon,l as WithLabel,Ze as __namedExportsOrder,Oe as default};
