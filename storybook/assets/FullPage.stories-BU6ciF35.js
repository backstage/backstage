import{aD as x,r as b,aE as f,j as e,p as P}from"./iframe-jnmYTFb3.js";import{T as y}from"./TestRouter-DSyznIXU.js";import{P as l}from"./PluginHeader-GCQu9Bia.js";import{C as p}from"./Container-G5VvzId4.js";import{T as t}from"./Text-BYBX9Ih8.js";import{B as j}from"./BUIProvider-E5gJ_230.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C7-0R-zP.js";import"./index-C6hgsZfa.js";import"./utils-CKg7Fv9H.js";import"./useObjectRef-FWUTxVt4.js";import"./useCollection-FCL97-VQ.js";import"./useFocusRing-BdOMpJmy.js";import"./Hidden-xHEnn_eG.js";import"./keyboard-BEQ1RQMR.js";import"./getMetaValue-vz9tQ4MU.js";import"./FocusScope-BB1H8_4N.js";import"./useEvent-D0OSRjun.js";import"./I18nProvider-CZql2cBv.js";import"./usePress-0a27YkJt.js";import"./textSelection-BFpEW1JG.js";import"./useControlledState-CrGsVDTu.js";import"./Link-Bcwc5jRI.js";import"./useLink-BYcNvhDm.js";import"./useHover-uknbF-p6.js";import"./useLocalizedStringFormatter-DSPB4nHm.js";import"./Button-DgXb-SRY.js";import"./Label-B1pLoO_3.js";import"./useLabel-0FUhOvtV.js";import"./useLabels-BVz1Fy9t.js";import"./number-C6hsbYZL.js";import"./useButton-CukdYqmR.js";import"./Menu-C6Qkf6yN.js";import"./Autocomplete-BGEL4iKH.js";import"./useLoadMoreSentinel-CzOS9T98.js";import"./Input-CtX6cgqs.js";import"./ListBox-D9b_3aJQ.js";import"./SelectionIndicator-DQlGQCb5.js";import"./Text-Dmw7G-Ih.js";import"./useListState-BIY8hwSl.js";import"./Dialog-CFiC3NsL.js";import"./Heading-CaUyptTa.js";import"./useOverlayTriggerState-B51CCYAg.js";import"./VisuallyHidden-CeTYnCx4.js";import"./animation-CVivYYSw.js";import"./SearchField-B3RrXY8R.js";import"./FieldError-Bb31lOY2.js";import"./Form-Cx-jaggY.js";import"./useFormValidation-Dh_I7y9w.js";import"./useTextField-CopA5Leg.js";import"./useField-ChuJenZM.js";import"./useFormReset-BqTrmbM5.js";import"./Virtualizer-DZoVQKiQ.js";import"./useFilter-CTqGkcG4.js";import"./getNodeText-DfNavkRZ.js";import"./BUIRoutingProvider-D-btTMCD.js";import"./Link-Ch5X3VFC.js";import"./Tooltip-B1tKDHkx.js";import"./VisuallyHidden-DvPBykmo.js";import"./Tabs-CJgiO4jl.js";import"./useHasTabbableChild-BUJ5ntHE.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=f(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
