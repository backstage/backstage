import{aD as x,r as b,aE as f,j as e,p as P}from"./iframe-BLrGTSaW.js";import{T as y}from"./TestRouter-aUMcUa6c.js";import{P as l}from"./PluginHeader-C3N6XP4h.js";import{C as p}from"./Container-Zo-uBSD-.js";import{T as t}from"./Text-D5gP-IGT.js";import{B as j}from"./BUIProvider-DbVXx7ab.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CAEKkElr.js";import"./index-Csl_cXug.js";import"./utils-DY5RBqiV.js";import"./useObjectRef-ZSOSKmjG.js";import"./useCollection-D37zMv_s.js";import"./useFocusRing-BB9hpzXx.js";import"./Hidden-mL7bCk3G.js";import"./keyboard-D3SBllk2.js";import"./getMetaValue-CAHBYg8p.js";import"./FocusScope-C-33xK2Z.js";import"./useEvent-C0Msdpds.js";import"./I18nProvider-q6Gkr_5S.js";import"./usePress-DBe51dZ5.js";import"./textSelection-DRK0jW1V.js";import"./useControlledState-DB6Fhmvl.js";import"./Link-B-txJRTO.js";import"./useLink-B1t0RWWb.js";import"./useHover-SA74TXF1.js";import"./useLocalizedStringFormatter-DQdAryoN.js";import"./Button-DRJWcbqL.js";import"./Label-CubIRV2P.js";import"./useLabel-CLI3Xr7r.js";import"./useLabels-CSSt0rmf.js";import"./number-y3IrGTZu.js";import"./useButton-DzeSStJg.js";import"./Menu-DgNMHoWv.js";import"./Autocomplete-HxKAEOXF.js";import"./useLoadMoreSentinel-zi8f4IaM.js";import"./Input-Cwi8rIcD.js";import"./ListBox-CfCrhkUW.js";import"./SelectionIndicator-P55eaM0I.js";import"./Text-BojrXTqg.js";import"./useListState-9pEU39WA.js";import"./Dialog-PPsdl47e.js";import"./Heading-Dk8FWKf-.js";import"./useOverlayTriggerState-BbSgKNtq.js";import"./VisuallyHidden-Da6yBUmy.js";import"./animation-BTuqI_dB.js";import"./SearchField-CG8SQMGH.js";import"./FieldError-4Ao0Q7ll.js";import"./Form-CUwMEZbK.js";import"./useFormValidation-DKsM2ztO.js";import"./useTextField-ByHjNULi.js";import"./useField-BDehp1MI.js";import"./useFormReset-Dw6LrR2q.js";import"./Virtualizer-CIsShc4t.js";import"./useFilter-BVf2WfPH.js";import"./getNodeText-BmvvdM47.js";import"./BUIRoutingProvider-DBWr1Axe.js";import"./Link-BMLKSF9h.js";import"./Tooltip-guwHEmuy.js";import"./useTooltipTriggerState-CzFxnGQ-.js";import"./VisuallyHidden-DJ1P_bLd.js";import"./Tabs-DPjiNclf.js";import"./useHasTabbableChild-C39BSEln.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=f(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
})`,...s.input.parameters?.docs?.source}}};const De=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,De as __namedExportsOrder};
