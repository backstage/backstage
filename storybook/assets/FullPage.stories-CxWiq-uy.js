import{be as b,c8 as x,cE as P,bQ as e,c5 as f,w as y}from"./iframe-CdNUyns1.js";import{P as l}from"./PluginHeader-DxLFfyzN.js";import{C as p}from"./Container-CQuT5iZb.js";import{T as t}from"./Text-FxBj8Ix2.js";import{B as j}from"./BUIProvider-BJ06Zhnc.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C5_u8aRu.js";import"./utils-B3O2Yp_M.js";import"./useObjectRef-CFuPSG1M.js";import"./useCollection-lN1Q5AFU.js";import"./useFocusRing-BuKVGuQV.js";import"./openLink-DihNKPlJ.js";import"./Hidden-CS8th6sD.js";import"./keyboard-DKfMEpD_.js";import"./FocusScope-BGoJKhy8.js";import"./useEvent-CUxtDg7f.js";import"./I18nProvider-B6FBVrT9.js";import"./usePress-_7EGmIU1.js";import"./textSelection-SXrH1sR5.js";import"./useControlledState-BN5fLvZ3.js";import"./Link-CCPkNvUQ.js";import"./useLink-Dpm6epyW.js";import"./useHover-Cn5cU9qj.js";import"./useLocalizedStringFormatter-qf--bxfb.js";import"./Button-Cb98tIb7.js";import"./Label-D16an-mE.js";import"./useLabel-BERv6pEw.js";import"./useLabels-uizblfZx.js";import"./number-CzhiuJx7.js";import"./useButton-BtcENp-V.js";import"./Menu-CLjOauqu.js";import"./Autocomplete-BkQbc6kZ.js";import"./getItemCount-ZzIrozYJ.js";import"./Input-CfbbQHzS.js";import"./ListBox-B_d110hq.js";import"./Text-CYsN3RIY.js";import"./useListState-736NwSrE.js";import"./Dialog-MeAFG64o.js";import"./Heading-CslegC5L.js";import"./useOverlayTriggerState-CxgiGkff.js";import"./VisuallyHidden-B5fHw0hs.js";import"./animation-Dtm5YrM0.js";import"./SearchField-DaycyAjt.js";import"./FieldError-CdWPta5W.js";import"./useFormValidation-DRFEp6qp.js";import"./useTextField-CRnA5sL5.js";import"./useField-CmzNUn8V.js";import"./useFormReset-BRZSsq_e.js";import"./Virtualizer-Bhbo0TE3.js";import"./useFilter-C3vSSGtB.js";import"./getNodeText-CJDdWeRh.js";import"./Link-Dm64VgEr.js";import"./useResolvedHref-CfjkVgWI.js";import"./Tooltip-DtfFdx8E.js";import"./VisuallyHidden-CtR-UuEP.js";import"./Tabs-MeMGvNfT.js";import"./useHasTabbableChild-D0b-tFZZ.js";import"./BUIRoutingProvider-DGbwW94E.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
