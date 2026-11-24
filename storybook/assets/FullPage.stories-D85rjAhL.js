import{aD as x,r as b,aE as f,j as e,p as P}from"./iframe-4nxqZpQH.js";import{T as y}from"./TestRouter-CcRgr-w9.js";import{P as l}from"./PluginHeader-JVxaT4Jm.js";import{C as p}from"./Container-DjZ7YbpG.js";import{T as t}from"./Text-BR7AZu71.js";import{B as j}from"./BUIProvider-uTHUz88Y.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CKs39xo2.js";import"./index-CS0rKBQt.js";import"./utils-B_CpPLsC.js";import"./useObjectRef-CnTOzlP3.js";import"./useCollection-BK1naX3I.js";import"./useFocusRing-DLLTypMY.js";import"./Hidden-BHEINN-B.js";import"./keyboard-DrZcZ53x.js";import"./getMetaValue-yJ3DJPKd.js";import"./FocusScope-DlgAda7i.js";import"./useEvent-C0ADcz5S.js";import"./I18nProvider-C7-lUSN5.js";import"./usePress-IehbRc7n.js";import"./textSelection-BqsoCXBu.js";import"./useControlledState-BipTuFfk.js";import"./Link-B2ptW9aQ.js";import"./useLink-8qNQubjm.js";import"./useHover-6QHjRx59.js";import"./useLocalizedStringFormatter-4T10-1Qu.js";import"./Button-DcUmzCDo.js";import"./Label-DFDy7rWc.js";import"./useLabel-B3SXQ9nf.js";import"./useLabels-LZrLLl2Z.js";import"./number-CWCm_kOs.js";import"./useButton-kIYEhZRP.js";import"./Menu-PKYvBVUk.js";import"./Autocomplete-DCUHQcUI.js";import"./useLoadMoreSentinel-B02Bo39W.js";import"./Input-Cdk-ot_F.js";import"./ListBox-CXErTZBH.js";import"./SelectionIndicator-qqCHqb3k.js";import"./Text-CLYtJTsR.js";import"./useListState-B4w7DXJu.js";import"./Dialog-DAjHlvOp.js";import"./Heading-Bpva74LM.js";import"./useOverlayTriggerState-_agSFwEY.js";import"./VisuallyHidden-DBTOudP9.js";import"./animation-Drc_DBoe.js";import"./SearchField-9UZ2-WMN.js";import"./FieldError-BXBChgnT.js";import"./Form-CqRLvZ1x.js";import"./useFormValidation-ZZF8mbB2.js";import"./useTextField-NQJPnPp0.js";import"./useField-C-Ng_aIY.js";import"./useFormReset-0ATPKRb6.js";import"./Virtualizer-DuLjAgv-.js";import"./useFilter-CfSo70hf.js";import"./getNodeText-CyElTUXt.js";import"./BUIRoutingProvider-Du5oqrd5.js";import"./Link-BzTCTbm1.js";import"./Tooltip-CwMNMe52.js";import"./VisuallyHidden-CwrHqQpA.js";import"./Tabs-DFGT9qNf.js";import"./useHasTabbableChild-DvijzTr5.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=f(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=P.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};const qe=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,qe as __namedExportsOrder};
