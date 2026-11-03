import{aN as x,r as b,aO as P,j as e,p as f,M as y}from"./iframe-BteMx7zj.js";import{P as l}from"./PluginHeader-Bd1f4cK5.js";import{C as p}from"./Container-B0laxUEI.js";import{T as t}from"./Text-PuNIUZgT.js";import{B as j}from"./BUIProvider-D3_d0bOb.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Dfq8zbsI.js";import"./utils-Csf2qqlx.js";import"./useObjectRef-Dv9hKxnj.js";import"./useCollection-hncYRQ94.js";import"./useFocusRing-Yxf_B4Dt.js";import"./openLink-8VSUUPMi.js";import"./Hidden-DJWYjR2p.js";import"./keyboard-BDZOpMnZ.js";import"./getMetaValue-CM24UgTH.js";import"./FocusScope-DSCzOVHt.js";import"./useEvent-zyxRaVJO.js";import"./I18nProvider-D7X1BqX1.js";import"./usePress-Cuj1vnv1.js";import"./textSelection-pyBJCDu1.js";import"./useControlledState-B_XVpnvb.js";import"./Link-PuYhExGK.js";import"./useLink-CIFMF27b.js";import"./useHover-ZUHUyvdU.js";import"./useLocalizedStringFormatter-BUNRCctA.js";import"./Button-DbBRcBsa.js";import"./Label-BS5nCX70.js";import"./useLabel-CNCzQYRH.js";import"./useLabels-DAYEkzeR.js";import"./number-B2HcLMyw.js";import"./useButton-B0unMpfY.js";import"./Menu-Biz8K7LT.js";import"./Autocomplete-DEoGXkkT.js";import"./useLoadMoreSentinel-CLmS5r8T.js";import"./Input-D1pCj6QR.js";import"./ListBox-ByGB9dy0.js";import"./SelectionIndicator-D0UsIo-u.js";import"./Text-DAa_N41I.js";import"./useListState-29l-qECp.js";import"./Dialog-Q5LNQ4z6.js";import"./Heading-D791aLfH.js";import"./useOverlayTriggerState-jQQVBlrg.js";import"./VisuallyHidden-C_bCbf5d.js";import"./animation-HCfLZl62.js";import"./SearchField-D1zyAJHi.js";import"./FieldError-1bM4kudQ.js";import"./Form-DxoMSjVw.js";import"./useFormValidation-DeKlK0iK.js";import"./useTextField-DURVcyoY.js";import"./useField-Dmr5l1Md.js";import"./useFormReset-BkRpFdO1.js";import"./Virtualizer-BgO2Nlac.js";import"./useFilter-CfxRQt9S.js";import"./getNodeText-DPW91Olm.js";import"./Link-8QnqeAiH.js";import"./useResolvedHref-DazIgbZb.js";import"./Tooltip-KfFi-nNX.js";import"./VisuallyHidden-C4WQjF12.js";import"./Tabs-CM4yoijH.js";import"./useHasTabbableChild-COef8Kdy.js";import"./BUIRoutingProvider-CPad7EDH.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=P(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
})`,...s.input.parameters?.docs?.source}}};const _e=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,_e as __namedExportsOrder};
