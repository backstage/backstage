import{aN as x,r as b,aO as P,j as e,p as f,M as y}from"./iframe-psIK5yLO.js";import{P as l}from"./PluginHeader-ilZ3WlFi.js";import{C as p}from"./Container-CgMiHNXQ.js";import{T as t}from"./Text-DOm5LIYn.js";import{B as j}from"./BUIProvider-C83dKFXg.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Co8i19eP.js";import"./utils-CftV7EFJ.js";import"./useObjectRef-JQhcLLWe.js";import"./useCollection-BxTIozKT.js";import"./useFocusRing-MLrPTLpZ.js";import"./openLink-CZeZ1U9d.js";import"./Hidden-EyJpXoDf.js";import"./keyboard-BylIjWir.js";import"./getMetaValue-Cq3cpixi.js";import"./FocusScope-BaF3dqfB.js";import"./useEvent-CPLuyflN.js";import"./I18nProvider-NMyyBc2c.js";import"./usePress-Bjjm_ouf.js";import"./textSelection-Df_eiIv9.js";import"./useControlledState-vYZGCggF.js";import"./Link-DdGAkTrE.js";import"./useLink-DxgyLRF6.js";import"./useHover-B93NGpPn.js";import"./useLocalizedStringFormatter-B5sY9Tzc.js";import"./Button-DCPejbPh.js";import"./Label-ChcPP0Iy.js";import"./useLabel-C2F-sL7S.js";import"./useLabels-F6gridtO.js";import"./number-DZFckd1I.js";import"./useButton-CXcOFXh4.js";import"./Menu-Cd1s1SFg.js";import"./Autocomplete-BZz0XNI4.js";import"./useLoadMoreSentinel-BHlrtKZc.js";import"./Input-DlLNH5sR.js";import"./ListBox-DyEXVxzX.js";import"./SelectionIndicator-6G0ubX2B.js";import"./Text-MXkBOzgj.js";import"./useListState-DBlYMvZ2.js";import"./Dialog-DWTbBm9n.js";import"./Heading-DjGVTQwT.js";import"./useOverlayTriggerState-qoSrz_6x.js";import"./VisuallyHidden-DE3pxJfo.js";import"./animation-BSlcDtlM.js";import"./SearchField-B95InfVr.js";import"./FieldError-C-_S2X_i.js";import"./Form-Bxro-USV.js";import"./useFormValidation-DCSuHTe1.js";import"./useTextField-BjCw99mH.js";import"./useField-CEbJoclW.js";import"./useFormReset-B7JhnxRP.js";import"./Virtualizer-7YeiY43L.js";import"./useFilter-BZbDJEfE.js";import"./getNodeText-D2ZsTM19.js";import"./Link-CKWEFTQs.js";import"./useResolvedHref-D6pK9K8J.js";import"./Tooltip-CCeQ_uk9.js";import"./VisuallyHidden-MsMSJGMh.js";import"./Tabs-BqjBjRrc.js";import"./useHasTabbableChild-VrxO2AJ6.js";import"./BUIRoutingProvider-DGp64BJg.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=P(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
