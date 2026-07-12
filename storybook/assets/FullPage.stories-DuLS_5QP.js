import{bg as b,ca as x,cH as P,bR as e,c7 as f,w as y}from"./iframe-CO97OZwt.js";import{P as l}from"./PluginHeader-BACh4IWH.js";import{C as p}from"./Container-CmFftQRJ.js";import{T as t}from"./Text-CFTB_dmB.js";import{B as j}from"./BUIProvider-DP0D57Ws.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B3bIYSdF.js";import"./utils-2TV2V9Pm.js";import"./useObjectRef-BjR_AUMv.js";import"./useCollection-CEmDEXQB.js";import"./useFocusRing-DpTaIKKT.js";import"./openLink-DjHgJdx-.js";import"./Hidden-BxbxCXE4.js";import"./keyboard-BickwFmq.js";import"./FocusScope-D-WCKiLu.js";import"./useEvent-20WkBKcw.js";import"./I18nProvider-D_UQ682O.js";import"./usePress-fdXfQbXd.js";import"./textSelection-d1OV0NFv.js";import"./useControlledState-BEju7Fey.js";import"./Link-QF869QsS.js";import"./useLink-CWVad6H2.js";import"./useHover-DfkDjIau.js";import"./useLocalizedStringFormatter-g2jqPPVg.js";import"./Button-iLMA8lft.js";import"./Label-k8w2r2dv.js";import"./useLabel-Bfjkj2_o.js";import"./useLabels-DeJJCjaB.js";import"./number-CjvqZMqN.js";import"./useButton-CXBhsRKD.js";import"./Menu-BNEMP5I2.js";import"./Autocomplete-CrnLxG4M.js";import"./getItemCount-bOoscO0L.js";import"./Input-CpR11oJO.js";import"./ListBox-D_ItXpox.js";import"./Text-CUpMtLsq.js";import"./useListState-5cme9xYE.js";import"./Dialog-BS9Kha0D.js";import"./Heading-ZVC2xVlm.js";import"./useOverlayTriggerState-NEjJCFrQ.js";import"./VisuallyHidden-BMX6CTzb.js";import"./animation-ChIICKgy.js";import"./SearchField-BkcNXse-.js";import"./FieldError-CskjcK-s.js";import"./useFormValidation-qxu3lVOI.js";import"./useTextField-Q1vUUksR.js";import"./useField-Ajy5nl1g.js";import"./useFormReset-Dt1KXmT7.js";import"./Virtualizer-CSSplw_J.js";import"./useFilter-B8cQfcZU.js";import"./getNodeText-BkNsoDUa.js";import"./Link-DIGCm1es.js";import"./useResolvedHref-CjMDsBRN.js";import"./Tooltip-B6Od5mh9.js";import"./VisuallyHidden-D6SOqp0g.js";import"./Tabs-CCfzA8r4.js";import"./useHasTabbableChild-DMIxpevJ.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
