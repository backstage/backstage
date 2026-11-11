import{aD as x,r as b,aE as f,j as e,p as P}from"./iframe-CEdcshkh.js";import{T as y}from"./TestRouter-BPsjLese.js";import{P as l}from"./PluginHeader-CHCmVrG0.js";import{C as p}from"./Container-2eKYjIq5.js";import{T as t}from"./Text-OK4ZkFhh.js";import{B as j}from"./BUIProvider-BnOYjhiQ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BMdILVLE.js";import"./index-Bowgs7Nu.js";import"./utils-B3z3rPQ3.js";import"./useObjectRef-Cea8mF9S.js";import"./useCollection-BY8b1dc1.js";import"./useFocusRing-CKR_B2iC.js";import"./Hidden-nn8Lz43U.js";import"./keyboard-CcJmHJZu.js";import"./getMetaValue-BMvIIQYf.js";import"./FocusScope-BMlOaqzR.js";import"./useEvent-CrCFiZpU.js";import"./I18nProvider-GWcSS_jn.js";import"./usePress-CLU-UWu1.js";import"./textSelection-WSwNKXEc.js";import"./useControlledState-CY36eiiU.js";import"./Link-Bu1zYbuE.js";import"./useLink-RRxHq4ZS.js";import"./useHover-C0ptGV0J.js";import"./useLocalizedStringFormatter-Bt4wlDEw.js";import"./Button-Cztc6Ql0.js";import"./Label-9Olhdt6S.js";import"./useLabel-BWFl0EGX.js";import"./useLabels-B11tK9ex.js";import"./number-tjQdiso3.js";import"./useButton-DltJ2Eig.js";import"./Menu-B1TrIrBv.js";import"./Autocomplete-0kwx_A17.js";import"./useLoadMoreSentinel-DhzACs8q.js";import"./Input-4DhKHAbt.js";import"./ListBox-CWJPYUhe.js";import"./SelectionIndicator-A8NT-hkw.js";import"./Text-CBxuRi-e.js";import"./useListState-Bk9MfIWW.js";import"./Dialog-p9B8nTzS.js";import"./Heading-BlKCRajT.js";import"./useOverlayTriggerState-BX1potNy.js";import"./VisuallyHidden-Co8SnzJt.js";import"./animation-NCXLQN6E.js";import"./SearchField-DA0clI6F.js";import"./FieldError-Ry11NBFn.js";import"./Form-C1TWgvPe.js";import"./useFormValidation-DNL4ciTO.js";import"./useTextField-Do_qjUTZ.js";import"./useField-qlQhlPsk.js";import"./useFormReset-DV0mYMiO.js";import"./Virtualizer-B3P-IoCD.js";import"./useFilter-AT1z44Xq.js";import"./getNodeText-CxpOAKrb.js";import"./BUIRoutingProvider-C_K9tmxr.js";import"./Link-CqmJVQEw.js";import"./Tooltip-DfjSVAXc.js";import"./VisuallyHidden-BWZi01QI.js";import"./Tabs-4ThGF_Nn.js";import"./useHasTabbableChild-DOyBKN9F.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=f(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
