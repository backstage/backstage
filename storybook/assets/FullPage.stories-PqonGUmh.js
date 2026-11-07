import{aN as x,r as b,aO as P,j as e,p as f,M as y}from"./iframe-DxHtOo4h.js";import{P as l}from"./PluginHeader-uLiwXt98.js";import{C as p}from"./Container-Dyw-xRXc.js";import{T as t}from"./Text-DFAGoz8c.js";import{B as j}from"./BUIProvider-CmywjT2L.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DmHLeUzN.js";import"./utils-CAdw532L.js";import"./useObjectRef-D6AnwJdq.js";import"./useCollection-awxMT8m7.js";import"./useFocusRing-DGlhroDz.js";import"./openLink-DpClGL1h.js";import"./Hidden-C-73n3sF.js";import"./keyboard-CuZJZT3E.js";import"./getMetaValue-Its-2R3E.js";import"./FocusScope-r31b8uNz.js";import"./useEvent-DtIMMGwF.js";import"./I18nProvider-CE0E7M0k.js";import"./usePress-Du1TfnjE.js";import"./textSelection-BtPkczBw.js";import"./useControlledState-BOC0pUVV.js";import"./Link-DYzEYMq9.js";import"./useLink-0ZbQlOH_.js";import"./useHover-CHigp1TN.js";import"./useLocalizedStringFormatter-DmTXBO-j.js";import"./Button-CI1wjYfp.js";import"./Label-JZuHlYG-.js";import"./useLabel-D3L5WW2z.js";import"./useLabels-DjvWLG0Y.js";import"./number-CI02LZgf.js";import"./useButton-DqQwDYXZ.js";import"./Menu-CcwK65l4.js";import"./Autocomplete-Blt4da4X.js";import"./useLoadMoreSentinel-CQ1OEE4r.js";import"./Input-DCzt78cV.js";import"./ListBox-D1dnPtKz.js";import"./SelectionIndicator-cIpGtlp8.js";import"./Text-um_55q4T.js";import"./useListState-DSnQWJm8.js";import"./Dialog-CiqaPTDN.js";import"./Heading-BuGaXw8R.js";import"./useOverlayTriggerState-DW7Yz7pQ.js";import"./VisuallyHidden-DeN7y8kn.js";import"./animation-BiNajT-w.js";import"./SearchField-CBYEWe3s.js";import"./FieldError-BJ_bTBup.js";import"./Form-DU0UIvGK.js";import"./useFormValidation-DZL7-bkS.js";import"./useTextField-CaKqjYbL.js";import"./useField-uTiKHKmu.js";import"./useFormReset-DnnjnzwE.js";import"./Virtualizer-Dd3Va1j-.js";import"./useFilter-hzwVE0Ie.js";import"./getNodeText-DoCtoq-X.js";import"./Link-D46jBLal.js";import"./useResolvedHref-DhHasAy4.js";import"./Tooltip-Ckxq85bP.js";import"./VisuallyHidden-CHNRctE-.js";import"./Tabs-DJAWQZiM.js";import"./useHasTabbableChild-JjYNIHVt.js";import"./BUIRoutingProvider-BThV0IfX.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=P(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
