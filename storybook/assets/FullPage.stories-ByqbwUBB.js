import{bg as b,ca as x,cH as P,bR as e,c7 as f,w as y}from"./iframe-B-XWDeDQ.js";import{P as l}from"./PluginHeader-styqIq_I.js";import{C as p}from"./Container-CIpB3XCk.js";import{T as t}from"./Text-DEbeIV5h.js";import{B as j}from"./BUIProvider-D9rRdaFt.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Bhxil5SO.js";import"./utils-DALzhVoK.js";import"./useObjectRef-BjeGjbpr.js";import"./useCollection-CcbpGAId.js";import"./useFocusRing-rcGClAZz.js";import"./openLink-m4-wtxGX.js";import"./Hidden-BedOfKsW.js";import"./keyboard-DWqMnDLI.js";import"./FocusScope-B1T8Xa9R.js";import"./useEvent-DIgtVdes.js";import"./I18nProvider-DDduGJCb.js";import"./usePress-RR4GC8Vt.js";import"./textSelection-BxRq1vrn.js";import"./useControlledState-BYvHYB8a.js";import"./Link-DyYt6T9P.js";import"./useLink-BRc1bG3-.js";import"./useHover-CNCT38hS.js";import"./useLocalizedStringFormatter-BEmC_YO6.js";import"./Button-Ce-wB0G_.js";import"./Label-D7GSmtfn.js";import"./useLabel-DttkFmAP.js";import"./useLabels-B3aofaea.js";import"./number-CqHCUUB4.js";import"./useButton-Br7mSKpa.js";import"./Menu-EZJ7gDDK.js";import"./Autocomplete-CLdpdlQF.js";import"./getItemCount-CYeHBSCZ.js";import"./Input-tMw-Q_4-.js";import"./ListBox-DtjTlX1-.js";import"./Text-C6vZ8XAa.js";import"./useListState-CxhK3Zge.js";import"./Dialog-1i4lCtb4.js";import"./Heading-CPCq6sI-.js";import"./useOverlayTriggerState-Bvm7VbjX.js";import"./VisuallyHidden-CzanKvmL.js";import"./animation-DroFJ5da.js";import"./SearchField-DUA2Dtkm.js";import"./FieldError-ajciDvon.js";import"./useFormValidation-BrZcKhVQ.js";import"./useTextField-DMKViTdg.js";import"./useField-DPmJ-tA5.js";import"./useFormReset-C4aB3TBa.js";import"./Virtualizer-HiPpmuFs.js";import"./useFilter-BsZD2Zmw.js";import"./getNodeText-0mTvg6Ds.js";import"./Link-BcpcLriq.js";import"./useResolvedHref-F8wq_2PL.js";import"./Tooltip-D4Ye8L4j.js";import"./VisuallyHidden-CDIhlhrs.js";import"./Tabs-qnpjVUM5.js";import"./useHasTabbableChild-CwS7RPfa.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
