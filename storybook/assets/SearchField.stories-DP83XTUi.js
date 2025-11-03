import{r as h,j as e}from"./iframe-D-w6RxGv.js";import{$ as re}from"./Button-DS_q7_gF.js";import{$ as se}from"./Input-ZaFjqHfk.js";import{$ as te}from"./SearchField-CPAw7Unb.js";import{c as m}from"./clsx-B-dksMZM.js";import{Z as le,A as oe,U as ie,e as i}from"./index-DiR7Z3c7.js";import{u as q}from"./useStyles-Cd9RkdK8.js";import{s as b}from"./TextField.module-BNd6YL_d.js";import{F as k}from"./FieldLabel-Bw2UxdTB.js";import{F as ne}from"./FieldError-B_Rn6aFt.js";import{$ as ce}from"./Form-D9kc8UgZ.js";import{F as L}from"./Flex-BiQL9uGd.js";import{H as A}from"./Header-cwYNDvx1.js";import{M as V}from"./index-BY4RoNki.js";import{B as n}from"./ButtonIcon-Dwmiuwmh.js";import{B as E}from"./Button-YB-sfOU7.js";import"./preload-helper-D9Z9MdNV.js";import"./utils-DGD-2B-R.js";import"./Hidden-CRACug8J.js";import"./useFocusRing-DWZsk0-g.js";import"./usePress-DWKZua81.js";import"./useFormReset-DK1Xmumq.js";import"./useControlledState-BXBRvxOS.js";import"./Text-BacNss1s.js";import"./useLabels-Dad0g-N2.js";import"./FieldError-DBkJmO70.js";import"./RSPContexts-BLf_W-sb.js";import"./Label-DY-UDYo-.js";import"./useLocalizedStringFormatter-D0Ixpy99.js";import"./context-Bf1dRGNL.js";import"./Link-C_ceUHPp.js";import"./Text-CqtGvYow.js";import"./Tabs-DfN1d3oz.js";import"./useListState-BGXaWCgQ.js";import"./SelectionIndicator--PDgEyYa.js";import"./useHasTabbableChild-BOThj9uW.js";import"./Button.module-BHYJStbY.js";const H={"bui-SearchField":"_bui-SearchField_k4ren_20","bui-InputClear":"_bui-InputClear_k4ren_25","bui-Input":"_bui-Input_k4ren_25","bui-InputWrapper":"_bui-InputWrapper_k4ren_64","bui-InputIcon":"_bui-InputIcon_k4ren_93"},r=h.forwardRef((a,B)=>{const{label:c,"aria-label":D,"aria-labelledby":_}=a,[U,$]=h.useState(!1),[M,T]=h.useState(!0);h.useEffect(()=>{!c&&!D&&!_&&console.warn("SearchField requires either a visible label, aria-label, or aria-labelledby for accessibility")},[c,D,_]);const{classNames:t}=q("TextField"),{classNames:p,dataAttributes:g,style:P,cleanedProps:O}=q("SearchField",{size:"small",placeholder:"Search",startCollapsed:!1,...a}),{className:Z,description:G,icon:N,isRequired:J,secondaryLabel:K,placeholder:Q,startCollapsed:de,...X}=O,Y=K||(J?"Required":null),ee=d=>{a.onFocusChange?.(d),M&&$(!!d)},ae=d=>{a.onChange?.(d),d.length>0?T(!1):T(!0)};return e.jsxs(te,{className:m(t.root,p.root,b[t.root],H[p.root],Z),...g,"aria-label":D,"aria-labelledby":_,"data-collapsed":U,onFocusChange:ee,onChange:ae,style:P,...X,ref:B,children:[e.jsx(k,{label:c,secondaryLabel:Y,description:G}),e.jsxs("div",{className:m(t.inputWrapper,b[t.inputWrapper]),"data-size":g["data-size"],children:[N!==!1&&e.jsx("div",{className:m(t.inputIcon,b[t.inputIcon]),"data-size":g["data-size"],"aria-hidden":"true",children:N||e.jsx(le,{})}),e.jsx(se,{className:m(t.input,b[t.input]),...N!==!1&&{"data-icon":!0},placeholder:Q}),e.jsx(re,{className:m(p.clear,H[p.clear]),"data-size":g["data-size"],children:e.jsx(oe,{})})]}),e.jsx(ne,{})]})});r.displayName="searchField";r.__docgenInfo={description:"@public",methods:[],displayName:"searchField",props:{icon:{required:!1,tsType:{name:"union",raw:"ReactNode | false",elements:[{name:"ReactNode"},{name:"literal",value:"false"}]},description:"An icon to render before the input"},size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the text field
@defaultValue 'medium'`},placeholder:{required:!1,tsType:{name:"string"},description:"The placeholder text for the input"},startCollapsed:{required:!1,tsType:{name:"boolean"},description:"Controls whether the SearchField starts in a collapsed state."}},composes:["AriaSearchFieldProps","Omit"]};const Ge={title:"Backstage UI/SearchField",component:r,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"},placeholder:{control:"text"}}},s={args:{name:"url",style:{maxWidth:"300px"},"aria-label":"Search"}},x={args:{...s.args},render:a=>e.jsxs(L,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(r,{...a,size:"small"}),e.jsx(r,{...a,size:"medium"})]})},f={args:{...s.args,defaultValue:"https://example.com"}},l={args:{...s.args,label:"Label"}},S={args:{...l.args,description:"Description"}},C={args:{...l.args,isRequired:!0}},F={args:{...s.args,isDisabled:!0}},u={args:{...s.args},render:a=>e.jsx(r,{...a,placeholder:"Enter a URL",size:"small",icon:e.jsx(ie,{})})},j={args:{...u.args,isDisabled:!0}},y={args:{...l.args},render:a=>e.jsx(ce,{validationErrors:{url:"Invalid URL"},children:e.jsx(r,{...a})})},z={args:{...l.args,validate:a=>a==="admin"?"Nice try!":null}},v={render:()=>e.jsxs(e.Fragment,{children:[e.jsx(k,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(r,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})},o={args:{...s.args,startCollapsed:!0},render:a=>e.jsxs(L,{direction:"row",gap:"4",children:[e.jsx(r,{...a,size:"small"}),e.jsx(r,{...a,size:"medium"})]})},I={decorators:[a=>e.jsx(V,{children:e.jsx(a,{})})],render:a=>e.jsx(e.Fragment,{children:e.jsx(A,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(n,{"aria-label":"Cactus icon button",icon:e.jsx(i,{}),size:"small",variant:"secondary"}),e.jsx(r,{"aria-label":"Search",...a,size:"small"}),e.jsx(n,{"aria-label":"Cactus icon button",icon:e.jsx(i,{}),size:"small",variant:"secondary"})]})})})},R={args:{...o.args},decorators:[a=>e.jsx(V,{children:e.jsx(a,{})})],render:a=>e.jsx(e.Fragment,{children:e.jsx(A,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(n,{"aria-label":"Cactus icon button",icon:e.jsx(i,{}),size:"small",variant:"secondary"}),e.jsx(r,{...a,size:"small"}),e.jsx(n,{"aria-label":"Cactus icon button",icon:e.jsx(i,{}),size:"small",variant:"secondary"})]})})})},w={args:{...o.args},render:a=>e.jsxs(L,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(r,{...a,size:"small"}),e.jsx(n,{"aria-label":"Cactus icon button",icon:e.jsx(i,{}),size:"small",variant:"secondary"}),e.jsx(E,{size:"small",variant:"secondary",children:"Hello world"}),e.jsx(r,{...a,size:"medium"}),e.jsx(n,{"aria-label":"Cactus icon button",icon:e.jsx(i,{}),size:"medium",variant:"secondary"}),e.jsx(E,{size:"medium",variant:"secondary",children:"Hello world"})]})},W={args:{...o.args},render:a=>{const B=c=>{console.log("Search value:",c)};return e.jsx(L,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(r,{...a,onChange:B,size:"small"})})}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'url',
    style: {
      maxWidth: '300px'
    },
    'aria-label': 'Search'
  }
}`,...s.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    defaultValue: 'https://example.com'
  }
}`,...f.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    label: 'Label'
  }
}`,...l.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    description: 'Description'
  }
}`,...S.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    isRequired: true
  }
}`,...C.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    isDisabled: true
  }
}`,...F.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: args => <SearchField {...args} placeholder="Enter a URL" size="small" icon={<RiEBike2Line />} />
}`,...u.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithIcon.args,
    isDisabled: true
  }
}`,...j.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args
  },
  render: args => <Form validationErrors={{
    url: 'Invalid URL'
  }}>
      <SearchField {...args} />
    </Form>
}`,...y.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    validate: value => value === 'admin' ? 'Nice try!' : null
  }
}`,...z.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <>
      <FieldLabel htmlFor="custom-field" id="custom-field-label" label="Custom Field" />
      <SearchField id="custom-field" aria-labelledby="custom-field-label" name="custom-field" defaultValue="Custom Field" />
    </>
}`,...v.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    startCollapsed: true
  },
  render: args => <Flex direction="row" gap="4">
      <SearchField {...args} size="small" />
      <SearchField {...args} size="medium" />
    </Flex>
}`,...o.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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
}`,...W.parameters?.docs?.source}}};const Je=["Default","Sizes","DefaultValue","WithLabel","WithDescription","Required","Disabled","WithIcon","DisabledWithIcon","ShowError","Validation","CustomField","StartCollapsed","InHeader","StartCollapsedInHeader","StartCollapsedWithButtons","StartCollapsedWithOnChange"];export{v as CustomField,s as Default,f as DefaultValue,F as Disabled,j as DisabledWithIcon,I as InHeader,C as Required,y as ShowError,x as Sizes,o as StartCollapsed,R as StartCollapsedInHeader,w as StartCollapsedWithButtons,W as StartCollapsedWithOnChange,z as Validation,S as WithDescription,u as WithIcon,l as WithLabel,Je as __namedExportsOrder,Ge as default};
