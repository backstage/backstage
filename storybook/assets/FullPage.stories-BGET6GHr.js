import{aD as x,r as b,aE as f,j as e,p as P}from"./iframe-C8V0qqb2.js";import{T as y}from"./TestRouter-gzyzuKmX.js";import{P as l}from"./PluginHeader-Bnp9_4UR.js";import{C as p}from"./Container-DANipgL2.js";import{T as t}from"./Text-DCzxn_GK.js";import{B as j}from"./BUIProvider-sHU7Fnoa.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CZTs28Z5.js";import"./index-X2scoYBO.js";import"./utils-D2G7Gr3-.js";import"./useObjectRef-Bmpa_pzq.js";import"./useCollection-BWA8DlX5.js";import"./useFocusRing-A5enshti.js";import"./Hidden-DiQ-sckr.js";import"./keyboard-C8VvzxKH.js";import"./getMetaValue-Cs0hmg7u.js";import"./FocusScope-QAIUBJGW.js";import"./useEvent-8_12ARkl.js";import"./I18nProvider-Cjl-_wzY.js";import"./usePress-DxDbMcWz.js";import"./textSelection-DSE97Rz3.js";import"./useControlledState-CSkhWUnX.js";import"./Link-r-9rOB6x.js";import"./useLink-C3y3JK0h.js";import"./useHover-BM2aAfmJ.js";import"./useLocalizedStringFormatter-BSUQ5ifA.js";import"./Button-BEmepp9I.js";import"./Label-lDwdRkmF.js";import"./useLabel-Du92kFjZ.js";import"./useLabels-D_iZwDzY.js";import"./number-BQr42Lr5.js";import"./useButton-dvUW2Qss.js";import"./Menu-DvYg4PQe.js";import"./Autocomplete-F_-RRsBG.js";import"./useLoadMoreSentinel-D-NY2IrU.js";import"./Input-C6rRPFvc.js";import"./ListBox-Ci7SfdT3.js";import"./SelectionIndicator-BqCnbUA9.js";import"./Text-C3Fp9zoI.js";import"./useListState-NmGMDQQG.js";import"./Dialog-R49q_bbw.js";import"./Heading-Cq8dttCG.js";import"./useOverlayTriggerState-BJpvAEhl.js";import"./VisuallyHidden-CoLsK902.js";import"./animation-CQDNL3hS.js";import"./SearchField-rGiMC4mQ.js";import"./FieldError-B6JD0CK_.js";import"./Form-ro32D7sS.js";import"./useFormValidation-DCkaOoFr.js";import"./useTextField-DZRsoRku.js";import"./useField-CnWanIwr.js";import"./useFormReset-BkDzJlqC.js";import"./Virtualizer-COa5zYj7.js";import"./useFilter-CFwrG83c.js";import"./getNodeText-Bt7Ku3rS.js";import"./BUIRoutingProvider-BxHvEIyM.js";import"./Link-DL_DXNWK.js";import"./Tooltip-Cd1w41ri.js";import"./VisuallyHidden-1eOCgzUX.js";import"./Tabs-DeT09nRU.js";import"./useHasTabbableChild-CRdsw-BA.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=f(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
