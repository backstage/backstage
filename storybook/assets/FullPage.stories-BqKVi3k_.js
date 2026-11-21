import{aD as x,r as b,aE as f,j as e,p as P}from"./iframe-SO2aIStn.js";import{T as y}from"./TestRouter-DOXoJuJf.js";import{P as l}from"./PluginHeader-CXxPQB8i.js";import{C as p}from"./Container-D9-zMOy9.js";import{T as t}from"./Text-cxciQkna.js";import{B as j}from"./BUIProvider-NHPZXdvk.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B44vhErU.js";import"./index-B1nmLjVU.js";import"./utils-CwhAgYFH.js";import"./useObjectRef-C4fVgNdG.js";import"./useCollection-9mRLMTIV.js";import"./useFocusRing-DHTQT_lC.js";import"./Hidden-DBz78_xE.js";import"./keyboard-C1BU-mJQ.js";import"./getMetaValue-DQETedN7.js";import"./FocusScope-CheC5fUy.js";import"./useEvent-CsLuvQke.js";import"./I18nProvider-BWEEs8VU.js";import"./usePress-BBc3t8hk.js";import"./textSelection-BFKOQOEH.js";import"./useControlledState-BBNR5rbN.js";import"./Link-C7h4v_23.js";import"./useLink-iZI3eu6Z.js";import"./useHover-BwVq8lt0.js";import"./useLocalizedStringFormatter-_mO6LhbJ.js";import"./Button-BGvlfnXd.js";import"./Label-DQRKBs9u.js";import"./useLabel-BqXJUdIq.js";import"./useLabels-Cfrddupv.js";import"./number-pMJydGgE.js";import"./useButton-CWlVdGLP.js";import"./Menu-DUqVf11X.js";import"./Autocomplete-BZ8YDJ7_.js";import"./useLoadMoreSentinel-gwFkhROW.js";import"./Input-DUNVeClm.js";import"./ListBox-DQ-jeWuP.js";import"./SelectionIndicator-BjrFLQ2m.js";import"./Text-BwMA6h-D.js";import"./useListState-BlvQ7DnP.js";import"./Dialog-C2sEpcT_.js";import"./Heading-FIU2EEPa.js";import"./useOverlayTriggerState-Ck3aLq9p.js";import"./VisuallyHidden-DYnnSaaL.js";import"./animation-CUxQyO9K.js";import"./SearchField-BeqgXNBB.js";import"./FieldError-DL_kDnPL.js";import"./Form-D-cmgni0.js";import"./useFormValidation-DYfGZ5Hl.js";import"./useTextField-DFNj753b.js";import"./useField-C1HA1GEO.js";import"./useFormReset-CGHYUZyq.js";import"./Virtualizer-BdXtEcxp.js";import"./useFilter-D9qFlObz.js";import"./getNodeText-dX_pIma-.js";import"./BUIRoutingProvider-Br-iQzf_.js";import"./Link-9st-7jMZ.js";import"./Tooltip-DwIQbKbb.js";import"./VisuallyHidden-C3dBxFjz.js";import"./Tabs-dUzVdIcA.js";import"./useHasTabbableChild-C329bWmH.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=f(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
