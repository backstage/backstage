import{bg as b,ca as x,cH as P,bR as e,c7 as f,w as y}from"./iframe-D-U3XCi_.js";import{P as l}from"./PluginHeader-DeQW69R9.js";import{C as p}from"./Container-BIjDLSH3.js";import{T as t}from"./Text-ClDibDjI.js";import{B as j}from"./BUIProvider-DxfsVl8y.js";import"./preload-helper-PPVm8Dsz.js";import"./index-1kifiLVj.js";import"./utils-BR4WWUPw.js";import"./useObjectRef-CPQl0FPH.js";import"./useCollection-CF2WGfOp.js";import"./useFocusRing-ChTmVwiQ.js";import"./openLink-CUqeOgDt.js";import"./Hidden-BT-waPLA.js";import"./keyboard-CQJNIbp7.js";import"./FocusScope-DUco4cAU.js";import"./useEvent-q-IyEWu-.js";import"./I18nProvider-QDJG5ejG.js";import"./usePress-D5PsofWG.js";import"./textSelection-C16VXh1L.js";import"./useControlledState-CXF1rY7r.js";import"./Link-TnLiXnjZ.js";import"./useLink-mEdVDOpX.js";import"./useHover-C7AGz9RX.js";import"./useLocalizedStringFormatter-CqlUbDUm.js";import"./Button-CNFlQLM7.js";import"./Label-67Mz0DTG.js";import"./useLabel-D8B5Ekv6.js";import"./useLabels-CrgyuspR.js";import"./number-v8QHaCn-.js";import"./useButton-CtCvtk7k.js";import"./Menu-CINXUjmU.js";import"./Autocomplete-BJ4aAY6l.js";import"./getItemCount-CsvmdeCi.js";import"./Input-DCWvse9e.js";import"./ListBox-tL8INFoA.js";import"./Text-CA-ViSRt.js";import"./useListState-DL4nEIqW.js";import"./Dialog-CdeEh2DO.js";import"./Heading-b4gjKqb9.js";import"./useOverlayTriggerState-BMh6qldU.js";import"./VisuallyHidden-DGDx8Mtn.js";import"./animation-DU5l6MIa.js";import"./SearchField-BEUS8UWT.js";import"./FieldError-DP0NgPGT.js";import"./useFormValidation-DIt9J9Zd.js";import"./useTextField-fdQNTT2p.js";import"./useField-CwYjWd3d.js";import"./useFormReset-DB--Cdia.js";import"./Virtualizer-CHPqgmXR.js";import"./useFilter-_RcD3Zjm.js";import"./getNodeText-6ofV-JPj.js";import"./Link-B5cob2RJ.js";import"./useResolvedHref-CKBZ7MYz.js";import"./Tooltip-ChAjjmE8.js";import"./VisuallyHidden-DEYQUWRk.js";import"./Tabs-D1QZxz8X.js";import"./useHasTabbableChild-DgDQ4HtX.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=f.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage style={{
      backgroundColor: '#c3f0ff'
    }}>
        <Container>
          <Text as="p">
            This content fills the remaining viewport height below the Header.
          </Text>
        </Container>
      </FullPage>
    </>
})`,...o.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage>
        <Container>
          <Text as="h2" variant="title-medium">
            Scrollable Content
          </Text>
          <Text as="p">
            The content below scrolls independently while the Header stays
            pinned at the top.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...a.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" tabs={tabs} />
      <FullPage>
        <Container>
          <Text as="p">
            The FullPage height adjusts automatically when the Header includes
            tabs, thanks to the ResizeObserver measuring the Header's actual
            height.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...s.input.parameters?.docs?.source}}};const ke=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,ke as __namedExportsOrder};
