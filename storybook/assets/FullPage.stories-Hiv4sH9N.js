import{aN as x,r as b,aO as P,j as e,p as f,M as y}from"./iframe-BIybnMXI.js";import{P as l}from"./PluginHeader-BXfbrw_1.js";import{C as p}from"./Container-B2OEx_mY.js";import{T as t}from"./Text-kzCYyEIk.js";import{B as j}from"./BUIProvider-BGFGf2ST.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DRRrr8Fx.js";import"./utils-BNWuCLNS.js";import"./useObjectRef-CbQSD8dp.js";import"./useCollection-CEagf3y0.js";import"./useFocusRing-14fD-rIq.js";import"./openLink-_nIoHyS5.js";import"./Hidden-CFw0S2EP.js";import"./keyboard-QYh7qiEd.js";import"./getMetaValue-BRyplxPo.js";import"./FocusScope-Dr9kUHv8.js";import"./useEvent-DIefrTiE.js";import"./I18nProvider-CQNLYzfm.js";import"./usePress-BTAge9_g.js";import"./textSelection-Dxc81R1_.js";import"./useControlledState-CPQ03ATl.js";import"./Link-BUeGDbdR.js";import"./useLink-Ci8H16Fb.js";import"./useHover-S-WcK3-g.js";import"./useLocalizedStringFormatter-DqXT6BB6.js";import"./Button-ejIqj8kn.js";import"./Label-DU9qK1mL.js";import"./useLabel-DOK2Qr8p.js";import"./useLabels-BYUTWxfw.js";import"./number-DllxhX9c.js";import"./useButton-DMoQoLuK.js";import"./Menu-Cb7omWrx.js";import"./Autocomplete-Dq4_Bll7.js";import"./useLoadMoreSentinel-BkCjiMYy.js";import"./Input-DW6Ftfr4.js";import"./ListBox-cv5bBszz.js";import"./SelectionIndicator-Bphfg2M8.js";import"./Text-BmQ5Jf8N.js";import"./useListState-C6sSAmPu.js";import"./Dialog-P2aWfCr-.js";import"./Heading-Bpc_kUuP.js";import"./useOverlayTriggerState-Dl82bCOM.js";import"./VisuallyHidden-BHXmXcE_.js";import"./animation-ChJpkI5_.js";import"./SearchField-CExVv26X.js";import"./FieldError-BHpvYtcE.js";import"./Form-BtbuUqgK.js";import"./useFormValidation-CvU55wbv.js";import"./useTextField-DTDPL3Jy.js";import"./useField-Di3KpqBE.js";import"./useFormReset-DCi4NeAi.js";import"./Virtualizer-G1fyxnzt.js";import"./useFilter-dFEuKb-v.js";import"./getNodeText-De_eihzQ.js";import"./Link-Dx0KSTlF.js";import"./useResolvedHref-Cp7X7JN9.js";import"./Tooltip-DG-AcMGe.js";import"./VisuallyHidden-B8ug4AzP.js";import"./Tabs-DIrD9miZ.js";import"./useHasTabbableChild-0LlZB47P.js";import"./BUIRoutingProvider-CnIqwql2.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=P(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
