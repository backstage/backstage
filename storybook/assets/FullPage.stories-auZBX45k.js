import{be as b,c8 as x,cE as P,bQ as e,c5 as f,w as y}from"./iframe-BjdV6pPy.js";import{P as l}from"./PluginHeader-B588LFNS.js";import{C as p}from"./Container-cCpCOOvI.js";import{T as t}from"./Text-2qFeoARa.js";import{B as j}from"./BUIProvider-hQPe3HQo.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Bt664Isb.js";import"./utils-DS91ArTN.js";import"./useObjectRef-BWm5y5ll.js";import"./useCollection-BCIWtvHl.js";import"./useFocusRing-BtM4iWFp.js";import"./openLink-2_8aeNBf.js";import"./Hidden-CWD5f7cO.js";import"./keyboard-v6BsnER9.js";import"./FocusScope-Bwrh0YJM.js";import"./useEvent-BvS_3wCS.js";import"./I18nProvider-C9qy98Iq.js";import"./usePress-CbZGFUaz.js";import"./textSelection-Bw3EsPUC.js";import"./useControlledState-CC4OZRef.js";import"./Link-BtxRanQh.js";import"./useLink-eAyhf4dH.js";import"./useHover-wrMqleU9.js";import"./useLocalizedStringFormatter-ByeqNOlS.js";import"./Button-BT4zDcIq.js";import"./Label-wgpa9Qzo.js";import"./useLabel-rYSXIktO.js";import"./useLabels-BRtq5QIX.js";import"./number-DfMxFCvL.js";import"./useButton-Ds0I4pCp.js";import"./Menu-S7MRCk7b.js";import"./Autocomplete-SqsUyN4V.js";import"./getItemCount-DBlkD6Tr.js";import"./Input-CTu8xFkM.js";import"./ListBox-CUBWjVam.js";import"./Text-CaKKG2z6.js";import"./useListState-rFEKmPpf.js";import"./Dialog-CBR7V254.js";import"./Heading-BM7IRWg0.js";import"./useOverlayTriggerState-CHBpPTe6.js";import"./VisuallyHidden-DguUcwTj.js";import"./animation-CUNcUTdh.js";import"./SearchField-Ds64Kpmi.js";import"./FieldError-DMbmG7CN.js";import"./useFormValidation-C-4l-Tk0.js";import"./useTextField-CnlbGBjJ.js";import"./useField--MjjeZIX.js";import"./useFormReset-C1LKrH4D.js";import"./Virtualizer-Bf2dRF1C.js";import"./useFilter-D2OBeWr5.js";import"./getNodeText-BUNYwR5J.js";import"./Link-CTaECoxW.js";import"./useResolvedHref-CbsOzEeI.js";import"./Tooltip-CBiKcEb6.js";import"./VisuallyHidden-BOOpy3ib.js";import"./Tabs-DXBwK9P8.js";import"./useHasTabbableChild-C-PBrVQk.js";import"./BUIRoutingProvider-a7k64s_W.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=f.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...o.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...a.input.parameters?.docs?.source}}};const Se=["Default","WithScrollableContent","WithTabs"];export{o as Default,s as WithScrollableContent,a as WithTabs,Se as __namedExportsOrder};
